import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search, Lock, Unlock, Plus, Edit3, Trash2, RefreshCw,
  Layers, Package, X, ExternalLink, Save, Filter, Upload, Image as ImageIcon,
  AlertTriangle
} from 'lucide-react';

// 🔗 Google Apps Script Web App URL
const GOOGLE_SHEET_API_URL = "https://script.google.com/macros/s/AKfycbyZ-BewEqqU_IZ_uA-swcryD7gKQ9BQppYtHCE2ceFtx2M_dUIHyDhwe7Il9js9LQ5M/exec";

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
  },
  {
    id: "2",
    sku: "LT-NV-002",
    name: "Nappa Genuine Leather Cognac",
    category: "Leathers",
    meters: 18.0,
    price: 850,
    imageUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=600",
    description: "หนังแท้ Nappa สีคอนยัค คัดสรรเศษผืนคุณภาพสูงจากอุตสาหกรรมเฟอร์นิเจอร์ส่งออก",
    width: "",
    rubTest: "",
    features: "ทำความสะอาดง่าย"
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

  // State สำหรับ Modal เพิ่ม/แก้ไข
  const [editingItem, setEditingItem] = useState(null);
  const [isNewItem, setIsNewItem] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // สำหรับ Modal ยืนยันการลบ

  // Custom Category & File Upload States
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

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const handleOpenAddModal = () => {
    setEditingItem({
      id: Date.now().toString(),
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      category: 'Fabrics',
      meters: 0,
      price: 0,
      imageUrl: '', // ลบ default image ออก ให้ว่างเปล่า
      description: '',
      width: '',
      rubTest: '',
      features: [] // เก็บเป็น Array สำหรับระบบ Checkbox
    });
    setIsNewItem(true);
    setIsCustomCategory(false);
    setCustomCategoryName('');
    setSelectedFile(null);
    setFilePreview('');
  };

  const handleOpenEditModal = (item) => {
    // แปลง features จาก String ที่เก็บใน Sheet กลับเป็น Array สำหรับ Checkbox
    const featuresArray = typeof item.features === 'string' && item.features.length > 0
      ? item.features.split(', ')
      : (Array.isArray(item.features) ? item.features : []);

    setEditingItem({ ...item, features: featuresArray });
    setIsNewItem(false);
    setIsCustomCategory(false);
    setCustomCategoryName('');
    setSelectedFile(null);
    setFilePreview(item.imageUrl || '');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFilePreview(previewUrl);
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    let finalCategory = editingItem.category;

    if (isCustomCategory && customCategoryName.trim()) {
      finalCategory = customCategoryName.trim();
    }

    let finalImageUrl = editingItem.imageUrl;

    // อัปโหลดรูปภาพใหม่ถ้ามีการเลือกไฟล์
    if (selectedFile) {
      setIsUploadingImage(true);
      setSyncStatus('กำลังอัปโหลดรูปภาพไปยัง Google Drive...');
      try {
        const driveUrl = await uploadImageToGoogleDrive(selectedFile, editingItem.sku);
        if (driveUrl) {
          finalImageUrl = driveUrl;
        }
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
      // แปลง Array กลับเป็น String กั้นด้วยลูกน้ำ เพื่อเซฟลง Sheet ง่ายๆ
      features: Array.isArray(editingItem.features) ? editingItem.features.join(', ') : '' 
    };

    let updated;
    if (isNewItem) {
      updated = [itemToSave, ...materials];
    } else {
      updated = materials.map(m => m.id === itemToSave.id ? itemToSave : m);
    }

    setMaterials(updated);
    setEditingItem(null);
    setSelectedFile(null);
    setFilePreview('');
    syncToGoogleSheets(updated);
  };

  const confirmDelete = (id) => {
    setItemToDelete(id);
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
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans antialiased">
      
      {/* Header Bar */}
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-amber-600 text-neutral-950 p-2 rounded-lg font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-amber-500">Chaw Cher</h1>
              <p className="text-xs text-neutral-400">Rescued & Surplus Upholstery Material Archive</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a 
              href="https://chawcher.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-xs text-neutral-400 hover:text-amber-400 flex items-center gap-1 transition"
            >
              กลับสู่ chawcher.com <ExternalLink className="w-3 h-3" />
            </a>

            {}
            {isAdmin ? (
              <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-medium text-amber-400">โหมดเจ้าหน้าที่ (Admin)</span>
                <button 
                  onClick={handleLogout}
                  className="p-1 hover:bg-amber-500/20 rounded-full text-neutral-400 hover:text-white transition"
                  title="ออกจากระบบ"
                >
                  <Unlock className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="text-xs bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1.5 rounded-md flex items-center gap-1.5 border border-neutral-700 transition"
              >
                <Lock className="w-3 h-3 text-amber-500" /> เข้าสู่ระบบเจ้าหน้าที่
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-neutral-950 border-b border-neutral-800 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-amber-400 text-xs font-medium mb-4">
            <span>ณCher Material Explorer</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            คลังผ้าและหนัง Rescued เกรดพรีเมียม <br />
            <span className="text-amber-500">สำหรับงานโซฟาและเฟอร์นิเจอร์</span>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl">
            รวบรวมวัสดุส่วนเกิน (Surplus & Archive) จากโรงงานทอ สตูดิโอไทย และยุโรป คัดสรรด้วยมาตรฐานช่าง Chaw Cher เช็กจำนวนสต็อกพร้อมใช้งานได้ทันที
          </p>

          {}
          {syncStatus && (
            <div className="mt-4 inline-flex items-center gap-2 bg-neutral-800 border border-neutral-700 text-amber-400 text-xs px-3 py-1.5 rounded-md">
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading || isUploadingImage ? 'animate-spin' : ''}`} />
              {syncStatus}
            </div>
          )}
        </div>
      </section>

      {}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-8">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input 
              type="text"
              placeholder="ค้นหาชื่อวัสดุ, รหัส SKU, ชนิดวัสดุ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          <div className="flex items-center gap-3">
            {GOOGLE_SHEET_API_URL && (
              <button
                onClick={fetchFromGoogleSheets}
                disabled={isLoading}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs px-3 py-2.5 rounded-lg border border-neutral-700 flex items-center gap-1.5 transition"
                title="ดึงข้อมูลล่าสุดจาก Google Sheets"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                รีเฟรชสต็อก
              </button>
            )}

            {isAdmin && (
              <button 
                onClick={handleOpenAddModal}
                className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-medium text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-lg shadow-amber-600/20 transition"
              >
                <Plus className="w-4 h-4" /> เพิ่มวัสดุเข้าคลัง
              </button>
            )}
          </div>
        </div>

        {}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <Filter className="w-4 h-4 text-neutral-500 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-neutral-950'
                  : 'bg-neutral-950 text-neutral-400 border border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((item) => (
            <div 
              key={item.id}
              className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition flex flex-col group relative"
            >
              <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden flex items-center justify-center">
                {item.imageUrl ? (
                  <img 
                    src={item.imageUrl} 
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-neutral-700">
                    <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                    <span className="text-[10px] uppercase tracking-wider">No Image</span>
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur border border-neutral-800 text-neutral-300 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md font-mono shadow-md">
                  {item.sku}
                </div>
                
                <div className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 shadow-md ${
                  Number(item.meters) > 0 
                    ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-800/80'
                    : 'bg-rose-950/90 text-rose-400 border border-rose-800/80'
                }`}>
                  <Package className="w-3 h-3" />
                  {Number(item.meters) > 0 ? `เหลือ ${item.meters} ${getUnit(item.category)}` : 'สินค้าหมด'}
                </div>
              </div>

              {}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-amber-500 font-medium mb-1">{item.category}</div>
                  <h3 className="text-base font-bold text-white mb-2 line-clamp-1">{item.name || 'ไม่ได้ระบุชื่อ'}</h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                    {item.description || '-'}
                  </p>
                  
                  {/* แสดงฟีเจอร์เพิ่มเติม */}
                  {(item.width || item.rubTest || (item.features && item.features.length > 0)) && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {item.width && <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700">กว้าง: {item.width}</span>}
                      {item.rubTest && <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700">Rub Test: {item.rubTest}</span>}
                      {typeof item.features === 'string' && item.features.split(', ').filter(Boolean).map((f, i) => (
                        <span key={i} className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 truncate max-w-[120px]">{f}</span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-neutral-900 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-neutral-500 block">ราคาประมาณ</span>
                    <span className="text-lg font-bold text-white">฿{item.price}</span>
                    <span className="text-xs text-neutral-500"> / {getUnit(item.category)}</span>
                  </div>

                  {isAdmin && (
                    <div className="flex items-center space-x-1">
                      <button 
                        onClick={() => handleOpenEditModal(item)}
                        className="p-2 text-neutral-400 hover:text-amber-400 hover:bg-neutral-900 rounded-lg border border-transparent hover:border-neutral-800 transition"
                        title="แก้ไขข้อมูล/ปรับสต็อก"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => confirmDelete(item.id)}
                        className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-neutral-900 rounded-lg border border-transparent hover:border-neutral-800 transition"
                        title="ลบจากสต็อก"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-16 bg-neutral-950 rounded-xl border border-neutral-800">
            <Package className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
            <p className="text-neutral-400 text-sm">ไม่พบวัสดุตรงตามเงื่อนไขที่ค้นหา</p>
          </div>
        )}
      </main>

      {}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full relative shadow-2xl">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">เข้าสู่ระบบเจ้าหน้าที่</h3>
                <p className="text-xs text-neutral-400">สำหรับจัดการเพิ่ม/ปรับลดสต็อกวัสดุ</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">รหัสผ่านเจ้าหน้าที่</label>
                <input 
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="กรอกรหัสผ่าน..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  autoFocus
                />
                {loginError && <p className="text-xs text-rose-500 mt-1">{loginError}</p>}
              </div>

              <button 
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold py-2.5 rounded-lg text-sm transition"
              >
                ยืนยันเข้าสู่ระบบ
              </button>
            </form>
          </div>
        </div>
      )}

      {}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-lg w-full relative my-8 shadow-2xl">
            <button 
              onClick={() => setEditingItem(null)}
              className="absolute top-4 right-4 text-neutral-500 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-amber-500" />
              {isNewItem ? 'เพิ่มวัสดุใหม่เข้าคลัง' : `แก้ไขข้อมูล: ${editingItem.sku}`}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">รหัส SKU</label>
                  <input 
                    type="text"
                    required
                    value={editingItem.sku}
                    onChange={(e) => setEditingItem({...editingItem, sku: e.target.value})}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>

                {/* Category Selection with Custom Add Feature */}
                <div>
                  <label className="block text-xs text-neutral-400 mb-1 flex items-center justify-between">
                    <span>หมวดหมู่</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomCategory(!isCustomCategory);
                        setCustomCategoryName('');
                      }}
                      className="text-amber-500 text-[11px] underline flex items-center gap-1 hover:text-amber-400 transition"
                    >
                      {isCustomCategory ? 'เลือกจากรายการปกติ' : '+ เพิ่มหมวดใหม่'}
                    </button>
                  </label>

                  {isCustomCategory ? (
                    <input 
                      type="text"
                      required
                      placeholder="พิมพ์ชื่อหมวดหมู่ใหม่..."
                      value={customCategoryName}
                      onChange={(e) => setCustomCategoryName(e.target.value)}
                      className="w-full bg-neutral-950 border border-amber-500/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition shadow-[0_0_10px_rgba(245,158,11,0.1)]"
                      autoFocus
                    />
                  ) : (
                    <select 
                      value={editingItem.category}
                      onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                    >
                      {categories.filter(c => c !== 'ทั้งหมด').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs text-neutral-400 mb-1">ชื่อวัสดุ / ชื่อสินค้า</label>
                <input 
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              {}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">
                    จำนวนคงเหลือ ({getUnit(isCustomCategory ? customCategoryName : editingItem.category)})
                  </label>
                  <input 
                    type="number"
                    step="0.1"
                    required
                    value={editingItem.meters}
                    onChange={(e) => setEditingItem({...editingItem, meters: parseFloat(e.target.value) || 0})}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">
                    ราคาต่อ{getUnit(isCustomCategory ? customCategoryName : editingItem.category)} (บาท)
                  </label>
                  <input 
                    type="number"
                    required
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value) || 0})}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              {}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">หน้ากว้าง (เช่น 140 cm)</label>
                  <input 
                    type="text"
                    value={editingItem.width || ''}
                    onChange={(e) => setEditingItem({...editingItem, width: e.target.value})}
                    placeholder="ปล่อยว่างได้"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">ความทนทาน (Rub Test)</label>
                  <input 
                    type="text"
                    value={editingItem.rubTest || ''}
                    onChange={(e) => setEditingItem({...editingItem, rubTest: e.target.value})}
                    placeholder="เช่น 50000"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              {}
              <div>
                <label className="block text-xs text-neutral-400 mb-2">คุณสมบัติพิเศษ (เลือกได้หลายข้อ)</label>
                <div className="grid grid-cols-2 gap-2 bg-neutral-950 border border-neutral-800 p-3 rounded-lg">
                  {AVAILABLE_FEATURES.map(feature => (
                    <label key={feature} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={Array.isArray(editingItem.features) && editingItem.features.includes(feature)}
                        onChange={(e) => {
                          const currentFeatures = Array.isArray(editingItem.features) ? [...editingItem.features] : [];
                          if (e.target.checked) {
                            setEditingItem({ ...editingItem, features: [...currentFeatures, feature] });
                          } else {
                            setEditingItem({ ...editingItem, features: currentFeatures.filter(f => f !== feature) });
                          }
                        }}
                        className="w-3.5 h-3.5 accent-amber-500 bg-neutral-900 border-neutral-700 rounded"
                      />
                      <span className="text-xs text-neutral-300 group-hover:text-white transition">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              {}
              <div>
                <label className="block text-xs text-neutral-400 mb-1">อัปโหลดรูปภาพ (บันทึกลง Google Drive)</label>
                
                <div className="flex gap-3 items-center">
                  <input 
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 text-neutral-300 text-xs px-3 py-2.5 rounded-lg flex items-center gap-2 transition"
                  >
                    <Upload className="w-4 h-4 text-amber-500" />
                    {selectedFile ? 'เปลี่ยนรูปภาพใหม่...' : 'เลือกไฟล์รูปภาพจากเครื่อง'}
                  </button>

                  {selectedFile && (
                    <span className="text-xs text-amber-400 font-medium truncate max-w-[150px]">
                      {selectedFile.name}
                    </span>
                  )}
                </div>

                {/* Preview Image */}
                {(filePreview || editingItem.imageUrl) ? (
                  <div className="mt-3 relative w-full h-32 bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden flex items-center justify-center">
                    <img 
                      src={filePreview || editingItem.imageUrl} 
                      alt="Preview" 
                      className="h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-neutral-950/80 px-2 py-0.5 rounded text-[10px] text-neutral-400 border border-neutral-800 shadow-md">
                      รูปตัวอย่าง
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 w-full h-32 bg-neutral-950 rounded-lg border border-neutral-800 border-dashed flex flex-col items-center justify-center text-neutral-600">
                    <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                    <span className="text-[10px]">ไม่มีรูปภาพ (รูปจะแสดงเป็นพื้นที่ว่างๆ)</span>
                  </div>
                )}

                <p className="text-[10px] text-neutral-500 mt-1.5 leading-relaxed">
                  * รูปภาพจะถูกเปลี่ยนชื่อเป็นตามรหัส SKU (<span className="text-amber-500/80">{editingItem.sku}_001.jpg</span>) และส่งไปเก็บใน Google Drive โดยอัตโนมัติ
                </p>
              </div>

              {}
              <div>
                <label className="block text-xs text-neutral-400 mb-1">รายละเอียดเพิ่มเติม</label>
                <textarea 
                  rows="2"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500 transition"
                  placeholder="รายละเอียดอื่นๆ ของวัสดุชิ้นนี้"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button 
                  type="button"
                  onClick={() => setEditingItem(null)}
                  disabled={isUploadingImage}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white transition"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit"
                  disabled={isUploadingImage}
                  className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-600/20"
                >
                  {isUploadingImage ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> กำลังส่งรูปไป Google Drive...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> บันทึกข้อมูล
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      {itemToDelete && (
        <div className="fixed inset-0 z-[60] bg-neutral-950/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-sm w-full relative shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-rose-500">
              <div className="p-2 bg-rose-500/10 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">ยืนยันการลบวัสดุ</h3>
            </div>
            
            <p className="text-sm text-neutral-400 mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้ออกจากระบบคลังวัสดุ? <br/>
              <span className="text-xs text-amber-500/80 mt-1 block">(ข้อมูลจะถูกอัปเดตลง Google Sheets ทันที)</span>
            </p>
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition shadow-lg shadow-rose-600/20"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
