"use client"

import { useState, useEffect } from "react"
import { 
  Plus, Trash2, X, Newspaper, Crown, Bell, 
  Loader2, Link as LinkIcon, Edit3, Image as ImageIcon, Briefcase, Activity, Sparkles, Clock
} from "lucide-react"
import Swal from "sweetalert2"

interface NewsItem { id: number; title: string; description: string; badge: string; color_from: string; color_to: string; link: string; is_active: boolean }
interface FeaturedWork { id: number; title: string; client_name: string; badge: string; duration_text: string; is_active: boolean }
interface ClientUpdate { id: number; client_email: string; title: string; status_text: string; is_active: boolean }

export function TabContent() {
  const [activeSection, setActiveSection] = useState<"news" | "works" | "updates">("news")
  const [news, setNews] = useState<NewsItem[]>([])
  const [works, setWorks] = useState<FeaturedWork[]>([])
  const [updates, setUpdates] = useState<ClientUpdate[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>({})

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [n, w, u] = await Promise.all([
        fetch("/api/admin/news").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/api/admin/featured-works").then(r => r.json()).catch(() => ({ data: [] })),
        fetch("/api/admin/client-updates").then(r => r.json()).catch(() => ({ data: [] })),
      ])
      setNews(n.data || [])
      setWorks(w.data || [])
      setUpdates(u.data || [])
    } catch { /* silently fail */ }
    setLoading(false)
  }

  const handleAdd = async () => {
    setIsSubmitting(true)
    const endpoints: Record<string, string> = { news: "/api/admin/news", works: "/api/admin/featured-works", updates: "/api/admin/client-updates" }
    try {
      const res = await fetch(endpoints[activeSection], {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) { setShowForm(false); setFormData({}); fetchAll(); Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data ditambahkan!', timer: 1500, showConfirmButton: false }); }
      else Swal.fire({ icon: 'error', text: 'Gagal menambah data' })
    } catch { Swal.fire({ icon: 'error', text: 'Error jaringan' }) }
    finally { setIsSubmitting(false) }
  }

  const handleDelete = async (section: string, id: number) => {
    const result = await Swal.fire({ title: 'Hapus Item?', text: "Data akan dihapus secara permanen.", icon: 'warning', showCancelButton: true, confirmButtonText: 'Ya, Hapus!' })
    if (!result.isConfirmed) return
    const endpoints: Record<string, string> = { news: "/api/admin/news", works: "/api/admin/featured-works", updates: "/api/admin/client-updates" }
    try {
      const res = await fetch(`${endpoints[section]}/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Gagal")
      fetchAll()
      Swal.fire({ icon: 'success', title: 'Terhapus!', timer: 1500, showConfirmButton: false })
    } catch { Swal.fire({ icon: 'error', text: 'Gagal menghapus' }) }
  }

  const sections = [
    { id: "news" as const, label: "Kabar Info", icon: Newspaper, count: news.length, color: "orange" },
    { id: "works" as const, label: "Karya Top", icon: Crown, count: works.length, color: "blue" },
    { id: "updates" as const, label: "Live Order", icon: Activity, count: updates.length, color: "emerald" },
  ]

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 bg-white border-4 border-black border-dashed mt-4">
      <Loader2 size={40} strokeWidth={3} className="animate-spin text-black mb-4" />
      <p className="text-sm font-black text-black uppercase tracking-widest animate-pulse">Memuat Data Server</p>
    </div>
  )

  const activeColor = sections.find(s => s.id === activeSection)?.color || "orange"

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 select-none pb-10">
      
      {/* ================= HEADER & TABS ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
        
        {/* Segmented Control */}
        <div className="flex bg-white overflow-x-auto no-scrollbar w-full md:w-auto border-4 border-black">
          {sections.map((s) => {
            const Icon = s.icon
            const isActive = activeSection === s.id
            return (
              <button key={s.id} onClick={() => { setActiveSection(s.id); setShowForm(false) }}
                className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all outline-none whitespace-nowrap border-r-4 border-black last:border-r-0 ${
                  isActive 
                    ? "bg-black text-white" 
                    : "bg-white text-black hover:bg-gray-200"
                }`}>
                <Icon size={16} strokeWidth={3} /> 
                {s.label}
                <span className={`ml-2 px-2 py-0.5 border-2 border-current text-[10px] ${isActive ? 'bg-white text-black' : 'bg-black text-white'}`}>
                  {s.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Add Button */}
        <button onClick={() => { setShowForm(!showForm); setFormData({}) }}
          className={`flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 text-black border-4 border-black rounded-none text-xs font-black uppercase tracking-widest hover:bg-white active:translate-y-0.5 active:shadow-none transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none shrink-0 ${showForm ? 'hidden' : ''}`}>
          <Plus size={18} strokeWidth={3} /> TAMBAH DATA
        </button>
      </div>

      {/* ================= ADD FORM CARD ================= */}
      {showForm && (
        <div className="bg-white p-6 md:p-8 rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black animate-in zoom-in-95 duration-300 relative overflow-hidden">
          {/* Decorative Line */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-black" />
          
          <div className="flex justify-between items-center mb-8 mt-2">
            <h3 className="font-black text-xl text-black flex items-center gap-3 uppercase tracking-widest">
              <div className="p-2 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Edit3 size={20} strokeWidth={3} className="text-black" />
              </div>
              FORM INPUT BARU
            </h3>
            <button onClick={() => setShowForm(false)} className="bg-white border-2 border-black text-black hover:bg-black hover:text-white p-2 rounded-none transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none">
              <X size={20} strokeWidth={3} />
            </button>
          </div>

          <div className="space-y-6">
            {activeSection === "news" && (
              <>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-black uppercase tracking-widest">JUDUL KABAR UTAMA</label>
                  <input placeholder="KETIK JUDUL MENARIK..." value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-black rounded-none text-sm font-black text-black outline-none focus:bg-black focus:text-white transition-all placeholder:text-gray-400 uppercase tracking-widest" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-black uppercase tracking-widest">DESKRIPSI SINGKAT</label>
                  <textarea placeholder="JELASKAN DETAIL KABAR INI..." rows={3} value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-black rounded-none text-sm font-black text-black outline-none focus:bg-black focus:text-white transition-all placeholder:text-gray-400 resize-none uppercase tracking-widest" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-black uppercase tracking-widest">TEKS BADGE</label>
                    <div className="relative">
                      <Sparkles size={18} strokeWidth={3} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input placeholder="MISAL: ⚡ PROMO" value={formData.badge || ""} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-white border-2 border-black rounded-none text-sm font-black text-black outline-none focus:bg-black focus:text-white transition-all uppercase tracking-widest" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-black uppercase tracking-widest">LINK TUJUAN (OPSIONAL)</label>
                    <div className="relative">
                      <LinkIcon size={18} strokeWidth={3} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input placeholder="HTTPS://..." value={formData.link || ""} onChange={(e) => setFormData({ ...formData, link: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-white border-2 border-black rounded-none text-sm font-black text-black outline-none focus:bg-black focus:text-white transition-all uppercase tracking-widest" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === "works" && (
              <>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-black uppercase tracking-widest">NAMA KARYA / PROJECT</label>
                  <input placeholder="MISAL: REDESIGN LOGO KOPI SENJA" value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-black rounded-none text-sm font-black text-black outline-none focus:bg-black focus:text-white transition-all placeholder:text-gray-400 uppercase tracking-widest" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-black uppercase tracking-widest">NAMA CLIENT</label>
                    <div className="relative">
                      <Briefcase size={18} strokeWidth={3} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input placeholder="PT. ABC / ANONIM" value={formData.client_name || ""} onChange={(e) => setFormData({ ...formData, client_name: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-white border-2 border-black rounded-none text-sm font-black text-black outline-none focus:bg-black focus:text-white transition-all uppercase tracking-widest" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-black uppercase tracking-widest">LAMA PENGERJAAN</label>
                    <div className="relative">
                      <Clock size={18} strokeWidth={3} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input placeholder="MISAL: 2 HARI" value={formData.duration_text || ""} onChange={(e) => setFormData({ ...formData, duration_text: e.target.value })} className="w-full pl-11 pr-4 py-3 bg-white border-2 border-black rounded-none text-sm font-black text-black outline-none focus:bg-black focus:text-white transition-all uppercase tracking-widest" />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[11px] font-black text-black uppercase tracking-widest">TEKS BADGE</label>
                    <input placeholder="MISAL: BESTSELLER / TOP RATED" value={formData.badge || ""} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-black rounded-none text-sm font-black text-black outline-none focus:bg-black focus:text-white transition-all placeholder:text-gray-400 uppercase tracking-widest" />
                </div>
              </>
            )}

            {activeSection === "updates" && (
              <>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-black uppercase tracking-widest">EMAIL CLIENT (ATAU 'ALL' UNTUK SEMUA)</label>
                  <input placeholder="USER@GMAIL.COM / ALL" value={formData.client_email || ""} onChange={(e) => setFormData({ ...formData, client_email: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-black rounded-none text-sm font-black text-black outline-none focus:bg-black focus:text-white transition-all placeholder:text-gray-400 uppercase tracking-widest" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-black uppercase tracking-widest">JUDUL / NAMA ORDERAN</label>
                  <input placeholder="MISAL: DESAIN BANNER 17AN" value={formData.title || ""} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-black rounded-none text-sm font-black text-black outline-none focus:bg-black focus:text-white transition-all placeholder:text-gray-400 uppercase tracking-widest" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-black uppercase tracking-widest">STATUS PROGRES PENGERJAAN</label>
                  <input placeholder="MISAL: SEDANG TAHAP SKETSA..." value={formData.status_text || ""} onChange={(e) => setFormData({ ...formData, status_text: e.target.value })} className="w-full px-4 py-3 bg-white border-2 border-black rounded-none text-sm font-black text-black outline-none focus:bg-black focus:text-white transition-all placeholder:text-gray-400 uppercase tracking-widest" />
                </div>
              </>
            )}

            {/* Action Buttons Form */}
            <div className="flex flex-col-reverse sm:flex-row gap-4 justify-end mt-8 pt-6 border-t-4 border-black">
              <button onClick={() => setShowForm(false)} className="px-6 py-3 bg-white text-black border-2 border-black rounded-none text-xs font-black uppercase tracking-widest hover:bg-gray-100 active:translate-y-0.5 outline-none transition-all">
                BATAL
              </button>
              <button onClick={handleAdd} disabled={isSubmitting} className={`flex items-center justify-center gap-2 px-8 py-3 bg-black text-white border-2 border-black rounded-none text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black active:translate-y-1 active:shadow-none transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none disabled:opacity-50`}>
                {isSubmitting ? <Loader2 size={18} strokeWidth={3} className="animate-spin" /> : "SIMPAN DATA"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DATA LIST ================= */}
      <div className="space-y-4">
        {/* ---- NEWS LIST ---- */}
        {activeSection === "news" && (
          news.length > 0 ? news.map((item) => (
            <div key={item.id} className="bg-white p-5 border-4 border-black rounded-none flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="hidden sm:flex w-14 h-14 bg-black text-white rounded-none items-center justify-center border-2 border-black shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <ImageIcon size={24} strokeWidth={3} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-black text-black truncate mb-1 uppercase tracking-widest">{item.title}</h3>
                  <p className="text-xs text-gray-500 truncate font-bold uppercase tracking-widest">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0 ml-4">
                <span className={`hidden sm:inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1.5 border-2 border-black ${item.is_active ? "bg-green-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" : "bg-gray-200 text-gray-600"}`}>
                  {item.is_active ? "AKTIF" : "OFF"}
                </span>
                <button onClick={() => handleDelete("news", item.id)} className="w-12 h-12 flex items-center justify-center rounded-none bg-red-500 text-white border-2 border-black hover:bg-black transition-all active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none">
                  <Trash2 size={20} strokeWidth={3} />
                </button>
              </div>
            </div>
          )) : <EmptyState section="Kabar Info" />
        )}

        {/* ---- WORKS LIST ---- */}
        {activeSection === "works" && (
          works.length > 0 ? works.map((item) => (
            <div key={item.id} className="bg-white p-5 border-4 border-black rounded-none flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="hidden sm:flex w-14 h-14 bg-blue-500 text-white rounded-none items-center justify-center border-2 border-black shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Crown size={24} strokeWidth={3} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-black text-black truncate mb-1 uppercase tracking-widest">{item.title}</h3>
                  <p className="text-xs text-gray-500 truncate font-bold flex items-center gap-2 uppercase tracking-widest">
                    <span className="bg-black text-white px-2 py-0.5">{item.client_name}</span> 
                    &bull; {item.duration_text}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0 ml-4">
                <span className="hidden sm:inline-block text-[10px] font-black uppercase tracking-widest bg-yellow-400 text-black px-3 py-1.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {item.badge}
                </span>
                <button onClick={() => handleDelete("works", item.id)} className="w-12 h-12 flex items-center justify-center rounded-none bg-red-500 text-white border-2 border-black hover:bg-black transition-all active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none">
                  <Trash2 size={20} strokeWidth={3} />
                </button>
              </div>
            </div>
          )) : <EmptyState section="Karya Top" />
        )}

        {/* ---- UPDATES LIST ---- */}
        {activeSection === "updates" && (
          updates.length > 0 ? updates.map((item) => (
            <div key={item.id} className="bg-white p-5 border-4 border-black rounded-none flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="hidden sm:flex w-14 h-14 bg-green-400 text-black rounded-none items-center justify-center border-2 border-black shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Activity size={24} strokeWidth={3} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-black text-black truncate mb-1 uppercase tracking-widest">{item.title}</h3>
                  <div className="flex items-center gap-2 truncate text-xs font-bold uppercase tracking-widest">
                    <span className={`px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${item.client_email === 'all' ? 'bg-purple-400 text-black' : 'bg-white text-black'}`}>
                      {item.client_email === 'all' ? 'SEMUA USER' : item.client_email}
                    </span>
                    <span className="text-gray-500 truncate">&bull; {item.status_text}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0 ml-4">
                <button onClick={() => handleDelete("updates", item.id)} className="w-12 h-12 flex items-center justify-center rounded-none bg-red-500 text-white border-2 border-black hover:bg-black transition-all active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none">
                  <Trash2 size={20} strokeWidth={3} />
                </button>
              </div>
            </div>
          )) : <EmptyState section="Live Order" />
        )}
      </div>
    </div>
  )
}

// Komponen Reusable untuk Empty State
function EmptyState({ section }: { section: string }) {
  return (
    <div className="text-center py-16 bg-white rounded-none border-4 border-dashed border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
      <div className="w-20 h-20 bg-black text-white rounded-none flex items-center justify-center mx-auto mb-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <Newspaper size={32} strokeWidth={3} />
      </div>
      <h4 className="text-xl font-black text-black mb-2 uppercase tracking-widest">BELUM ADA DATA {section}</h4>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">KLIK TOMBOL "TAMBAH DATA" DI ATAS UNTUK MEMBUAT.</p>
    </div>
  )
}