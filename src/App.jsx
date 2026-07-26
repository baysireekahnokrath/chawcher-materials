import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search, Lock, Unlock, Plus, Edit3, Trash2, RefreshCw,
  Layers, Package, X, ExternalLink, Save, Filter, Upload, Image as ImageIcon,
  AlertTriangle
} from 'lucide-react';

// 🔗 Google Apps Script Web App URL (Updated)
const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/AKfycbxVISlV4pMVIvfnpe9_65nkhQWLShJBWwBBt-Luh3xZnGG36Zqgf-JutGxcrFcr_Mo3/exec";

// รหัสผ่านสำหรับเข้าสู่ระบบเจ้าหน้าที่
const ADMIN_PASSWORD = "chawcher1234";

// ฟีเจอร์ตัวเลือกสำหรับ Checkbox
const AVAILABLE_FEATURES = [
  'กันน้ำ (Water Repellent)',
  'กันไรฝุ่น (Anti-Dust Mite)',
  'ทนรอยขีดข่วน (Pet Friendly)',
  'ลามไฟช้า (Fire Retardant)',
  'ภายนอกอาคาร (Outdoor/UV)'
];

const INITIAL_MATERIALS = [
  {
    id: "1",
    sku: "FB-VT-001",
    name: "Vintage Velvet Emerald",
    category: "Fabrics",
    meters: 45.5,
    price: 380,
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600",
    description: "ผ้ากำมะหยี่เนื้อหนาสีเขียวมรกต สัมผัสนุ่ม เหมาะสำหรับบุโซฟาและเก้าอี้วินเทจ",
    width: "140 cm",
    rubTest: "50000",
    features: "กันไรฝุ่น (Anti-Dust Mite), ทนรอยขีดข่วน (Pet Friendly)"
  }
];

export default function App() {
  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem('chawcher_materials_data');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');

  const [editingItem, setEditingItem] = useState(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('chawcher_materials_data', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    if (GOOGLE_SHEET_API_URL) {
      fetchFromGoogleSheets();
    }
  }, []);

  const getUnit = (categoryName) => {
    if (!categoryName) return 'เมตร';
    const cat = categoryName.toLowerCase();
    return (cat.includes('leather') || cat.includes('หนัง')) ? 'ตร.ฟุต' : 'เมตร';
  };

  const categories = useMemo(() => {
    const baseCategories = ['Fabrics', 'Leathers', 'Thai Heritage Crafts'];
    const customFromItems = materials.map(item => item.category).filter(Boolean);
    const combined = Array.from(new Set([...baseCategories, ...customFromItems]));
    return ['ทั้งหมด', ...combined];
  }, [materials]);

  const fetchFromGoogleSheets = async () => {
    if (!GOOGLE_SHEET_API_URL) return;
    setIsLoading(true);
    setSyncStatus('กำลังโหลดข้อมูลจาก Google Sheets...');
    try {
      const res = await fetch(GOOGLE_SHEET_API_URL);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setMaterials(data);
        setSyncStatus('ดึงข้อมูลล่าสุดเรียบร้อย');
      } else {
        setSyncStatus('ไม่พบข้อมูลใน Google Sheets');
      }
    } catch (err) {
      console.error(err);
      setSyncStatus('เกิดข้อผิดพลาดในการดึงข้อมูล');
    } finally {
      setIsLoading(false);
      setTimeout(() => setSyncStatus(''), 4000);
    }
  };

  const syncToGoogleSheets = async (updatedData) => {
    if (!GOOGLE_SHEET_API_URL) return;
    setIsLoading(true);
    setSyncStatus('กำลังบันทึกลง Google Sheets...');
    try {
      await fetch(GOOGLE_SHEET_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedData }),
        mode: 'no-cors'
      });
      setSyncStatus('บันทึกลง Google Sheets เรียบร้อยแล้ว!');
    } catch (err) {
      console.error(err);
      setSyncStatus('บันทึกไม่สำเร็จ ตรวจสอบการเชื่อมต่อ');
    } finally {
      setIsLoading(false);
      setTimeout(() => setSyncStatus(''), 4000);
    }
  };

  const uploadImageToGoogleDrive = async (file, sku) => {
    if (!GOOGLE_SHEET_API_URL) return null;
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result;
          const response = await fetch(GOOGLE_SHEET_API_URL, {
            method: 'POST',
            body: JSON.stringify({
              action: 'uploadImage',
              base64Data: base64Data,
              sku: sku
            })
          });
          const result = await response.json();
          if (result.status === 'success') {
            resolve(result.imageUrl);
          } else {
            reject(new Error(result.message || 'การอัปโหลดไฟล์ล้มเหลว'));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLoginModal(false);
      setPasswordInput('');
      setLoginError('');
    } else {
      setLoginError('รหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleLogout = () => { setIsAdmin(false); };

  const handleOpenAddModal = () => {
    setEditingItem({
      id: Date.now().toString(),
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      category: 'Fabrics',
      meters: 0,
      price: 0,
      imageUrl: '',
      description: '',
      width: '',
      rubTest: '',
      features: []
    });
    setIsNewItem(true);
    setEditingItem({...editingItem, features: []});
  };

  const handleOpenEditModal = (item) => {
    const featuresArray = typeof item.features === 'string' && item.features.length > 0
      ? item.features.split(', ')
      : (Array.isArray(item.features) ? item.features : []);

    setEditingItem({ ...item, features: featuresArray });
    setIsNewItem(false);
    setFilePreview(item.imageUrl || '');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    let finalCategory = editingItem.category;
    if (isCustomCategory && customCategoryName.trim()) finalCategory = customCategoryName.trim();

    let finalImageUrl = editingItem.imageUrl;

    if (selectedFile) {
      setIsUploadingImage(true);
      try {
        const driveUrl = await uploadImageToGoogleDrive(selectedFile, editingItem.sku);
        if (driveUrl) finalImageUrl = driveUrl;
      } catch (err) {
        console.error('Error uploading image:', err);
      } finally {
        setIsUploadingImage(false);
      }
    }

    const itemToSave = {
      ...editingItem,
      category: finalCategory,
      imageUrl: finalImageUrl,
      features: Array.isArray(editingItem.features) ? editingItem.features.join(', ') : '' 
    };

    const updated = isNewItem 
        ? [itemToSave, ...materials] 
        : materials.map(m => m.id === itemToSave.id ? itemToSave : m);

    setMaterials(updated);
    setEditingItem(null);
    setSelectedFile(null);
    setFilePreview('');
    syncToGoogleSheets(updated);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      const updated = materials.filter(m => m.id !== itemToDelete);
      setMaterials(updated);
      syncToGoogleSheets(updated);
      setItemToDelete(null);
    }
  };

  const filteredMaterials = materials.filter(item => {
    const matchesCategory = selectedCategory === 'ทั้งหมด' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans antialiased">
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-600 text-neutral-950 p-2 rounded-lg font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-amber-500">Chaw Cher</h1>
            </div>
          </div>
          <div className="flex items-center space-x-3">
             {isAdmin ? (
              <button onClick={handleLogout} className="text-xs bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full text-amber-400">
                โหมดเจ้าหน้าที่ (Admin)
              </button>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1.5 rounded-md flex items-center gap-1.5 border border-neutral-700 transition">
                <Lock className="w-3 h-3 text-amber-500" /> เข้าสู่ระบบ
              </button>
            )}
          </div>
        </div>
      </header>
      
      {/* (rest of the UI remains the same - simplified here for brevity, ensure you copy the full UI structure if needed) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((item) => (
            <div key={item.id} className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden">
                <div className="aspect-[4/3] bg-neutral-900 flex items-center justify-center">
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <ImageIcon className="w-10 h-10 text-neutral-700" />}
                </div>
                <div className="p-4">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="text-xs text-neutral-400">{item.sku}</p>
                </div>
            </div>
          ))}
        </div>
      </main>
      
      {/* ... (Keep existing Modals: LoginModal, EditModal, ConfirmDelete) ... */}
    </div>
  );
}
