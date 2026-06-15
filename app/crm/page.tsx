"use client"

import { useState, useEffect, useCallback } from "react"
import { Users, Search, Plus, Upload, Edit3, Trash2, Mail, Key, Filter, X, Loader2, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import EcosystemNav from "@/components/sections/EcosystemNav"
import Swal from "sweetalert2"
import Link from "next/link"
import { useEcosystemAccess } from "@/lib/ecosystem-access-hook"

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

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  NEW: { color: "text-gray-700 dark:text-gray-300", bg: "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600" },
  CONTACTED: { color: "text-blue-700 dark:text-blue-300", bg: "bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600" },
  OPENED: { color: "text-yellow-700 dark:text-yellow-300", bg: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-600" },
  REPLIED: { color: "text-green-700 dark:text-green-300", bg: "bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-600" },
  DEAL: { color: "text-emerald-700 dark:text-emerald-300", bg: "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-600" },
}

const STATUSES = ["NEW", "CONTACTED", "OPENED", "REPLIED", "DEAL"]

export default function CRMPage() {
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
      const params = new URLSearchParams({ page: page.toString(), limit: "15" })
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
    if (!formData.name) { Swal.fire({ icon: "warning", text: "Nama wajib diisi" }); return }
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
    } catch { Swal.fire({ icon: "error", text: "Gagal menambahkan" }) }
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
    } catch { Swal.fire({ icon: "error", text: "Gagal update" }) }
  }

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({ title: "Hapus Contact?", icon: "warning", showCancelButton: true, confirmButtonText: "Ya, Hapus!" })
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
    if (!csvText.trim()) { Swal.fire({ icon: "warning", text: "Data CSV kosong" }); return }
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
        Swal.fire({ icon: "success", text: data.message, timer: 2000, showConfirmButton: false })
        setShowImportModal(false)
        setCsvText("")
        fetchContacts()
      }
    } catch { Swal.fire({ icon: "error", text: "Gagal import" }) }
    setImporting(false)
  }

  const openEdit = (c: Contact) => {
    setFormData({ name: c.name, email: c.email || "", phone: c.phone || "", website: c.website || "", address: c.address || "", category: c.category || "", notes: c.notes || "" })
    setEditingContact(c)
  }

  if (accessLoading || !allowed) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-black dark:text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {!SelectorModal && <EcosystemNav />}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {SelectorModal ? (
          <div className="py-12">
            {SelectorModal}
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="border-l-8 border-black dark:border-white pl-4">
                <h2 className="text-3xl font-black text-black dark:text-white uppercase tracking-widest">CRM</h2>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Pusat ekosistem — {total} kontak</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowImportModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white font-black uppercase tracking-widest text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <Upload size={14} /> Import
                </button>
                <button onClick={() => { setFormData({ name: "", email: "", phone: "", website: "", address: "", category: "", notes: "" }); setShowAddModal(true) }} className="flex items-center gap-2 px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white font-black uppercase tracking-widest text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all">
                  <Plus size={14} /> Tambah
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                  placeholder="Cari nama atau email..."
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none"
                />
              </div>
              <div className="flex gap-1 flex-wrap">
                <button onClick={() => { setStatusFilter(""); setPage(1) }} className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest border-2 transition-all ${!statusFilter ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white" : "bg-white dark:bg-black text-gray-500 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white"}`}>
                  Semua
                </button>
                {STATUSES.map(s => (
                  <button key={s} onClick={() => { setStatusFilter(s); setPage(1) }} className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest border-2 transition-all ${statusFilter === s ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white" : "bg-white dark:bg-black text-gray-500 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-black border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] overflow-x-auto">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                  <Loader2 size={32} className="animate-spin text-gray-400 mb-4" />
                  <p className="text-xs font-black uppercase tracking-widest text-gray-400">Loading...</p>
                </div>
              ) : contacts.length === 0 ? (
                <div className="py-20 text-center">
                  <Users size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <h3 className="text-xl font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest mb-2">Belum Ada Kontak</h3>
                  <p className="text-sm font-bold text-gray-400">Mulai dari <Link href="/lead-finder" className="text-black dark:text-white underline">Lead Finder</Link> atau tambah manual</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-4 border-black dark:border-white">
                      <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Nama</th>
                      <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hidden md:table-cell">Email</th>
                      <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hidden lg:table-cell">Kategori</th>
                      <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                      <th className="text-right p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((c) => {
                      const statusCfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.NEW
                      return (
                        <tr key={c.id} className="border-b border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <p className="font-black text-black dark:text-white text-sm">{c.name}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{c.source}</p>
                          </td>
                          <td className="p-4 hidden md:table-cell">
                            <p className="font-bold text-gray-600 dark:text-gray-400 text-xs">{c.email || "—"}</p>
                          </td>
                          <td className="p-4 hidden lg:table-cell">
                            <span className="text-xs font-bold text-gray-500">{c.category || "—"}</span>
                          </td>
                          <td className="p-4">
                            <select
                              value={c.status}
                              onChange={(e) => handleStatusChange(c.id, e.target.value)}
                              className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest border-2 ${statusCfg.bg} ${statusCfg.color} cursor-pointer focus:outline-none`}
                            >
                              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => openEdit(c)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" title="Edit">
                                <Edit3 size={14} className="text-gray-500" />
                              </button>
                              <Link href={`/blast?contact=${c.id}`} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" title="Blast Email">
                                <Mail size={14} className="text-gray-500" />
                              </Link>
                              <Link href={`/keyword?contact=${c.id}&name=${encodeURIComponent(c.name)}&category=${encodeURIComponent(c.category || '')}&website=${encodeURIComponent(c.website || '')}`} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors" title="Keywords">
                                <Key size={14} className="text-gray-500" />
                              </Link>
                              <button onClick={() => handleDelete(c.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Hapus">
                                <Trash2 size={14} className="text-red-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="flex items-center gap-1 px-3 py-2 text-xs font-black uppercase tracking-widest border-2 border-black dark:border-white disabled:opacity-30 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                  <ChevronLeft size={14} /> Prev
                </button>
                <span className="text-xs font-black uppercase tracking-widest text-gray-500">{page} / {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="flex items-center gap-1 px-3 py-2 text-xs font-black uppercase tracking-widest border-2 border-black dark:border-white disabled:opacity-30 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                  Next <ChevronRight size={14} />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Add / Edit Modal */}
      {(showAddModal || editingContact) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-black border-4 border-black dark:border-white p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.2)] w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b-4 border-black dark:border-white pb-4">
              <h3 className="text-xl font-black uppercase tracking-widest text-black dark:text-white">{editingContact ? "Edit Contact" : "Tambah Contact"}</h3>
              <button onClick={() => { setShowAddModal(false); setEditingContact(null) }} className="p-2 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { key: "name", label: "Nama *", placeholder: "Nama bisnis/kontak" },
                { key: "email", label: "Email", placeholder: "email@contoh.com" },
                { key: "phone", label: "Telepon", placeholder: "+62..." },
                { key: "website", label: "Website", placeholder: "https://..." },
                { key: "address", label: "Alamat", placeholder: "Alamat lengkap" },
                { key: "category", label: "Kategori", placeholder: "Cafe, Restaurant, dll" },
                { key: "notes", label: "Catatan", placeholder: "Catatan tambahan" },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{f.label}</label>
                  <input
                    value={(formData as any)[f.key]}
                    onChange={(e) => setFormData(prev => ({ ...prev, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={editingContact ? handleUpdate : handleAdd}
              className="w-full mt-6 py-3 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-sm border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              {editingContact ? "Update Contact" : "Tambah Contact"}
            </button>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-black border-4 border-black dark:border-white p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.2)] w-full max-w-lg">
            <div className="flex justify-between items-center mb-6 border-b-4 border-black dark:border-white pb-4">
              <h3 className="text-xl font-black uppercase tracking-widest text-black dark:text-white">Import CSV</h3>
              <button onClick={() => setShowImportModal(false)} className="p-2 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs font-bold text-gray-500 mb-3">Format: name,email,phone,category (baris pertama = header)</p>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={8}
              placeholder={`name,email,phone,category\nCafe A,a@gmail.com,0812xxx,Cafe\nToko B,b@gmail.com,0813xxx,Retail`}
              className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-mono focus:outline-none"
            />
            <button
              onClick={handleImport}
              disabled={importing}
              className="w-full mt-4 py-3 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-sm border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {importing ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {importing ? "Mengimport..." : "Import Data"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
