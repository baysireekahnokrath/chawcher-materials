// ... existing code ...
    // -------------------------------------------------------------
    // Action 2: Save / Sync stock items to Google Sheets
    // -------------------------------------------------------------
    var items = contents.items;
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).clearContent();
    }
    
    if (items && items.length > 0) {
      // ✅ แก้ไขบรรทัดนี้: เพิ่ม width, rubTest, features ต่อท้าย
      var headers = ["id", "sku", "name", "category", "meters", "price", "imageUrl", "description", "width", "rubTest", "features"];
      items.forEach(function(item) {
        var row = headers.map(function(h) { return item[h] !== undefined ? item[h] : ""; });
        sheet.appendRow(row);
      });
    }
    return responseJSON({ status: "success" });
// ... existing code ...
```
*(เมื่อแก้เสร็จแล้ว อย่าลืมกด Deploy -> New deployment เหมือนเดิมนะครับ)*

---

### ส่วนที่ 2: อัปเดตไฟล์ `src/App.jsx` (บน GitHub)
ผมได้ทำ Diff Code สำหรับไฟล์หน้าเว็บแล้วครับ ข้อมูลที่เพิ่มเข้าไปมีดังนี้:
* **แก้บั๊กรูปภาพ**: ลบรูป Default สีเหลืองออกไป หากยังไม่ได้อัปโหลดจะขึ้นเป็นกล่องว่างๆ (Placeholder)
* **ระบบสลับหน่วยอัตโนมัติ**: ถ้าชื่อหมวดหมู่มีคำว่า `Leathers` หรือ `หนัง` ระบบจะเปลี่ยนป้ายกำกับทั้งหมดเป็น `ตร.ฟุต` ให้ทันที
* **ฟิลด์ข้อมูลทางเทคนิค**: เพิ่มช่องใส่ หน้ากว้าง, Rub Test และ Checkbox คุณสมบัติพิเศษ 5 รายการ

คัดลอกโค้ดเหล่านี้ไปวางทับใน GitHub ได้เลยครับ:

```react:App Component With Custom Category & Drive Upload:src/App.jsx
// ... existing code ...
const ADMIN_PASSWORD = "chawcher1234";

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
  },
  {
    id: "3",
    sku: "TH-WT-003",
    name: "Thai Heritage Handwoven Silk Blend",
    category: "Thai Heritage Crafts",
    meters: 12.5,
    price: 1200,
    imageUrl: "https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&q=80&w=600",
    description: "ผ้าทอมือผสมไหมเนื้อพิเศษ งานฝีมือจากชุมชนช่างทอภาคเหนือ สำหรับงานตกแต่งระดับไฮเอนด์",
    width: "120 cm",
    rubTest: "20000",
    features: ""
  }
];

const AVAILABLE_FEATURES = [
  'กันน้ำ (Water Repellent)',
  'กันไรฝุ่น (Anti-Dust Mite)',
  'ทนรอยขีดข่วน (Pet Friendly)',
  'ลามไฟช้า (Fire Retardant)',
  'ภายนอกอาคาร (Outdoor/UV)'
];

export default function App() {
// ... existing code ...
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Helper function สำหรับตรวจสอบหน่วย (เมตร / ตร.ฟุต)
  const getUnit = (categoryName) => {
    if (!categoryName) return 'เมตร';
    const cat = categoryName.toLowerCase();
    return (cat.includes('leather') || cat.includes('หนัง')) ? 'ตร.ฟุต' : 'เมตร';
  };

  useEffect(() => {
// ... existing code ...
  const handleOpenAddModal = () => {
    setEditingItem({
      id: Date.now().toString(),
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      category: 'Fabrics',
      meters: 0,
      price: 0,
      imageUrl: '', // แก้ไข: ลบรูป Unsplash ออก เพื่อไม่ให้เป็นรูประหว่างรออัปโหลด
      description: '',
      width: '',
      rubTest: '',
      features: [] // เก็บเป็น Array สำหรับ Checkbox
    });
    setIsNewItem(true);
    setIsCustomCategory(false);
    setCustomCategoryName('');
    setSelectedFile(null);
    setFilePreview('');
  };

  const handleOpenEditModal = (item) => {
    // แปลง features จาก String (ใน Sheet) กลับเป็น Array สำหรับ Checkbox
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
// ... existing code ...
    const itemToSave = {
      ...editingItem,
      category: finalCategory,
      imageUrl: finalImageUrl,
      features: Array.isArray(editingItem.features) ? editingItem.features.join(', ') : '' // แปลงกลับเป็น String ก่อนเซฟลง Sheets
    };

    let updated;
// ... existing code ...
                <div className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 shadow-md ${
                  Number(item.meters) > 0 
                    ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-800/80'
                    : 'bg-rose-950/90 text-rose-400 border border-rose-800/80'
                }`}>
                  <Package className="w-3 h-3" />
                  {Number(item.meters) > 0 ? `เหลือ ${item.meters} ${getUnit(item.category)}` : 'สินค้าหมด'}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-amber-500 font-medium mb-1">{item.category}</div>
                  <h3 className="text-base font-bold text-white mb-2 line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                    {item.description}
                  </p>
                  
                  {/* แสดงฟีเจอร์เพิ่มเติม (ถ้ามี) */}
                  {(item.width || item.rubTest || item.features) && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {item.width && <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700">กว้าง: {item.width}</span>}
                      {item.rubTest && <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded border border-neutral-700">Rub Test: {item.rubTest}</span>}
                      {typeof item.features === 'string' && item.features.split(', ').filter(Boolean).map((f, i) => (
                        <span key={i} className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">{f}</span>
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
// ... existing code ...
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">จำนวนคงเหลือ ({getUnit(editingItem.category === 'Fabrics' && customCategoryName ? customCategoryName : editingItem.category)})</label>
                  <input 
                    type="number"
                    step="0.1"
                    required
                    value={editingItem.meters}
                    onChange={(e) => setEditingItem({...editingItem, meters: parseFloat(e.target.value) || 0})}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">ราคาต่อ{getUnit(editingItem.category === 'Fabrics' && customCategoryName ? customCategoryName : editingItem.category)} (บาท)</label>
                  <input 
                    type="number"
                    required
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value) || 0})}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* ข้อมูลทางเทคนิค */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">หน้ากว้าง (เช่น 140 cm)</label>
                  <input 
                    type="text"
                    value={editingItem.width || ''}
                    onChange={(e) => setEditingItem({...editingItem, width: e.target.value})}
                    placeholder="ปล่อยว่างได้"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">ความทนทาน (Rub Test)</label>
                  <input 
                    type="text"
                    value={editingItem.rubTest || ''}
                    onChange={(e) => setEditingItem({...editingItem, rubTest: e.target.value})}
                    placeholder="เช่น 50000"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Checkbox ฟังก์ชันพิเศษ */}
              <div>
                <label className="block text-xs text-neutral-400 mb-2">คุณสมบัติพิเศษ (เลือกได้หลายข้อ)</label>
                <div className="grid grid-cols-2 gap-2">
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
                        className="w-4 h-4 accent-amber-500"
                      />
                      <span className="text-xs text-neutral-300 group-hover:text-white transition">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Image Upload / Google Drive Integration */}
              <div>
                <label className="block text-xs text-neutral-400 mb-1">อัปโหลดรูปภาพ (บันทึกลง Google Drive)</label>
// ... existing code ...
                  {selectedFile && (
                    <span className="text-xs text-amber-400 font-medium truncate max-w-[180px]">
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
                    <div className="absolute top-2 right-2 bg-neutral-950/80 px-2 py-0.5 rounded text-[10px] text-neutral-400 border border-neutral-800">
                      รูปตัวอย่าง
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 w-full h-32 bg-neutral-950 rounded-lg border border-neutral-800 border-dashed flex flex-col items-center justify-center text-neutral-600">
                    <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                    <span className="text-[10px]">ยังไม่ได้เลือกรูปภาพ (รูปจะเป็นพื้นที่สีเทาหากไม่ระบุ)</span>
                  </div>
                )}

                <p className="text-[11px] text-neutral-500 mt-1.5">
// ... existing code ...
