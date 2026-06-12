"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, RefreshCw, Loader2, ImageIcon, Pencil, X, Upload, User, ToggleLeft, ToggleRight } from "lucide-react"
import Swal from "sweetalert2"

type FrameRow = {
  id: number
  slug: string
  name: string
  description: string | null
  image_url: string
  slots: number
  sort_order: number
  is_active: boolean
  uploaded_by: number | null
  uploader_name: string | null
}

const emptyForm = {
  slug: "",
  name: "",
  description: "",
  image_url: "",
  slots: 4,
  sort_order: 0,
  is_active: true,
}

export default function TabPhotoboothFrames() {
  const [rows, setRows] = useState<FrameRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<FrameRow | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [filter, setFilter] = useState<"all" | "admin" | "user">("all")

  const fetchRows = async () => {
    try {
      const res = await fetch("/api/admin/photobooth-frames")
      const json = await res.json()
      if (json.success) setRows(json.data || [])
    } catch {
      setRows([])
    }
  }

  useEffect(() => {
    fetchRows().finally(() => setLoading(false))
  }, [])

  const openNew = () => {
    setEditing(null)
    setForm(emptyForm)
    setShowForm(true)
  }

  const openEdit = (r: FrameRow) => {
    setEditing(r)
    setForm({
      slug: r.slug,
      name: r.name,
      description: r.description || "",
      image_url: r.image_url,
      slots: r.slots,
      sort_order: r.sort_order,
      is_active: r.is_active,
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        const res = await fetch(`/api/admin/photobooth-frames/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.message || "Gagal")
        Swal.fire({ icon: "success", title: "Diperbarui", timer: 1200, showConfirmButton: false })
      } else {
        const res = await fetch("/api/admin/photobooth-frames", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.message || "Gagal")
        Swal.fire({ icon: "success", title: "Ditambahkan", timer: 1200, showConfirmButton: false })
      }
      setShowForm(false)
      setEditing(null)
      setForm(emptyForm)
      fetchRows()
    } catch (err: any) {
      Swal.fire({ icon: "error", text: err.message || "Error" })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (r: FrameRow) => {
    const ok = await Swal.fire({
      title: "Hapus frame?",
      text: r.name,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
    })
    if (!ok.isConfirmed) return
    try {
      const res = await fetch(`/api/admin/photobooth-frames/${r.id}`, { method: "DELETE" })
      const json = await res.json()
      if (json.success) {
        fetchRows()
        Swal.fire({ icon: "success", title: "Terhapus", timer: 1000, showConfirmButton: false })
      } else throw new Error(json.message)
    } catch (e: any) {
      Swal.fire({ icon: "error", text: e.message || "Gagal" })
    }
  }

  const toggleActive = async (r: FrameRow) => {
    try {
      const res = await fetch(`/api/admin/photobooth-frames/${r.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !r.is_active }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.message || "Gagal")
      fetchRows()
      Swal.fire({
        icon: "success",
        title: r.is_active ? "Frame dinonaktifkan" : "Frame diaktifkan",
        timer: 1000,
        showConfirmButton: false,
      })
    } catch (e: any) {
      Swal.fire({ icon: "error", text: e.message || "Gagal" })
    }
  }

  // Filter rows
  const filteredRows = rows.filter((r) => {
    if (filter === "admin") return !r.uploaded_by
    if (filter === "user") return !!r.uploaded_by
    return true
  })

  const userUploadCount = rows.filter((r) => r.uploaded_by).length
  const adminUploadCount = rows.filter((r) => !r.uploaded_by).length

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white border-4 border-dashed border-black mt-4">
        <Loader2 className="w-10 h-10 animate-spin text-black mb-4" strokeWidth={3} />
        <p className="text-xs font-black text-black uppercase tracking-widest">MEMUAT FRAME…</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border-4 border-black rounded-none p-5 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-4xl font-black text-black">{rows.length}</p>
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-2 border-t-2 border-black pt-2">TOTAL FRAME</p>
        </div>
        <div className="bg-white border-4 border-black rounded-none p-5 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-4xl font-black text-black">{adminUploadCount}</p>
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-2 border-t-2 border-black pt-2">ADMIN UPLOAD</p>
        </div>
        <div className="bg-white border-4 border-black rounded-none p-5 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-4xl font-black text-black">{userUploadCount}</p>
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-2 border-t-2 border-black pt-2">USER UPLOAD</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-5 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
        <div className="flex bg-white overflow-x-auto no-scrollbar w-full md:w-auto border-4 border-black">
          {(["all", "admin", "user"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`flex-1 md:flex-none px-6 py-3 text-xs font-black uppercase tracking-widest transition-all border-r-4 border-black last:border-r-0 whitespace-nowrap ${
                filter === f
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              {f === "all" ? `SEMUA (${rows.length})` : f === "admin" ? `ADMIN (${adminUploadCount})` : `USER (${userUploadCount})`}
            </button>
          ))}
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button
            type="button"
            onClick={() => fetchRows()}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-none border-4 border-black bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
          >
            <RefreshCw size={18} strokeWidth={3} /> REFRESH
          </button>
          <button
            type="button"
            onClick={openNew}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-none bg-yellow-400 border-4 border-black text-black font-black uppercase tracking-widest text-xs hover:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
          >
            <Plus size={20} strokeWidth={3} /> FRAME BARU
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredRows.map((r) => (
          <div
            key={r.id}
            className={`bg-white border-4 border-black rounded-none p-5 flex flex-col sm:flex-row gap-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all ${
              !r.is_active ? "opacity-75 bg-gray-100" : ""
            }`}
          >
            <div className="w-full sm:w-28 sm:h-36 shrink-0 bg-white border-2 border-black p-2 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={r.image_url} alt="" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-black text-xl text-black truncate uppercase tracking-widest">{r.name}</p>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest truncate">{r.slug}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                  {r.uploaded_by ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-white bg-blue-500 px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <User size={12} strokeWidth={3} /> USER
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-black bg-yellow-400 px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      ADMIN
                    </span>
                  )}
                  {!r.is_active && (
                    <span className="text-[10px] font-black uppercase text-white bg-red-500 px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      OFF
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2 mt-3 font-bold uppercase tracking-widest flex-1">{r.description || "—"}</p>
              
              <div className="border-t-2 border-dashed border-black pt-3 mt-3">
                <p className="text-[10px] text-black font-black uppercase tracking-widest mb-3">
                  {r.slots} SLOT &bull; URUT {r.sort_order}
                  {r.uploader_name && (
                    <span className="ml-2 text-blue-600">&bull; OLEH {r.uploader_name}</span>
                  )}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => toggleActive(r)}
                    className={`text-[10px] font-black inline-flex items-center gap-1 px-3 py-1.5 transition-all border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none uppercase tracking-widest ${
                      r.is_active
                        ? "text-white bg-red-500"
                        : "text-black bg-green-400"
                    }`}
                  >
                    {r.is_active ? (
                      <><ToggleRight size={14} strokeWidth={3} /> NONAKTIFKAN</>
                    ) : (
                      <><ToggleLeft size={14} strokeWidth={3} /> AKTIFKAN</>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(r)}
                    className="text-[10px] font-black text-black bg-white hover:bg-black hover:text-white border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all inline-flex items-center gap-1 uppercase tracking-widest"
                  >
                    <Pencil size={12} strokeWidth={3} /> EDIT
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(r)}
                    className="text-[10px] font-black text-white bg-black hover:bg-red-500 border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all inline-flex items-center gap-1 uppercase tracking-widest"
                  >
                    <Trash2 size={12} strokeWidth={3} /> HAPUS
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRows.length === 0 && (
        <p className="text-center text-black font-black text-sm py-16 bg-white border-4 border-dashed border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest mt-4">
          {filter === "user"
            ? "BELUM ADA FRAME DARI USER."
            : filter === "admin"
            ? "BELUM ADA FRAME DARI ADMIN."
            : "BELUM ADA FRAME. TAMBAH DARI TOMBOL DI ATAS."}
        </p>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border-4 border-black rounded-none shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 relative">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 p-2 border-2 border-black rounded-none hover:bg-black hover:text-white transition-colors bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none text-black"
            >
              <X size={20} strokeWidth={3} />
            </button>
            <h3 className="text-xl font-black text-black mb-6 flex items-center gap-3 uppercase tracking-widest">
              <div className="p-2 border-2 border-black bg-yellow-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <ImageIcon className="text-black" size={24} strokeWidth={3} />
              </div>
              {editing ? "EDIT FRAME" : "FRAME BARU"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-black text-black uppercase tracking-widest">SLUG</label>
                <input
                  required
                  disabled={!!editing}
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full mt-2 px-4 py-3 border-2 border-black rounded-none text-sm font-black text-black outline-none focus:bg-black focus:text-white disabled:bg-gray-200 transition-colors uppercase"
                  placeholder="GOOD-VIBES"
                />
              </div>
              <div>
                <label className="text-xs font-black text-black uppercase tracking-widest">NAMA</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full mt-2 px-4 py-3 border-2 border-black rounded-none text-sm font-black text-black outline-none focus:bg-black focus:text-white transition-colors uppercase tracking-widest"
                />
              </div>
              <div>
                <label className="text-xs font-black text-black uppercase tracking-widest">DESKRIPSI</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full mt-2 px-4 py-3 border-2 border-black rounded-none text-sm font-black text-black outline-none focus:bg-black focus:text-white transition-colors uppercase tracking-widest min-h-[90px] resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-black text-black uppercase tracking-widest">URL GAMBAR (CDN / HTTPS)</label>
                <input
                  required
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  className="w-full mt-2 px-4 py-3 border-2 border-black rounded-none text-sm font-black text-black outline-none focus:bg-black focus:text-white transition-colors"
                  placeholder="HTTPS://CDN.EXAMPLE.COM/FRAME.PNG"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-black text-black uppercase tracking-widest">SLOTS FOTO</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={form.slots}
                    onChange={(e) => setForm({ ...form, slots: parseInt(e.target.value, 10) || 4 })}
                    className="w-full mt-2 px-4 py-3 border-2 border-black rounded-none text-sm font-black text-black outline-none focus:bg-black focus:text-white transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-black uppercase tracking-widest">URUTAN</label>
                  <input
                    type="number"
                    value={form.sort_order}
                    onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })}
                    className="w-full mt-2 px-4 py-3 border-2 border-black rounded-none text-sm font-black text-black outline-none focus:bg-black focus:text-white transition-colors"
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                      className="peer sr-only"
                    />
                    <div className="w-8 h-8 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] peer-checked:bg-black peer-checked:shadow-none transition-all flex items-center justify-center">
                      {form.is_active && <X size={16} strokeWidth={4} className="text-white rotate-45" />}
                    </div>
                  </div>
                  <span className="text-xs font-black text-black uppercase tracking-widest">AKTIF (TAMPIL DI HALAMAN PENGGUNA)</span>
                </label>
              </div>

              <div className="pt-6 border-t-4 border-black mt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-4 rounded-none bg-black text-white font-black uppercase tracking-widest border-2 border-black hover:bg-white hover:text-black active:translate-y-1 active:shadow-none transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "MENYIMPAN…" : editing ? "SIMPAN PERUBAHAN" : "SIMPAN"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
