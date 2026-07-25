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

      {/* Admin Control Bar */}
      <div className="flex items-center space-x-3">
        <a 
          href="https://chawcher.com" 
          target="_blank" 
          rel="noreferrer"
          className="text-xs text-neutral-400 hover:text-amber-400 flex items-center gap-1 transition"
        >
          กลับสู่ chawcher.com <ExternalLink className="w-3 h-3" />
        </a>

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

  {/* Hero Banner */}
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
        รวบรวมวัสดุส่วนเกิน (Surplus & Archive) จากโรงงานทอ สตูดิโอไทย และยุโรป คัดสรรด้วยมาตรฐานช่าง Chaw Cher เช็กจำนวนเมตรสต็อกพร้อมใช้งานได้ทันที
      </p>

      {/* Sync status alert */}
      {syncStatus && (
        <div className="mt-4 inline-flex items-center gap-2 bg-neutral-800 border border-neutral-700 text-amber-400 text-xs px-3 py-1.5 rounded-md animate-fade-in">
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          {syncStatus}
        </div>
      )}
    </div>
  </section>

  {/* Main Content Area */}
  <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
    
    {/* Search & Action Bar */}
    <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-8">
      
      {/* Search Bar */}
      <div className="relative flex-1 max-w-lg">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
        <input 
          type="text"
          placeholder="ค้นหาชื่อผ้า, รหัส SKU, ชนิดวัสดุ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition"
        />
      </div>

      {/* Controls & Sync buttons */}
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

    {/* Category Filters */}
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

    {/* Material Cards Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredMaterials.map((item) => (
        <div 
          key={item.id}
          className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition flex flex-col group relative"
        >
          {/* Image Container */}
          <div className="relative aspect-[4/3] bg-neutral-900 overflow-hidden">
            <img 
              src={item.imageUrl || 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600'} 
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur border border-neutral-800 text-neutral-300 text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md font-mono">
              {item.sku}
            </div>
            
            {/* Stock Tag */}
            <div className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 shadow-md ${
              Number(item.meters) > 0 
                ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-800/80'
                : 'bg-rose-950/90 text-rose-400 border border-rose-800/80'
            }`}>
              <Package className="w-3 h-3" />
              {Number(item.meters) > 0 ? `เหลือ ${item.meters} เมตร` : 'สินค้าหมด'}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div className="text-xs text-amber-500 font-medium mb-1">{item.category}</div>
              <h3 className="text-base font-bold text-white mb-2 line-clamp-1">{item.name}</h3>
              <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-neutral-900 flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-500 block">ราคาประมาณ</span>
                <span className="text-lg font-bold text-white">฿{item.price}</span>
                <span className="text-xs text-neutral-500"> / เมตร</span>
              </div>

              {/* Admin Edit Controls */}
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
                    onClick={() => handleDeleteItem(item.id)}
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

  {/* Modal: เข้าสู่ระบบ Admin */}
  {showLoginModal && (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-md w-full relative">
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
            <p className="text-xs text-neutral-400">สำหรับจัดการเพิ่ม/ปรับลดสต็อกผ้าและหนัง</p>
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

  {/* Modal: เพิ่ม / แก้ไขวัสดุ */}
  {editingItem && (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 max-w-lg w-full relative my-8">
        <button 
          onClick={() => setEditingItem(null)}
          className="absolute top-4 right-4 text-neutral-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-amber-500" />
          {isNewItem ? 'เพิ่มวัสดุใหม่เข้าคลัง' : `แก้ไขวัสดุ: ${editingItem.sku}`}
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
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">หมวดหมู่</label>
              <select 
                value={editingItem.category}
                onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white"
              >
                <option value="Fabrics">Fabrics</option>
                <option value="Leathers">Leathers</option>
                <option value="Thai Heritage Crafts">Thai Heritage Crafts</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-neutral-400 mb-1">ชื่อวัสดุ / ชื่อผ้า</label>
            <input 
              type="text"
              required
              value={editingItem.name}
              onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">จำนวนคงเหลือ (เมตร)</label>
              <input 
                type="number"
                step="0.1"
                required
                value={editingItem.meters}
                onChange={(e) => setEditingItem({...editingItem, meters: parseFloat(e.target.value) || 0})}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">ราคาต่อเมตร (บาท)</label>
              <input 
                type="number"
                required
                value={editingItem.price}
                onChange={(e) => setEditingItem({...editingItem, price: parseFloat(e.target.value) || 0})}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-neutral-400 mb-1">ลิงก์รูปภาพ (Image URL)</label>
            <input 
              type="text"
              value={editingItem.imageUrl}
              onChange={(e) => setEditingItem({...editingItem, imageUrl: e.target.value})}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-neutral-400 mb-1">รายละเอียดวัสดุ</label>
            <textarea 
              rows="3"
              value={editingItem.description}
              onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
            <button 
              type="button"
              onClick={() => setEditingItem(null)}
              className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
            >
              ยกเลิก
            </button>
            <button 
              type="submit"
              className="bg-amber-600 hover:bg-amber-500 text-neutral-950 font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> บันทึกสต็อก
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

</div>
