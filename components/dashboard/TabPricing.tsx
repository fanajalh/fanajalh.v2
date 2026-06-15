"use client"

import { Save, Edit, DollarSign, Tag, Plus, Trash2 } from "lucide-react"
import type { WebsiteSettings } from "./types"

interface Props {
  settings: WebsiteSettings
  setSettings: (s: WebsiteSettings) => void
  editing: boolean
  setEditing: (e: boolean) => void
  onSave: () => void
}

export function TabPricing({ settings, setSettings, editing, setEditing, onSave }: Props) {
  const updateService = (index: number, key: string, value: any) => {
    const updated = [...settings.services]
    updated[index] = { ...updated[index], [key]: value }
    
    // Automatically update ID if name changes
    if (key === "name") {
      updated[index].id = value.toLowerCase().replace(/\s+/g, '-')
    }
    
    setSettings({ ...settings, services: updated })
  }

  const addService = () => {
    setSettings({
      ...settings,
      services: [
        ...settings.services,
        { id: "new-item", name: "Produk Baru", price: 0, active: false }
      ]
    })
  }

  const deleteService = (index: number) => {
    const updated = [...settings.services]
    updated.splice(index, 1)
    setSettings({ ...settings, services: updated })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-5 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Tag size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-black text-black uppercase tracking-widest leading-tight">Master Katalog</h2>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1">Atur Produk/Layanan</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {editing ? (
            <button onClick={onSave} className="flex items-center gap-2 px-6 py-3 bg-white text-black border-4 border-black font-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none group">
              <Save size={18} strokeWidth={2.5} className="group-hover:text-white" /> SIMPAN
            </button>
          ) : (
            <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-6 py-3 bg-black text-white border-4 border-black font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none group">
              <Edit size={18} strokeWidth={2.5} className="text-white group-hover:text-black" /> EDIT
            </button>
          )}
          
          {editing && (
            <button 
              onClick={() => {
                if(confirm('Reset semua layanan ke default? Data saat ini akan ditimpa.')) {
                  import('./types').then(module => {
                    setSettings(module.DEFAULT_SETTINGS);
                  });
                }
              }} 
              className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 border-4 border-red-600 font-black uppercase tracking-widest text-sm hover:bg-red-600 hover:text-white transition-all shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] outline-none"
            >
              RESET DEFAULT
            </button>
          )}
        </div>
      </div>

      {/* Global Settings */}
      {editing && (
        <div className="bg-white p-5 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
          <label className="block text-[10px] font-black uppercase tracking-widest text-black mb-2">Pesan Saat Layanan Tutup / Libur</label>
          <textarea
            value={settings.emptyStateMessage || ""}
            onChange={(e) => setSettings({ ...settings, emptyStateMessage: e.target.value })}
            placeholder="e.g. Maaf, layanan kami sedang dalam mode libur/tutup sementara."
            className="w-full px-4 py-3 bg-white border-2 border-black text-black font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-sm min-h-[80px]"
          />
          <p className="text-[10px] font-bold text-gray-500 uppercase mt-2">Pesan ini akan muncul jika semua layanan dalam satu kategori dimatikan.</p>
        </div>
      )}

      {/* Akses Halaman Kontrol */}
      <div className="bg-white p-5 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-black border-b-2 border-black pb-2 flex items-center gap-2">
          <span>🔒 Kontrol Akses Halaman (Buka / Tutup)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Order Page Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-black">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-black">Akses Form Pemesanan (/order)</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                {settings.orderPageOpen !== false ? "🟢 Dibuka untuk publik" : "🔴 Ditutup (Hanya Admin)"}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.orderPageOpen !== false}
                onChange={(e) => editing && setSettings({ ...settings, orderPageOpen: e.target.checked })}
                disabled={!editing}
              />
              <div className="w-12 h-6 bg-white border-2 border-black peer-focus:outline-none peer-checked:bg-black disabled:opacity-50 transition-colors"></div>
              <div className="absolute left-[2px] top-[2px] bg-black peer-checked:bg-white w-5 h-4 transition-transform peer-checked:translate-x-6 border-r-2 peer-checked:border-r-0 peer-checked:border-l-2 border-white peer-checked:border-black"></div>
            </label>
          </div>

          {/* Premium Page Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-black">
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-black">Akses Katalog Premium (/premium)</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">
                {settings.premiumPageOpen !== false ? "🟢 Dibuka untuk publik" : "🔴 Ditutup (Hanya Admin)"}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={settings.premiumPageOpen !== false}
                onChange={(e) => editing && setSettings({ ...settings, premiumPageOpen: e.target.checked })}
                disabled={!editing}
              />
              <div className="w-12 h-6 bg-white border-2 border-black peer-focus:outline-none peer-checked:bg-black disabled:opacity-50 transition-colors"></div>
              <div className="absolute left-[2px] top-[2px] bg-black peer-checked:bg-white w-5 h-4 transition-transform peer-checked:translate-x-6 border-r-2 peer-checked:border-r-0 peer-checked:border-l-2 border-white peer-checked:border-black"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Grid of Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.services.map((service, idx) => (
          <div key={idx} className={`bg-white p-5 border-4 transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none relative ${service.active ? 'border-black' : 'border-gray-300 opacity-80'}`}>
            
            {editing && (
              <button onClick={() => deleteService(idx)} className="absolute -top-3 -right-3 w-8 h-8 bg-white border-2 border-black text-black flex items-center justify-center hover:bg-red-500 hover:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all z-10" title="Hapus Item">
                <Trash2 size={16} strokeWidth={3} />
              </button>
            )}

            <div className="flex items-start justify-between mb-6">
              <div className="flex-1 mr-4">
                {editing ? (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-black">Nama Produk/Layanan</label>
                    <input
                      type="text"
                      value={service.name}
                      onChange={(e) => updateService(idx, "name", e.target.value)}
                      className="w-full px-3 py-2 bg-white border-2 border-black text-black font-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-sm uppercase"
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-black text-black uppercase">{service.name}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ID: {service.id}</p>
                  </div>
                )}
              </div>

              {/* Checkbox Toggle */}
              <div className="flex items-center justify-center pt-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={service.active}
                    onChange={(e) => editing && updateService(idx, "active", e.target.checked)}
                    disabled={!editing}
                  />
                  <div className="w-12 h-6 bg-white border-2 border-black peer-focus:outline-none peer-checked:bg-black disabled:opacity-50 transition-colors"></div>
                  <div className="absolute left-[2px] top-[2px] bg-black peer-checked:bg-white w-5 h-4 transition-transform peer-checked:translate-x-6 border-r-2 peer-checked:border-r-0 peer-checked:border-l-2 border-white peer-checked:border-black"></div>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 p-4 border-2 border-black rounded-none">
              <p className="text-[10px] font-black text-black uppercase tracking-widest mb-2">Harga Dasar</p>
              {editing ? (
                <div className="space-y-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-black text-black">Rp</span>
                    <input
                      type="number"
                      value={service.price}
                      onChange={(e) => updateService(idx, "price", Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 bg-white border-2 border-black rounded-none text-xl font-black text-black outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-black">Custom Status (opsional)</label>
                    <input
                      type="text"
                      placeholder="e.g. SEMENTARA TUTUP"
                      value={service.customStatus || ""}
                      onChange={(e) => updateService(idx, "customStatus", e.target.value)}
                      className="w-full mt-1 px-3 py-2 bg-white border-2 border-black text-black font-black focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-sm uppercase"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <p className={`text-3xl font-black tracking-tighter ${service.customStatus ? "line-through text-gray-400" : "text-black"}`}>
                    <span className="text-sm font-bold mr-1 tracking-normal">Rp</span>
                    {new Intl.NumberFormat("id-ID").format(service.price)}
                  </p>
                  {service.customStatus && (
                    <p className="text-sm font-black text-red-500 uppercase tracking-widest bg-red-50 inline-block px-2 py-1 border-2 border-red-500 shadow-[2px_2px_0px_0px_rgba(239,68,68,1)]">
                      {service.customStatus}
                    </p>
                  )}
                </div>
              )}
            </div>

          </div>
        ))}
        
        {editing && (
          <button 
            onClick={addService}
            className="flex flex-col items-center justify-center gap-3 p-8 bg-white border-4 border-dashed border-gray-300 hover:border-black text-gray-400 hover:text-black transition-all rounded-none min-h-[220px] group cursor-pointer"
          >
            <div className="w-12 h-12 bg-gray-100 group-hover:bg-black group-hover:text-white border-2 border-transparent group-hover:border-black flex items-center justify-center transition-all shadow-none group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Plus size={24} strokeWidth={3} />
            </div>
            <span className="font-black uppercase tracking-widest text-sm">Tambah Item Baru</span>
          </button>
        )}
      </div>
    </div>
  )
}