"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Key, Search, Loader2, Save, Sparkles, CheckCircle2, ChevronRight, AlertCircle, ChevronLeft } from "lucide-react"
import Link from "next/link"
import Swal from "@/lib/custom-alert"
import { useEcosystemAccess } from "@/lib/ecosystem-access-hook"
import EcosystemMobileNav from "@/components/sections/EcosystemMobileNav"

interface Contact {
  id: string
  name: string
  email: string
  website: string
  category: string
}

interface KeywordSuggestion {
  keyword: string
  volume: number
  difficulty: "easy" | "medium" | "hard"
  intent: "informational" | "commercial" | "transactional" | "navigational"
  selected?: boolean
}

function MobileKeywordPageContent() {
  const { loading: accessLoading, allowed, SelectorModal } = useEcosystemAccess("keyword")
  const searchParams = useSearchParams()
  const router = useRouter()

  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContactId, setSelectedContactId] = useState<string>("")
  
  const [businessName, setBusinessName] = useState("")
  const [category, setCategory] = useState("")
  const [website, setWebsite] = useState("")
  const [location, setLocation] = useState("Indonesia")
  
  const [keywords, setKeywords] = useState<KeywordSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [generated, setGenerated] = useState(false)

  useEffect(() => {
    async function fetchContacts() {
      try {
        const res = await fetch("/api/crm?limit=100")
        const data = await res.json()
        if (data.success) {
          setContacts(data.contacts)
        }
      } catch (err) {
        console.error("Gagal mengambil data kontak CRM", err)
      }
    }
    fetchContacts()
  }, [])

  useEffect(() => {
    if (!searchParams) return
    const contactId = searchParams.get("contact")
    const nameParam = searchParams.get("name")
    const catParam = searchParams.get("category")
    const webParam = searchParams.get("website")

    if (contactId) setSelectedContactId(contactId)
    if (nameParam) setBusinessName(nameParam)
    if (catParam) setCategory(catParam)
    if (webParam) setWebsite(webParam)
  }, [searchParams])

  const handleContactChange = (id: string) => {
    setSelectedContactId(id)
    if (id === "custom") {
      setBusinessName("")
      setCategory("")
      setWebsite("")
    } else {
      const contact = contacts.find(c => c.id.toString() === id)
      if (contact) {
        setBusinessName(contact.name)
        setCategory(contact.category || "")
        setWebsite(contact.website || "")
      }
    }
  }

  const handleGenerate = async () => {
    if (!businessName.trim()) {
      Swal.fire({ icon: "warning", text: "Nama bisnis wajib diisi!", confirmButtonColor: "#ea580c" })
      return
    }
    setLoading(true)
    setError("")
    setGenerated(true)

    try {
      const res = await fetch("/api/keyword/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          category,
          website,
          location
        }),
      })
      const data = await res.json()
      if (data.success) {
        setKeywords(data.keywords.map((k: any) => ({ ...k, selected: true })))
      } else {
        setError(data.message || "Gagal generate keyword suggestion")
      }
    } catch {
      setError("Gagal menghubungi server AI")
    } finally {
      setLoading(false)
    }
  }

  const toggleSelect = (index: number) => {
    setKeywords(prev => prev.map((k, i) => i === index ? { ...k, selected: !k.selected } : k))
  }

  const toggleSelectAll = () => {
    const allSelected = keywords.every(k => k.selected)
    setKeywords(prev => prev.map(k => ({ ...k, selected: !allSelected })))
  }

  const handleSave = async () => {
    const selected = keywords.filter(k => k.selected)
    if (selected.length === 0) {
      Swal.fire({ icon: "warning", text: "Pilih minimal 1 keyword untuk disimpan!", confirmButtonColor: "#ea580c" })
      return
    }

    setSaving(true)
    try {
      const contact_id = selectedContactId && selectedContactId !== "custom" ? parseInt(selectedContactId) : null
      
      const res = await fetch("/api/keyword/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: selected,
          contact_id
        }),
      })
      const data = await res.json()
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: data.message,
          showCancelButton: true,
          confirmButtonText: "Buka SEO Tools",
          cancelButtonText: "Tetap di sini",
          confirmButtonColor: "#ea580c",
          cancelButtonColor: "#64748b"
        }).then((result) => {
          if (result.isConfirmed) {
            const kwsParam = encodeURIComponent(selected.map(s => s.keyword).join(","))
            router.push(`/ecosystem/seo-tools?business=${encodeURIComponent(businessName)}&keywords=${kwsParam}&contact=${selectedContactId || ""}`)
          }
        })
        setKeywords(prev => prev.map(k => k.selected ? { ...k, selected: false } : k))
      } else {
        Swal.fire({ icon: "error", text: data.message, confirmButtonColor: "#ea580c" })
      }
    } catch (err) {
      Swal.fire({ icon: "error", text: "Gagal menyimpan keyword ke database", confirmButtonColor: "#ea580c" })
    } finally {
      setSaving(false)
    }
  }

  const selectedCount = keywords.filter(k => k.selected).length

  const difficultyColors = {
    easy: "bg-emerald-50 text-emerald-600 border-emerald-100",
    medium: "bg-amber-50 text-amber-600 border-amber-100",
    hard: "bg-rose-50 text-rose-600 border-rose-100",
  }

  const intentColors = {
    informational: "bg-blue-50 text-blue-600 border-blue-100",
    commercial: "bg-purple-50 text-purple-600 border-purple-100",
    transactional: "bg-teal-50 text-teal-600 border-teal-100",
    navigational: "bg-slate-100 text-slate-500 border-slate-200",
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
          <div className="flex items-center gap-3">
            <Link href="/home" className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors active:scale-95">
              <ChevronLeft size={24} strokeWidth={2.5} />
            </Link>
            <div className="flex-1">
              <h1 className="text-white text-lg font-extrabold tracking-tight">Keyword Planner</h1>
              <p className="text-orange-100 text-xs font-medium">Temukan Target Kata Kunci AI</p>
            </div>
          </div>
        </div>

        {/* 2. PROGRESSION TABS SUBHEADER */}
        <EcosystemMobileNav />

        {/* 3. MAIN FORM */}
        <div className="px-4 mt-6">
          <div className="bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col gap-4">
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Pilih dari Database Prospek (CRM)</label>
              <select
                value={selectedContactId}
                onChange={(e) => handleContactChange(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-colors"
              >
                <option value="">-- Pilih Kontak dari Database Prospek (CRM) --</option>
                {contacts.map(c => (
                  <option key={c.id} value={c.id.toString()}>
                    {c.name} ({c.category || "Kustom"})
                  </option>
                ))}
                <option value="custom">Ketik Kustom / Baru</option>
              </select>
            </div>

            <hr className="border-t border-slate-100 my-1" />

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Nama Bisnis *</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="cth. Kopi Mantap"
                className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Kategori Bisnis</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="cth. Cafe / Coffee Shop"
                className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Website</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="cth. www.kopimantap.com"
                className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Target Lokasi</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="cth. Indonesia"
                className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-colors active:scale-95 outline-none flex items-center justify-center gap-1.5 shadow-sm shadow-orange-600/30 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {loading ? "Analisis Niche..." : "Generate Kata Kunci"}
            </button>
          </div>
        </div>

        {/* 4. ERROR MESSAGE */}
        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-650">
            <AlertCircle size={20} className="shrink-0" />
            <span className="font-semibold text-xs leading-relaxed">{error}</span>
          </div>
        )}

        {/* 5. RESULTS LIST */}
        {loading ? (
          <div className="text-center py-20 mx-4 mt-6 bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
            <Loader2 size={36} className="mx-auto mb-3 text-orange-500 animate-spin" />
            <h3 className="text-sm font-extrabold text-slate-850 uppercase mb-1">AI Sedang Bekerja</h3>
            <p className="text-xs font-semibold text-slate-400 max-w-[200px] mx-auto leading-relaxed">Mencari kata kunci pencarian terbanyak dan termudah dari Google Indonesia.</p>
          </div>
        ) : keywords.length > 0 ? (
          <div className="px-4 mt-6 flex flex-col gap-4">
            {/* Header Action Bar */}
            <div className="flex items-center justify-between bg-white rounded-2xl p-3 shadow-[0_4px_20px_rgba(0,0,0,0.01)] border border-slate-100">
              <div className="flex items-center gap-3">
                <button onClick={toggleSelectAll} className="text-[11px] font-extrabold uppercase text-slate-500 hover:text-slate-850">
                  {keywords.every(k => k.selected) ? "Batal Pilih" : "Pilih Semua"}
                </button>
                <span className="text-[11px] font-bold text-slate-400">{keywords.length} kata kunci</span>
              </div>
              {selectedCount > 0 && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-[11px] font-extrabold transition-colors active:scale-95 outline-none flex items-center gap-1 shadow-sm disabled:opacity-50"
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  Simpan ({selectedCount})
                </button>
              )}
            </div>

            {/* List Keywords Cards */}
            <div className="flex flex-col gap-3">
              {keywords.map((kw, index) => (
                <div
                  key={index}
                  onClick={() => toggleSelect(index)}
                  className={`p-4 rounded-[1.8rem] border transition-all cursor-pointer flex items-center justify-between ${
                    kw.selected
                      ? "bg-emerald-50/50 border-emerald-200 shadow-sm"
                      : "bg-white border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-3 max-w-[70%]">
                    <div className={`w-5 h-5 border rounded-md flex items-center justify-center shrink-0 transition-colors ${kw.selected ? "bg-emerald-600 border-emerald-600" : "bg-white border-slate-300"}`}>
                      {kw.selected && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-extrabold text-xs text-slate-850 truncate">{kw.keyword}</h3>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">Pencarian: {kw.volume.toLocaleString("id-ID")} / bln</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase border tracking-wider ${difficultyColors[kw.difficulty]}`}>
                      {kw.difficulty}
                    </span>
                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase border tracking-wider ${intentColors[kw.intent]}`}>
                      {kw.intent.slice(0, 4)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : generated && !error ? (
          <div className="text-center py-16 mx-4 mt-6 bg-white rounded-[2rem] border border-slate-150 p-6">
            <Search size={36} className="mx-auto mb-3 text-slate-300" />
            <h3 className="text-sm font-extrabold text-slate-800 uppercase mb-1">Tidak Ada Hasil</h3>
            <p className="text-xs font-semibold text-slate-400">Ganti kategori atau niche bisnis di atas.</p>
          </div>
        ) : (
          <div className="text-center py-16 mx-4 mt-6 bg-white rounded-[2rem] border border-dashed border-slate-200 p-6">
            <Key size={36} className="mx-auto mb-3 text-slate-300" />
            <h3 className="text-sm font-extrabold text-slate-300 uppercase mb-1">Analisis Kata Kunci</h3>
            <p className="text-xs font-bold text-slate-450 max-w-[200px] mx-auto leading-relaxed">AI akan memetakan keyword volume & Search Intent spesifik untuk bisnis Anda.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MobileKeywordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-orange-600" />
      </div>
    }>
      <MobileKeywordPageContent />
    </Suspense>
  )
}
