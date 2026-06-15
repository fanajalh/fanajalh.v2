"use client"

import { useState } from "react"
import { Search, MapPin, Globe, Phone, Star, Save, Loader2, Building2, CheckCircle2, AlertCircle, ChevronLeft } from "lucide-react"
import Link from "next/link"
import Swal from "@/lib/custom-alert"
import { useEcosystemAccess } from "@/lib/ecosystem-access-hook"
import EcosystemMobileNav from "@/components/sections/EcosystemMobileNav"

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

export default function MobileLeadFinderPage() {
  const { loading: accessLoading, allowed, SelectorModal } = useEcosystemAccess("lead_finder")
  const [category, setCategory] = useState("")
  const [customCategory, setCustomCategory] = useState("")
  const [location, setLocation] = useState("")
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [searched, setSearched] = useState(false)

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

  const handleSearch = async () => {
    const cat = category === "custom" ? customCategory : category
    if (!cat || !location) {
      Swal.fire({ icon: "warning", text: "Kategori dan lokasi wajib diisi!", confirmButtonColor: "#ea580c" })
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
      Swal.fire({ icon: "warning", text: "Pilih minimal 1 lead untuk disimpan", confirmButtonColor: "#ea580c" })
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
        Swal.fire({ icon: "success", title: "Berhasil!", text: data.message, timer: 1500, showConfirmButton: false })
        setLeads(prev => prev.map(l => l.selected ? { ...l, selected: false } : l))
      } else {
        Swal.fire({ icon: "error", text: data.message, confirmButtonColor: "#ea580c" })
      }
    } catch {
      Swal.fire({ icon: "error", text: "Gagal menyimpan", confirmButtonColor: "#ea580c" })
    } finally {
      setSaving(false)
    }
  }

  const selectedCount = leads.filter(l => l.selected).length

  return (
    <div className="bg-[#f4f6f9] min-h-screen pb-24 font-sans select-none w-full flex flex-col items-center">
      <div className="w-full max-w-md bg-[#f4f6f9] min-h-screen flex flex-col">
        {/* 1. SUPER APP HEADER */}
        <div className="bg-orange-600 pt-12 pb-6 px-4 rounded-b-[2rem] shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Link href="/home" className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors active:scale-95">
              <ChevronLeft size={24} strokeWidth={2.5} />
            </Link>
            <div className="flex-1">
              <h1 className="text-white text-lg font-extrabold tracking-tight">Lead Finder</h1>
              <p className="text-orange-100 text-xs font-medium">Cari Prospek Bisnis Real-Time</p>
            </div>
          </div>
        </div>

        {/* 2. PROGRESSION TABS SUBHEADER */}
        <EcosystemMobileNav />

        {/* 3. MAIN FORM */}
        <div className="px-4 mt-6">
          <div className="bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col gap-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">Kategori Bisnis</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-colors"
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
                  className="w-full mt-2 px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-colors"
                />
              )}
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">Lokasi Kota</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Jakarta, Bandung, Surabaya..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-colors active:scale-95 outline-none flex items-center justify-center gap-1.5 shadow-sm shadow-orange-600/30 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              {loading ? "Mencari Prospek..." : "Cari Prospek"}
            </button>
          </div>
        </div>

        {/* 4. ERROR MESSAGE */}
        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-600">
            <AlertCircle size={20} className="shrink-0" />
            <span className="font-semibold text-xs leading-relaxed">{error}</span>
          </div>
        )}

        {/* 5. RESULTS LIST */}
        {leads.length > 0 && (
          <div className="px-4 mt-6 flex flex-col gap-4">
            {/* Header Action Bar */}
            <div className="flex items-center justify-between bg-white rounded-2xl p-3 shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-slate-100">
              <div className="flex items-center gap-3">
                <button onClick={toggleSelectAll} className="text-[11px] font-extrabold uppercase text-slate-500 hover:text-slate-800">
                  {leads.every(l => l.selected) ? "Batal Pilih" : "Pilih Semua"}
                </button>
                <span className="text-[11px] font-bold text-slate-400">{leads.length} lead</span>
              </div>
              {selectedCount > 0 && (
                <button
                  onClick={saveToCRM}
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-[11px] font-extrabold transition-colors active:scale-95 outline-none flex items-center gap-1 shadow-sm disabled:opacity-50"
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  Simpan ({selectedCount})
                </button>
              )}
            </div>

            {/* List Lead Cards */}
            <div className="flex flex-col gap-3">
              {leads.map((lead, index) => (
                <div
                  key={index}
                  onClick={() => toggleSelect(index)}
                  className={`p-4 rounded-[1.8rem] border transition-all cursor-pointer flex flex-col justify-between ${
                    lead.selected
                      ? "bg-emerald-50/50 border-emerald-200 shadow-sm"
                      : "bg-white border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${lead.selected ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-100 text-slate-400 border-slate-200/80'}`}>
                      {lead.selected ? <CheckCircle2 size={18} /> : <Building2 size={18} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold text-[13px] text-slate-850 truncate leading-snug">{lead.title}</h3>
                      {lead.rating > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={11} className="text-yellow-500 fill-current" />
                          <span className="text-[10px] font-bold text-slate-400">{lead.rating} ({lead.reviews} ulasan)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-500 pl-1">
                    {lead.address && (
                      <div className="flex items-start gap-2">
                        <MapPin size={12} className="mt-0.5 shrink-0 text-slate-400" />
                        <span className="font-medium line-clamp-2 leading-relaxed">{lead.address}</span>
                      </div>
                    )}
                    {lead.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={12} className="shrink-0 text-slate-400" />
                        <span className="font-semibold text-slate-600">{lead.phone}</span>
                      </div>
                    )}
                    {lead.website && (
                      <div className="flex items-center gap-2">
                        <Globe size={12} className="shrink-0 text-slate-400" />
                        <span className="font-medium text-orange-600 truncate">{lead.website}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. EMPTY STATE */}
        {searched && !loading && leads.length === 0 && !error && (
          <div className="text-center py-16 mx-4 mt-6 bg-white rounded-[2rem] border border-slate-150 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <Search size={36} className="mx-auto mb-3 text-slate-300" />
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-1">Tidak Ada Hasil</h3>
            <p className="text-xs font-semibold text-slate-400">Coba kategori atau lokasi yang lain</p>
          </div>
        )}

        {/* 7. INITIAL STATE */}
        {!searched && (
          <div className="text-center py-16 mx-4 mt-6 bg-white rounded-[2rem] border border-dashed border-slate-200">
            <Search size={36} className="mx-auto mb-3 text-slate-300" />
            <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider mb-1">Mulai Cari Prospek</h3>
            <p className="text-xs font-bold text-slate-400 max-w-[200px] mx-auto leading-relaxed">Pilih kategori bisnis dan isi lokasi kota di atas.</p>
          </div>
        )}
      </div>
    </div>
  )
}
