"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, X, Edit3, Image as ImageIcon, Loader2 } from "lucide-react"
import Swal from "sweetalert2"

interface PortfolioDesign {
  id: number
  title: string
  category: string
  image: string
  description: string
  created_at: string
}

export function TabPortfolioDesigns() {
  const [items, setItems] = useState<PortfolioDesign[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<PortfolioDesign>>({})

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/portfolio-designs", { cache: "no-store" })
      const json = await res.json()
      setItems(json.data || [])
    } catch { /* fail silently */ }
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.category || !formData.image) {
      Swal.fire({ icon: 'error', text: 'Judul, kategori, dan gambar wajib diisi' })
      return
    }

    setIsSubmitting(true)
    const url = editingId ? `/api/admin/portfolio-designs/${editingId}` : "/api/admin/portfolio-designs"
    const method = editingId ? "PATCH" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      
      if (res.ok) {
        setShowForm(false)
        setEditingId(null)
        setFormData({})
        fetchItems()
        Swal.fire({ icon: 'success', title: 'Berhasil', timer: 1500, showConfirmButton: false })
      } else {
        Swal.fire({ icon: 'error', text: 'Gagal menyimpan data' })
      }
    } catch {
      Swal.fire({ icon: 'error', text: 'Error jaringan' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({ title: 'Hapus Data?', icon: 'warning', showCancelButton: true, confirmButtonText: 'Ya, Hapus' })
    if (!result.isConfirmed) return

    try {
      const res = await fetch(`/api/admin/portfolio-designs/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Gagal")
      fetchItems()
      Swal.fire({ icon: 'success', title: 'Terhapus', timer: 1500, showConfirmButton: false })
    } catch {
      Swal.fire({ icon: 'error', text: 'Gagal menghapus' })
    }
  }

  const handleEdit = (item: PortfolioDesign) => {
    setEditingId(item.id)
    setFormData(item)
    setShowForm(true)
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 bg-white border-4 border-black border-dashed mt-4">
      <Loader2 size={40} strokeWidth={3} className="animate-spin text-black mb-4" />
      <p className="text-sm font-black text-black uppercase tracking-widest animate-pulse">Memuat Data Server</p>
    </div>
  )

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      
      <div className="flex justify-between items-center bg-white p-5 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <h2 className="text-xl font-black uppercase tracking-widest">Portfolio Desain</h2>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Kelola showcase desain poster/grafis</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({}) }}
          className={`flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black border-4 border-black text-xs font-black uppercase tracking-widest hover:bg-white active:translate-y-0.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${showForm ? 'hidden' : ''}`}>
          <Plus size={18} strokeWidth={3} /> TAMBAH KARYA
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 md:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 relative">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-xl flex items-center gap-3 uppercase tracking-widest">
              <Edit3 size={20} strokeWidth={3} /> {editingId ? "EDIT KARYA" : "TAMBAH KARYA"}
            </h3>
            <button onClick={() => setShowForm(false)} className="border-2 border-black p-2 hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5">
              <X size={20} strokeWidth={3} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest">Judul Karya</label>
              <input value={formData.title || ""} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-white border-2 border-black text-sm font-black outline-none focus:bg-black focus:text-white transition-all uppercase" placeholder="MISAL: POSTER EDUKASI KESEHATAN" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest">Kategori</label>
                <input value={formData.category || ""} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-3 bg-white border-2 border-black text-sm font-black outline-none focus:bg-black focus:text-white transition-all uppercase" placeholder="MISAL: EDUKASI / PROMOSI" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest">URL Gambar</label>
                <input value={formData.image || ""} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-3 bg-white border-2 border-black text-sm font-black outline-none focus:bg-black focus:text-white transition-all" placeholder="https://..." />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest">Deskripsi Singkat</label>
              <textarea rows={3} value={formData.description || ""} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-white border-2 border-black text-sm font-black outline-none focus:bg-black focus:text-white transition-all uppercase resize-none" placeholder="JELASKAN DETAIL KARYA INI..." />
            </div>

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t-4 border-black">
              <button onClick={() => setShowForm(false)} className="px-6 py-3 bg-white border-2 border-black text-xs font-black uppercase hover:bg-gray-100 active:translate-y-0.5 transition-all">BATAL</button>
              <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 bg-black text-white border-2 border-black text-xs font-black uppercase hover:bg-white hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 transition-all disabled:opacity-50">
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "SIMPAN"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col">
            <div className="aspect-[4/5] border-b-4 border-black overflow-hidden relative bg-gray-100">
               {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 bg-black text-white px-3 py-1 text-[10px] font-black uppercase border-2 border-black">
                {item.category}
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-black text-lg uppercase tracking-widest line-clamp-1 mb-1">{item.title}</h3>
              <p className="text-xs font-bold text-gray-500 uppercase line-clamp-2 flex-1 mb-4">{item.description}</p>
              
              <div className="flex gap-2 border-t-2 border-black pt-4">
                <button onClick={() => handleEdit(item)} className="flex-1 bg-white border-2 border-black py-2 text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-colors">EDIT</button>
                <button onClick={() => handleDelete(item.id)} className="w-10 bg-red-500 border-2 border-black flex items-center justify-center text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && !showForm && (
          <div className="col-span-full text-center py-20 bg-white border-4 border-dashed border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <ImageIcon size={40} strokeWidth={3} className="mx-auto text-black mb-4" />
            <h4 className="text-xl font-black uppercase tracking-widest">BELUM ADA PORTFOLIO</h4>
          </div>
        )}
      </div>

    </div>
  )
}
