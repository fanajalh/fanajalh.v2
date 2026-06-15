"use client"

import { useState, useEffect, useCallback } from "react"
import { Users, Search, Plus, Upload, Edit3, Trash2, Mail, Key, Filter, X, Loader2, ChevronLeft, ChevronRight, AlertCircle, Phone, Globe, MapPin, Tag } from "lucide-react"
import Link from "next/link"
import Swal from "@/lib/custom-alert"
import { useEcosystemAccess } from "@/lib/ecosystem-access-hook"
import EcosystemMobileNav from "@/components/sections/EcosystemMobileNav"

interface Contact {
  id: string
  name: string
  email: string
  phone: string
  website: string
  address: string
  category: string
  status: string
  source: string
  notes: string
  created_at: string
}

const STATUS_CONFIG: Record<string, { color: string }> = {
  NEW: { color: "text-slate-600 bg-slate-100 border-slate-200" },
  CONTACTED: { color: "text-blue-600 bg-blue-50 border-blue-100" },
  OPENED: { color: "text-amber-600 bg-amber-50 border-amber-100" },
  REPLIED: { color: "text-green-600 bg-green-50 border-green-100" },
  DEAL: { color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
}

const STATUSES = ["NEW", "CONTACTED", "OPENED", "REPLIED", "DEAL"]

export default function MobileCRMPage() {
  const { loading: accessLoading, allowed, SelectorModal } = useEcosystemAccess("crm")
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", website: "", address: "", category: "", notes: "" })
  const [csvText, setCsvText] = useState("")
  const [importing, setImporting] = useState(false)

  const fetchContacts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "10" })
      if (search) params.set("search", search)
      if (statusFilter) params.set("status", statusFilter)
      const res = await fetch(`/api/crm?${params}`)
      const data = await res.json()
      if (data.success) {
        setContacts(data.contacts)
        setTotalPages(data.pagination.totalPages)
        setTotal(data.pagination.total)
      }
    } catch { }
    setLoading(false)
  }, [page, search, statusFilter])

  useEffect(() => { fetchContacts() }, [fetchContacts])

  const handleAdd = async () => {
    if (!formData.name) { Swal.fire({ icon: "warning", text: "Nama wajib diisi", confirmButtonColor: "#ea580c" }); return }
    try {
      const res = await fetch("/api/crm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        Swal.fire({ icon: "success", text: "Contact ditambahkan!", timer: 1500, showConfirmButton: false })
        setShowAddModal(false)
        setFormData({ name: "", email: "", phone: "", website: "", address: "", category: "", notes: "" })
        fetchContacts()
      }
    } catch { Swal.fire({ icon: "error", text: "Gagal menambahkan", confirmButtonColor: "#ea580c" }) }
  }

  const handleUpdate = async () => {
    if (!editingContact) return
    try {
      const res = await fetch(`/api/crm/${editingContact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if ((await res.json()).success) {
        Swal.fire({ icon: "success", text: "Contact diupdate!", timer: 1500, showConfirmButton: false })
        setEditingContact(null)
        fetchContacts()
      }
    } catch { Swal.fire({ icon: "error", text: "Gagal update", confirmButtonColor: "#ea580c" }) }
  }

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({ title: "Hapus Contact?", icon: "warning", showCancelButton: true, confirmButtonText: "Ya, Hapus!", confirmButtonColor: "#d33", cancelButtonColor: "#64748b" })
    if (!result.isConfirmed) return
    try {
      await fetch(`/api/crm/${id}`, { method: "DELETE" })
      fetchContacts()
      Swal.fire({ icon: "success", text: "Dihapus!", timer: 1500, showConfirmButton: false })
    } catch { }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/crm/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      fetchContacts()
    } catch { }
  }

  const handleImport = async () => {
    if (!csvText.trim()) { Swal.fire({ icon: "warning", text: "Data CSV kosong", confirmButtonColor: "#ea580c" }); return }
    setImporting(true)
    try {
      const lines = csvText.trim().split("\n")
      const headers = lines[0].split(",").map(h => h.trim().toLowerCase())
      const csvData = lines.slice(1).map(line => {
        const values = line.split(",").map(v => v.trim())
        const obj: any = {}
        headers.forEach((h, i) => { obj[h] = values[i] || "" })
        return obj
      })
      const res = await fetch("/api/crm/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvData }),
      })
      const data = await res.json()
      if (data.success) {
        Swal.fire({ icon: "success", title: "Berhasil!", text: data.message, timer: 2000, showConfirmButton: false })
        setShowImportModal(false)
        setCsvText("")
        fetchContacts()
      }
    } catch { Swal.fire({ icon: "error", text: "Gagal import", confirmButtonColor: "#ea580c" }) }
    setImporting(false)
  }

  const openEdit = (c: Contact) => {
    setFormData({ name: c.name, email: c.email || "", phone: c.phone || "", website: c.website || "", address: c.address || "", category: c.category || "", notes: c.notes || "" })
    setEditingContact(c)
  }

  if (accessLoading || !allowed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-orange-600" />
      </div>
    )
  }

  if (SelectorModal) {
    return SelectorModal
  }

  return (
    <div className="bg-[#f4f6f9] min-h-screen pb-24 font-sans select-none w-full flex flex-col items-center">
      <div className="w-full max-w-md bg-[#f4f6f9] min-h-screen flex flex-col">
        {/* 1. SUPER APP HEADER */}
        <div className="bg-orange-600 pt-12 pb-6 px-4 rounded-b-[2rem] shadow-sm sticky top-0 z-50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link href="/home" className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors active:scale-95">
                <ChevronLeft size={24} strokeWidth={2.5} />
              </Link>
              <div className="flex-1">
                <h1 className="text-white text-lg font-extrabold tracking-tight">CRM Contacts</h1>
                <p className="text-orange-100 text-xs font-medium">Pusat Database — {total} Prospek</p>
              </div>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => setShowImportModal(true)} className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white active:scale-90 transition-all outline-none" title="Import CSV">
                <Upload size={16} />
              </button>
              <button onClick={() => { setFormData({ name: "", email: "", phone: "", website: "", address: "", category: "", notes: "" }); setShowAddModal(true) }} className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white active:scale-90 transition-all outline-none" title="Tambah Kontak">
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* 2. PROGRESSION TABS SUBHEADER */}
        <EcosystemMobileNav />

        {/* 3. SEARCH & STATUS FILTERS */}
        <div className="px-4 mt-6 flex flex-col gap-3">
          <div className="relative w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Cari prospek..."
              className="w-full pl-10 pr-4 py-3 bg-white text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-all shadow-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-1">
            <button
              onClick={() => { setStatusFilter(""); setPage(1) }}
              className={`snap-center px-4 py-2 rounded-full text-[11px] font-extrabold tracking-wide border transition-all active:scale-95 outline-none ${
                !statusFilter
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
              }`}
            >
              Semua
            </button>
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(1) }}
                className={`snap-center px-4 py-2 rounded-full text-[11px] font-extrabold tracking-wide border transition-all active:scale-95 outline-none ${
                  statusFilter === s
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 4. CONTACTS LIST */}
        <div className="px-4 mt-4 flex-1">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 size={32} className="animate-spin text-orange-500 mb-3" />
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Memuat Kontak...</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-[2rem] border border-slate-150 p-6">
              <Users size={40} className="mx-auto mb-3 text-slate-300" />
              <h3 className="text-sm font-extrabold text-slate-800 uppercase mb-1">Belum Ada Kontak</h3>
              <p className="text-xs font-semibold text-slate-400 leading-relaxed mb-4">Mulai kumpulkan calon pelanggan lewat Lead Finder.</p>
              <Link
                href="/ecosystem/lead-finder"
                className="inline-flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-full text-[11px] font-extrabold transition-colors active:scale-95 shadow-sm outline-none"
              >
                Mulai Cari Lead <ChevronRight size={14} strokeWidth={3} />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {contacts.map((c) => {
                const statusCfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.NEW
                return (
                  <div
                    key={c.id}
                    className="bg-white rounded-[1.8rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col hover:shadow-md transition-all duration-200"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start gap-2 mb-3">
                      <div>
                        <h3 className="font-extrabold text-[14px] text-slate-800 leading-snug">{c.name}</h3>
                        <div className="flex items-center gap-1.5 mt-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          <span>{c.source}</span>
                          {c.category && (
                            <>
                              <span>•</span>
                              <span className="text-slate-500">{c.category}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <select
                        value={c.status}
                        onChange={(e) => handleStatusChange(c.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase border tracking-wider cursor-pointer outline-none ${statusCfg.color}`}
                      >
                        {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5 text-xs text-slate-500 pl-0.5 border-t border-slate-100 pt-3">
                      {c.email && (
                        <div className="flex items-center gap-2">
                          <Mail size={12} className="text-slate-400 shrink-0" />
                          <span className="font-medium truncate">{c.email}</span>
                        </div>
                      )}
                      {c.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={12} className="text-slate-400 shrink-0" />
                          <span className="font-semibold text-slate-600">{c.phone}</span>
                        </div>
                      )}
                      {c.website && (
                        <div className="flex items-center gap-2">
                          <Globe size={12} className="text-slate-400 shrink-0" />
                          <span className="font-medium text-orange-600 truncate">{c.website}</span>
                        </div>
                      )}
                      {c.address && (
                        <div className="flex items-start gap-2">
                          <MapPin size={12} className="text-slate-400 shrink-0 mt-0.5" />
                          <span className="font-medium leading-relaxed line-clamp-1">{c.address}</span>
                        </div>
                      )}
                      {c.notes && (
                        <div className="bg-slate-50 rounded-xl p-2.5 text-[11px] font-medium text-slate-500 border border-slate-100/50 mt-1 leading-relaxed">
                          {c.notes}
                        </div>
                      )}
                    </div>

                    {/* Quick actions inside card */}
                    <div className="flex items-center justify-between border-t border-slate-100 mt-4 pt-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEdit(c)}
                          className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/ecosystem/keyword?contact=${c.id}&name=${encodeURIComponent(c.name)}&category=${encodeURIComponent(c.category || '')}&website=${encodeURIComponent(c.website || '')}`}
                          className="bg-purple-50 hover:bg-purple-100 text-purple-600 px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1 border border-purple-100 transition-all active:scale-95"
                          title="Keywords"
                        >
                          <Key size={10} /> Kata Kunci
                        </Link>
                        <Link
                          href={`/ecosystem/blast?contact=${c.id}`}
                          className="bg-orange-50 hover:bg-orange-100 text-orange-600 px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1 border border-orange-100 transition-all active:scale-95"
                          title="Kirim Email"
                        >
                          <Mail size={10} /> Email Blast
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 5. PAGINATION */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 mt-6 pb-6 w-full">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-extrabold text-slate-600 disabled:opacity-40 transition-all active:scale-95"
            >
              <ChevronLeft size={14} /> Prev
            </button>
            <span className="text-xs font-extrabold text-slate-400">{page} / {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => p + 1)}
              className="flex items-center gap-1 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-extrabold text-slate-600 disabled:opacity-40 transition-all active:scale-95"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* ADD/EDIT MODAL */}
        {(showAddModal || editingContact) && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-t-[2.5rem] p-6 shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-10 duration-300">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />

              <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                    {editingContact ? "Edit Kontak" : "Tambah Kontak"}
                  </h2>
                  <p className="text-xs font-semibold text-slate-500 mt-1">Lengkapi form data prospek di bawah</p>
                </div>
                <button
                  onClick={() => { setShowAddModal(false); setEditingContact(null) }}
                  className="bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors rounded-full p-2"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { key: "name", label: "Nama Prospek *", placeholder: "Nama bisnis atau kontak" },
                  { key: "email", label: "Email", placeholder: "email@contoh.com" },
                  { key: "phone", label: "Telepon / WA", placeholder: "+62..." },
                  { key: "website", label: "Website", placeholder: "https://..." },
                  { key: "address", label: "Alamat Lengkap", placeholder: "Alamat lengkap usaha" },
                  { key: "category", label: "Kategori Bisnis", placeholder: "Cafe, Restoran, dll" },
                  { key: "notes", label: "Catatan Prospek", placeholder: "Catatan khusus kontak" },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">{f.label}</label>
                    <input
                      value={(formData as any)[f.key]}
                      onChange={(e) => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={editingContact ? handleUpdate : handleAdd}
                className="w-full mt-6 py-4 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-full text-xs uppercase tracking-widest active:scale-95 transition-all shadow-md shadow-orange-600/30"
              >
                {editingContact ? "Simpan Perubahan" : "Simpan Kontak Baru"}
              </button>
            </div>
          </div>
        )}

        {/* IMPORT CSV MODAL */}
        {showImportModal && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-t-[2.5rem] p-6 shadow-2xl w-full max-w-md animate-in slide-in-from-bottom-10 duration-300">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />

              <div className="flex justify-between items-start mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 leading-tight">Import Data Prospek</h2>
                  <p className="text-xs font-semibold text-slate-400 mt-1">Format header: name,email,phone,category</p>
                </div>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors rounded-full p-2"
                >
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>

              <textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                rows={8}
                placeholder={`name,email,phone,category\nCafe A,a@gmail.com,0812xxx,Cafe\nToko B,b@gmail.com,0813xxx,Retail`}
                className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-xs font-mono outline-none focus:border-orange-500 transition-colors"
              />

              <button
                onClick={handleImport}
                disabled={importing}
                className="w-full mt-4 py-4 bg-orange-600 hover:bg-orange-700 text-white font-extrabold rounded-full text-xs uppercase tracking-widest active:scale-95 transition-all shadow-md shadow-orange-600/30 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {importing ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                {importing ? "Mengimpor Data..." : "Impor Data Prospek"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
