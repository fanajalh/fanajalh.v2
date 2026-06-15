"use client"

import { useState } from "react"
import { Search, MapPin, Globe, Phone, Star, Save, Loader2, Building2, CheckCircle2, AlertCircle } from "lucide-react"
import EcosystemNav from "@/components/sections/EcosystemNav"
import Swal from "sweetalert2"
import { useEcosystemAccess } from "@/lib/ecosystem-access-hook"

interface Lead {
  title: string
  address: string
  phone: string
  website: string
  rating: number
  reviews: number
  category: string
  cid: string
  selected?: boolean
}

const CATEGORIES = [
  "Cafe", "Restaurant", "Hotel", "Salon", "Gym", "Klinik", "Apotek",
  "Toko Baju", "Bengkel", "Laundry", "Percetakan", "Fotografer",
  "Wedding Organizer", "Catering", "Pet Shop", "Barbershop",
]

export default function LeadFinderPage() {
  const { loading: accessLoading, allowed, SelectorModal } = useEcosystemAccess("lead_finder")
  const [category, setCategory] = useState("")
  const [customCategory, setCustomCategory] = useState("")
  const [location, setLocation] = useState("")
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    const cat = category === "custom" ? customCategory : category
    if (!cat || !location) {
      Swal.fire({ icon: "warning", text: "Kategori dan lokasi wajib diisi!" })
      return
    }
    setLoading(true)
    setError("")
    setSearched(true)

    try {
      const res = await fetch("/api/leads/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: cat, location }),
      })
      const data = await res.json()
      if (data.success) {
        setLeads(data.leads.map((l: Lead) => ({ ...l, selected: false })))
      } else {
        setError(data.message)
      }
    } catch {
      setError("Gagal menghubungi server")
    } finally {
      setLoading(false)
    }
  }

  const toggleSelect = (index: number) => {
    setLeads(prev => prev.map((l, i) => i === index ? { ...l, selected: !l.selected } : l))
  }

  const toggleSelectAll = () => {
    const allSelected = leads.every(l => l.selected)
    setLeads(prev => prev.map(l => ({ ...l, selected: !allSelected })))
  }

  const saveToCRM = async () => {
    const selected = leads.filter(l => l.selected)
    if (selected.length === 0) {
      Swal.fire({ icon: "warning", text: "Pilih minimal 1 lead untuk disimpan" })
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/leads/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads: selected }),
      })
      const data = await res.json()
      if (data.success) {
        Swal.fire({ icon: "success", title: "Berhasil!", text: data.message, timer: 2000, showConfirmButton: false })
        setLeads(prev => prev.map(l => l.selected ? { ...l, selected: false } : l))
      } else {
        Swal.fire({ icon: "error", text: data.message })
      }
    } catch {
      Swal.fire({ icon: "error", text: "Gagal menyimpan" })
    } finally {
      setSaving(false)
    }
  }

  const selectedCount = leads.filter(l => l.selected).length

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
            <div className="mb-8 border-l-8 border-black dark:border-white pl-4">
              <h2 className="text-3xl font-black text-black dark:text-white uppercase tracking-widest">Cari Lead Bisnis</h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Temukan calon pelanggan berdasarkan kategori & lokasi</p>
            </div>

            {/* Search Form */}
            <div className="bg-white dark:bg-white/5 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] mb-8">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Kategori Bisnis</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <option value="">Pilih Kategori</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="custom">Lainnya (ketik sendiri)</option>
                  </select>
                  {category === "custom" && (
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Ketik kategori..."
                      className="w-full mt-2 px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Lokasi</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Jakarta, Bandung, Surabaya..."
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-sm border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                    {loading ? "Mencari..." : "Cari Lead"}
                  </button>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 flex items-center gap-3 text-red-700 dark:text-red-400">
                <AlertCircle size={20} />
                <span className="font-bold text-sm">{error}</span>
              </div>
            )}

            {/* Results */}
            {leads.length > 0 && (
              <>
                {/* Action Bar */}
                <div className="flex items-center justify-between mb-4 bg-white dark:bg-white/5 border-2 border-black dark:border-white p-3">
                  <div className="flex items-center gap-4">
                    <button onClick={toggleSelectAll} className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                      {leads.every(l => l.selected) ? "Batal Pilih Semua" : "Pilih Semua"}
                    </button>
                    <span className="text-xs font-bold text-gray-400">{leads.length} lead ditemukan</span>
                  </div>
                  {selectedCount > 0 && (
                    <button
                      onClick={saveToCRM}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white font-black uppercase tracking-widest text-xs border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                    >
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      Save {selectedCount} ke CRM
                    </button>
                  )}
                </div>

                {/* Lead Cards Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-black dark:border-white">
                  {leads.map((lead, index) => (
                    <div
                      key={index}
                      onClick={() => toggleSelect(index)}
                      className={`relative p-5 border-r border-b border-black dark:border-white cursor-pointer transition-all ${
                        lead.selected
                          ? "bg-emerald-50 dark:bg-emerald-900/20"
                          : "bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-white/5"
                      }`}
                    >
                      {/* Selection indicator */}
                      <div className={`absolute top-3 right-3 w-6 h-6 border-2 border-black dark:border-white flex items-center justify-center transition-colors ${
                        lead.selected ? "bg-emerald-500" : "bg-white dark:bg-black"
                      }`}>
                        {lead.selected && <CheckCircle2 size={14} className="text-white" />}
                      </div>

                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 bg-black dark:bg-white flex items-center justify-center flex-shrink-0">
                          <Building2 size={18} className="text-white dark:text-black" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-black text-sm text-black dark:text-white uppercase tracking-wide truncate pr-8">{lead.title}</h3>
                          {lead.rating > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Star size={12} className="text-yellow-500 fill-current" />
                              <span className="text-[10px] font-black text-gray-500">{lead.rating} ({lead.reviews})</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        {lead.address && (
                          <div className="flex items-start gap-2 text-gray-500 dark:text-gray-400">
                            <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                            <span className="font-medium line-clamp-2">{lead.address}</span>
                          </div>
                        )}
                        {lead.phone && (
                          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <Phone size={12} className="flex-shrink-0" />
                            <span className="font-medium">{lead.phone}</span>
                          </div>
                        )}
                        {lead.website && (
                          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                            <Globe size={12} className="flex-shrink-0" />
                            <span className="font-medium truncate">{lead.website}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Empty State */}
            {searched && !loading && leads.length === 0 && !error && (
              <div className="text-center py-20 bg-white dark:bg-white/5 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
                <Search size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-widest mb-2">Tidak Ada Hasil</h3>
                <p className="text-sm font-bold text-gray-500">Coba kategori atau lokasi yang berbeda</p>
              </div>
            )}

            {/* Initial State */}
            {!searched && (
              <div className="text-center py-20 bg-white dark:bg-white/5 border-4 border-dashed border-gray-300 dark:border-gray-700">
                <Search size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest mb-2">Mulai Cari Lead</h3>
                <p className="text-sm font-bold text-gray-400 dark:text-gray-500">Masukkan kategori bisnis dan lokasi untuk mencari calon pelanggan</p>
              </div>
            )}
          </>
        )}
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
