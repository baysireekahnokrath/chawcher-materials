import { useState, useMemo } from 'react';
import { 
  Search, ShoppingBag, ChevronRight, 
  Sparkles, 
  Package, X, Leaf, 
  Compass, MessageCircle, 
  Copy, ExternalLink, CheckCircle2
} from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// ==========================================
// MOCK DATA: คลังผ้า Rescued และโมเดล Chaw Cher
// (ในอนาคต สามารถดึงมาจาก Google Sheets ได้)
// ==========================================
const initialProducts = [
  {
    id: 'mat-001',
    sku: 'CC-LIN-808',
    name: 'Belgian Organic Heavy Linen Archive',
    category: 'Fabrics',
    subcategory: 'Woven Linen',
    images: [
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80'
    ],
    composition: '100% Organic Linen (Rescued Surplus)',
    weightThickness: '420 GSM (Heavy Weight)',
    width: '145 cm (57 inches)',
    martindale: '45,000 Rubs (Commercial Grade)',
    petFriendly: 'Moderate',
    functions: ['Water Repellent', 'Breathable', 'Hypoallergenic'],
    certifications: ['OEKO-TEX Standard 100', 'European Flax®'],
    origin: 'Belgium (Imported Surplus)',
    inStockMeters: 180,
    pricePerMeter: 980,
    description: 'ผ้าลินินธรรมชาติหนาพิเศษ surplus จากสตูดิโอตกแต่งในปารีส ทิ้งตัวนุ่มนวล ระบายอากาศดีเยี่ยม',
    craftsmanNote: '💡 คำแนะนำจากช่าง Chaw Cher: ผืนนี้เหมาะมากกับโซฟาทรงกลม Wabi-Sabi แต่ไม่แนะนำทำดึงกระดุม (Tufting) ลึกๆ เพราะผ้าตึงตัวสูง',
    ecoImpact: { waterSavedLiters: 3200, co2SavedKg: 16.5 }
  },
  {
    id: 'mat-002',
    sku: 'CC-THAI-102',
    name: 'Northern Thai Handwoven Indigo Silk-Cotton',
    category: 'Thai Heritage Crafts',
    subcategory: 'Handwoven Artisanal',
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80'
    ],
    composition: '60% Thai Organic Cotton, 40% Raw Silk (Natural Indigo)',
    weightThickness: '380 GSM',
    width: '110 cm (43 inches)',
    martindale: '30,000 Rubs (Domestic Accent)',
    petFriendly: 'Standard',
    functions: ['Natural Dye', 'Chemical-Free', 'Antibacterial'],
    certifications: ['Thailand Textile Quality Mark'],
    origin: 'Chiang Mai, Thailand',
    inStockMeters: 85,
    pricePerMeter: 1250,
    description: 'ผ้าทอมือย้อมครามธรรมชาติจากชุมชนช่างฝีมือเชียงใหม่ ส่วนเกินจากโครงการรีสอร์ท 5 ดาว ให้ความหรูหราแบบไทยร่วมสมัย',
    craftsmanNote: '💡 คำแนะนำจากช่าง Chaw Cher: เนื้อผ้าทอมือมีลายด้ายที่เป็นเอกลักษณ์ เหมาะทำเก้าอี้อาร์มแชร์ไฮไลต์ หรือเบาะอิง',
    ecoImpact: { waterSavedLiters: 4800, co2SavedKg: 24.0 }
  },
  {
    id: 'mat-003',
    sku: 'CC-LEA-012',
    name: 'Tuscan Full-Grain Matt Calfskin (Rescued Auto)',
    category: 'Leathers',
    subcategory: 'Bovine Leather',
    images: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=80'
    ],
    composition: '100% Tuscan Full-Grain Bovine Leather',
    weightThickness: '1.2 - 1.4 mm',
    width: 'Hide Equivalent: ~140cm width',
    martindale: '85,000 Rubs (Heavy Commercial)',
    petFriendly: 'High Scratch Resistance',
    functions: ['Stain Proof', 'Flame Retardant (BS5852)', 'UV Shield'],
    certifications: ['Leather Working Group (LWG) Gold'],
    origin: 'Tuscany, Italy',
    inStockMeters: 60,
    pricePerMeter: 2400,
    description: 'ผืนหนังวัวแท้พรีเมียม Satin Matte นุ่มนวล ทนทานต่อรอยขีดข่วน ไม่ลามไฟ หนังค้างคลังเกรดประกอบรถลักชัวรี',
    craftsmanNote: '💡 คำแนะนำจากช่าง Chaw Cher: หนังแท้ระบายอากาศได้ดี ยิ่งใช้นานยิ่งสวย เช็ดทำความสะอาดง่ายมาก เหมาะกับบ้านที่มีเด็ก/สัตว์เลี้ยง',
    ecoImpact: { waterSavedLiters: 9200, co2SavedKg: 52.0 }
  },
  {
    id: 'mat-004',
    sku: 'CC-VEL-502',
    name: 'Contract Performance Bouclé Velvet Surplus',
    category: 'Fabrics',
    subcategory: 'Bouclé Velvet',
    images: [
      'https://images.unsplash.com/photo-1579541814924-49fef17c5be5?auto=format&fit=crop&w=1000&q=80'
    ],
    composition: '80% Recycled Poly, 20% Organic Cotton',
    weightThickness: '520 GSM (Ultra Dense)',
    width: '140 cm (55 inches)',
    martindale: '100,000 Rubs (Hospitality Grade)',
    petFriendly: 'High (Snag-Resistant Texture)',
    functions: ['Easy Clean Stain Shield', 'Flame Retardant', 'Pet Friendly'],
    certifications: ['OEKO-TEX Standard 100', 'GRS Recycled'],
    origin: 'Kyoto, Japan',
    inStockMeters: 210,
    pricePerMeter: 890,
    description: 'ผ้าบูกเล่ผสมกำมะหยี่เนื้อหนานุ่ม มิติความอบอุ่นแบบทันสมัย คลังเกินจากการผลิตให้โรงแรมระดับโลก',
    craftsmanNote: '💡 คำแนะนำจากช่าง Chaw Cher: สัมผัสนุ่มทนทานสูงมาก ตะกุยสัตว์เลี้ยงไม่เป็นรอยง่าย แนะนำทำโซฟาโมดูลาร์',
    ecoImpact: { waterSavedLiters: 2600, co2SavedKg: 14.8 }
  }
];

const chawCherFurnitureModels = [
  {
    id: 'furn-01',
    name: 'Solstice Lounge Armchair (เก้าอี้อาร์มแชร์ Solstice)',
    metersRequired: 3.5,
    craftingFee: 8500,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80',
    description: 'อาร์มแชร์โครงไม้สักไทยปลูกหมุนเวียน พนักพิงโค้งรับสรีระ'
  },
  {
    id: 'furn-02',
    name: 'Khaoyai Modular 3-Seater Sofa (โซฟาโมดูลาร์ 3 ที่นั่ง)',
    metersRequired: 14.0,
    craftingFee: 28000,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
    description: 'โซฟาบุฟองน้ำทรงตัวความหนาแน่นสูง นั่งสบายแบบ Deep-Seating'
  },
  {
    id: 'furn-03',
    name: 'Zenith Sculptural Ottoman Set (เก้าอี้สตูลกลม)',
    metersRequired: 2.0,
    craftingFee: 4200,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
    description: 'สตูลกลมบุฟองน้ำและเบาะรองนั่งเข้าชุด เติมเต็มมิติห้องรับแขก'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'visualizer'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected Material for Modal / Inquiry
  const [activeProduct, setActiveProduct] = useState(null);
  const [orderMeters, setOrderMeters] = useState(2);
  const [selectedFurniture, setSelectedFurniture] = useState(chawCherFurnitureModels[0]);

  // LINE OA Inquiry Modal
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);
  const [inquiryType, setInquiryType] = useState('meter'); // 'meter' | 'swatch' | 'custom_furniture'
  const [copied, setCopied] = useState(false);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return initialProducts.filter(item => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchSearch = searchQuery === '' || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.composition.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Generate LINE Order Text Message
  const generatedLineMessage = useMemo(() => {
    if (!activeProduct) return '';
    if (inquiryType === 'meter') {
      return `สวัสดีครับ/ค่ะ ทีมงาน Chaw Cher 🌿
สนใจสั่งซื้อผ้า/หนังตัดแบ่งเป็นเมตร:
• สินค้า: ${activeProduct.name} (${activeProduct.sku})
• จำนวนที่ต้องการ: ${orderMeters} เมตร
• ราคาประเมิน: ฿${(activeProduct.pricePerMeter * orderMeters).toLocaleString()}
(รบกวนเช็กสต็อกและสรุปยอดโอนให้ด้วยครับ/ค่ะ)`;
    } else if (inquiryType === 'swatch') {
      return `สวัสดีครับ/ค่ะ ทีมงาน Chaw Cher 🌿
สนใจขอรับตัวอย่างผ้า (Sample Swatch):
• สินค้า: ${activeProduct.name} (${activeProduct.sku})
(รบกวนขอรายละเอียดการจัดส่งครับ/ค่ะ)`;
    } else {
      const total = (activeProduct.pricePerMeter * selectedFurniture.metersRequired) + selectedFurniture.craftingFee;
      return `สวัสดีครับ/ค่ะ ทีมงาน Chaw Cher 🌿
สนใจสั่งทำเฟอร์นิเจอร์ Custom Upholstery:
• รุ่นเฟอร์นิเจอร์: ${selectedFurniture.name}
• เลือกวัสดุ: ${activeProduct.name} (${activeProduct.sku})
• ใช้ผ้าประมาณ: ${selectedFurniture.metersRequired} เมตร
• ประเมินราคารวม: ฿${total.toLocaleString()}
(รบกวนขอคำปรึกษาและขั้นตอนการสั่งทำครับ/ค่ะ)`;
    }
  }, [activeProduct, orderMeters, inquiryType, selectedFurniture]);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generatedLineMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-stone-800 font-sans antialiased pb-20">
      
      {/* TOP BRAND BAR */}
      <div className="bg-[#1A261E] text-stone-200 py-2 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-800 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider flex items-center gap-1">
              <Leaf className="w-3 h-3" /> materials.chawcher.com
            </span>
            <span className="text-stone-300 hidden sm:inline text-[11px]">
              Chaw Cher Rescued & Surplus Upholstery Material Archive
            </span>
          </div>
          <a 
            href="https://chawcher.com" 
            target="_blank" 
            rel="noreferrer"
            className="text-amber-300 hover:underline flex items-center gap-1 text-[11px] font-semibold"
          >
            กลับสู่ chawcher.com (หลัก) <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-[#FBF9F5]/90 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('catalog')}>
              <div className="w-11 h-11 rounded-2xl bg-[#1A261E] text-amber-100 flex flex-col items-center justify-center font-serif font-bold shadow-md">
                <span className="text-lg leading-none">ฌ</span>
                <span className="text-[7px] tracking-widest text-emerald-400 uppercase">Cher</span>
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-none block">
                  CHAW CHER <span className="text-xs font-sans text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">MATERIAL EXPLORER</span>
                </span>
                <span className="text-[10px] tracking-wider uppercase text-stone-500 font-medium block mt-0.5">
                  Upholstery Creative Hub & Rescued Textile Archive
                </span>
              </div>
            </div>

            {/* Main Tabs */}
            <div className="flex items-center gap-2 bg-stone-200/80 p-1.5 rounded-2xl">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'catalog'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Search className="w-3.5 h-3.5 text-emerald-800" />
                1. คลังผ้า & หนัง (Rescued Catalog)
              </button>

              <button
                onClick={() => setActiveTab('visualizer')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'visualizer'
                    ? 'bg-[#1A261E] text-amber-200 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                2. ลองหุ้มโซฟา Chaw Cher
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* HERO BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-[#1A261E] text-stone-100 rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-xl border border-stone-800">
          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" /> Design for Life • Material Explorer
            </span>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
              คลังผ้าและหนัง Rescued เกรดพรีเมียม สำหรับงานโซฟาและเฟอร์นิเจอร์
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              รวบรวมวัสดุส่วนเกิน (Surplus & Archive) จากโรงงานทอ สตูดิโอไท��� และยุโรป คัดสรรด้วยมาตรฐานช่าง Chaw Cher เปิดโอกาสให้ Designer และลูกค้าทั่วไปเลือกตัดแบ่งเป็นเมตร หรือสั่งผลิตเฟอร์นิเจอร์ยั่งยืน
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: CATALOG VIEW */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            
            {/* Filter Toolbar */}
            <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหาชื่อผ้า, รหัส SKU, ส่วนผสม (เช่น Linen, Silk)..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
                  />
                </div>

                {/* Category Buttons */}
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                  {['All', 'Fabrics', 'Thai Heritage Crafts', 'Leathers'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        selectedCategory === cat
                          ? 'bg-emerald-800 text-white shadow-sm'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {cat === 'All' ? 'วัสดุทั้งหมด' : cat}
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div 
                  key={product.id}
                  className="bg-white rounded-3xl border border-stone-200/90 overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Image */}
                    <div className="relative aspect-4/3 overflow-hidden bg-stone-100 cursor-pointer" onClick={() => setActiveProduct(product)}>
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                        {product.category}
                      </span>
                      <span className="absolute bottom-3 right-3 bg-emerald-950/90 text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-md">
                        <Package className="w-3 h-3" /> เหลือ {product.inStockMeters}m
                      </span>
                    </div>

                    {/* Details */}
                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-[10px] font-mono text-stone-400 block">{product.sku} • {product.origin}</span>
                        <h3 
                          onClick={() => setActiveProduct(product)}
                          className="font-serif font-bold text-stone-900 hover:text-emerald-800 cursor-pointer line-clamp-1 mt-0.5"
                        >
                          {product.name}
                        </h3>
                      </div>

                      <p className="text-xs text-stone-500 line-clamp-2">{product.description}</p>

                      {/* Craftsman Badge */}
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/60 text-[11px] text-amber-900 leading-snug font-medium">
                        {product.craftsmanNote}
                      </div>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="p-5 pt-0">
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-stone-400 block">ตัดขายเริ่มต้น</span>
                        <p className="text-base font-bold text-stone-900">
                          ฿{product.pricePerMeter.toLocaleString()} <span className="text-xs font-normal text-stone-500">/ เมตร</span>
                        </p>
                      </div>

                      <button
                        onClick={() => setActiveProduct(product)}
                        className="bg-[#1A261E] hover:bg-emerald-800 text-amber-100 text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1"
                      >
                        ดูสเปก/สั่งซื้อ <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: CHAW CHER BESPOKE VISUALIZER */}
        {activeTab === 'visualizer' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
                  Chaw Cher Bespoke Studio
                </span>
                <h2 className="text-2xl font-serif font-bold text-stone-900 mt-2">
                  ทดลองนำผ้า Rescued มาสั่งทำโซฟา / เก้าอี้ Chaw Cher
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  เลือกโมเดลเฟอร์นิเจอร์และผ้าที่ชอบ เพื่อคำนวณราคาสั่งทำสุทธิพร้อมค่าประกอบจากช่าง ฌอเฌอ
                </p>
              </div>

              {/* Step 1: Select Furniture */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">
                  1. เลือกแบบเฟอร์นิเจอร์ Chaw Cher:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {chawCherFurnitureModels.map(furn => (
                    <div
                      key={furn.id}
                      onClick={() => setSelectedFurniture(furn)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                        selectedFurniture.id === furn.id
                          ? 'bg-emerald-950 text-white border-emerald-900 shadow-md'
                          : 'bg-stone-50 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <img src={furn.image} alt={furn.name} className="w-full h-28 rounded-xl object-cover" />
                      <div>
                        <p className="font-bold text-xs line-clamp-1">{furn.name}</p>
                        <span className="text-[10px] opacity-80 block mt-0.5">ใช้ผ้า: {furn.metersRequired} เมตร</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Fabric */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider">
                  2. เลือกผ้า/หนัง Rescued ที่ต้องการนำมาหุ้ม:
                </label>
                <select
                  value={activeProduct?.id || initialProducts[0].id}
                  onChange={(e) => setActiveProduct(initialProducts.find(p => p.id === e.target.value))}
                  className="w-full p-3 rounded-xl border border-stone-300 bg-stone-50 text-xs font-bold text-stone-900"
                >
                  {initialProducts.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (฿{p.pricePerMeter}/เมตร - {p.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Total Calculation Display */}
              {activeProduct && (
                <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-stone-200 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-600">ค่าผ้า/หนัง ({selectedFurniture.metersRequired}m @ ฿{activeProduct.pricePerMeter}):</span>
                    <span className="font-bold">฿{(activeProduct.pricePerMeter * selectedFurniture.metersRequired).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-stone-600">ค่าโครงสร้างไม้ & งานตัดเย็บประกอบ Chaw Cher:</span>
                    <span className="font-bold">฿{selectedFurniture.craftingFee.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-stone-200 pt-3 flex justify-between items-center font-serif text-lg font-bold">
                    <span className="text-stone-900">ราคารวมสั่งทำประมาณการ:</span>
                    <span className="text-emerald-800 text-xl">
                      ฿{((activeProduct.pricePerMeter * selectedFurniture.metersRequired) + selectedFurniture.craftingFee).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  if (!activeProduct) setActiveProduct(initialProducts[0]);
                  setInquiryType('custom_furniture');
                  setIsLineModalOpen(true);
                }}
                className="w-full py-3.5 bg-[#1A261E] hover:bg-emerald-800 text-amber-100 font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                ส่งข้อมูลประเมินราคานี้ไปยัง LINE Official Account
              </button>

            </div>
          </div>
        )}

      </main>

      {/* PRODUCT DETAIL & SPEC MODAL */}
      {activeProduct && activeTab === 'catalog' && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative p-6 sm:p-8 space-y-6">
            
            <button 
              onClick={() => setActiveProduct(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Left: Image & Eco */}
              <div className="space-y-4">
                <img src={activeProduct.images[0]} alt={activeProduct.name} className="w-full aspect-square rounded-2xl object-cover border" />
                
                <div className="p-3.5 rounded-2xl bg-[#1A261E] text-stone-100 space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5" /> Eco-Impact Savings
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div className="bg-emerald-950 p-2 rounded-xl border border-emerald-900">
                      <span className="text-stone-400 block text-[9px]">ประหยัดน้ำ</span>
                      <strong className="text-cyan-300">{activeProduct.ecoImpact.waterSavedLiters * orderMeters} Liters</strong>
                    </div>
                    <div className="bg-emerald-950 p-2 rounded-xl border border-emerald-900">
                      <span className="text-stone-400 block text-[9px]">ลดคาร์บอน</span>
                      <strong className="text-emerald-300">{(activeProduct.ecoImpact.co2SavedKg * orderMeters).toFixed(1)} kg CO2</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Specs & Actions */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono text-stone-400">{activeProduct.sku}</span>
                  <h2 className="text-xl font-serif font-bold text-stone-900">{activeProduct.name}</h2>
                  <p className="text-xs text-stone-500 mt-1">{activeProduct.description}</p>
                </div>

                {/* Craftsman Note */}
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-medium leading-relaxed">
                  {activeProduct.craftsmanNote}
                </div>

                {/* Specs List */}
                <div className="space-y-1.5 text-xs text-stone-600 border-t border-b border-stone-100 py-3">
                  <p><strong className="text-stone-900">ส่วนผสม:</strong> {activeProduct.composition}</p>
                  <p><strong className="text-stone-900">ความทนทาน (Martindale):</strong> {activeProduct.martindale}</p>
                  <p><strong className="text-stone-900">ความหนา/น้ำหนัก:</strong> {activeProduct.weightThickness}</p>
                  <p><strong className="text-stone-900">หน้ากว้าง:</strong> {activeProduct.width}</p>
                  <p><strong className="text-stone-900">แหล่งผลิต:</strong> {activeProduct.origin}</p>
                </div>

                {/* Meter Counter */}
                <div className="flex items-center justify-between border p-3 rounded-xl bg-stone-50">
                  <span className="text-xs font-bold text-stone-700">จำนวนที่ต้องการ (เมตร):</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setOrderMeters(Math.max(1, orderMeters - 1))} className="w-7 h-7 rounded-lg bg-white border font-bold text-stone-700">-</button>
                    <span className="text-xs font-bold">{orderMeters} m</span>
                    <button onClick={() => setOrderMeters(orderMeters + 1)} className="w-7 h-7 rounded-lg bg-white border font-bold text-stone-700">+</button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      setInquiryType('meter');
                      setIsLineModalOpen(true);
                    }}
                    className="w-full py-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> สั่งตัด {orderMeters} เมตร (฿{(activeProduct.pricePerMeter * orderMeters).toLocaleString()})
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setInquiryType('swatch');
                        setIsLineModalOpen(true);
                      }}
                      className="py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[11px] rounded-xl border border-stone-200"
                    >
                      ขอรับ Sample Swatch
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('visualizer');
                        setActiveProduct(activeProduct);
                      }}
                      className="py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] rounded-xl border border-amber-300"
                    >
                      ลองหุ้มโซฟา Chaw Cher
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* LINE OA CONCIERGE MODAL */}
      {isLineModalOpen && activeProduct && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="font-serif font-bold text-stone-900 flex items-center gap-2 text-sm">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                ส่งรายการไปยัง LINE Official Account
              </span>
              <button onClick={() => setIsLineModalOpen(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-stone-600">
                ระบบได้สรุปข้อความสั่งซื้อของคุณเรียบร้อยแล้ว คุณสามารถ **ก๊อปปี้ข้อความ** แล้วกดปุ่มส่งเข้า LINE @ChawCher ได้เลยทันที:
              </p>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 font-mono text-[11px] text-stone-700 whitespace-pre-wrap leading-relaxed">
                {generatedLineMessage}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCopyMessage}
                className="w-full py-2.5 bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'คัดลอกข้อความแล้ว!' : '1. คัดลอกข้อความสรุป'}
              </button>

              <a
                href="https://line.me" 
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md block text-center"
              >
                <MessageCircle className="w-4 h-4" />
                2. เปิดแอป LINE เพื่อส่งข้อความ
              </a>
            </div>

          </div>
        </div>
      )}

      <SpeedInsights />
    </div>
  );
}
