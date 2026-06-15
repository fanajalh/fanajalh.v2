"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Key, Search, Loader2, Save, Sparkles, Building2, CheckCircle2, ChevronRight, AlertCircle, Plus } from "lucide-react"
import EcosystemNav from "@/components/sections/EcosystemNav"
import Swal from "sweetalert2"
import { useEcosystemAccess } from "@/lib/ecosystem-access-hook"

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

function KeywordPageContent() {
  const { loading: accessLoading, allowed, SelectorModal } = useEcosystemAccess("keyword")
  const searchParams = useSearchParams()
  const router = useRouter()

  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContactId, setSelectedContactId] = useState<string>("")
  
  // Form state
  const [businessName, setBusinessName] = useState("")
  const [category, setCategory] = useState("")
  const [website, setWebsite] = useState("")
  const [location, setLocation] = useState("Indonesia")
  
  const [keywords, setKeywords] = useState<KeywordSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [generated, setGenerated] = useState(false)

  // Fetch CRM contacts for select dropdown
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

  // Parse URL search params if present
  useEffect(() => {
    if (!searchParams) return
    const contactId = searchParams.get("contact")
    const nameParam = searchParams.get("name")
    const catParam = searchParams.get("category")
    const webParam = searchParams.get("website")

    if (contactId) {
      setSelectedContactId(contactId)
    }
    if (nameParam) setBusinessName(nameParam)
    if (catParam) setCategory(catParam)
    if (webParam) setWebsite(webParam)
  }, [searchParams])

  // Handle contact change from dropdown
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
      Swal.fire({ icon: "warning", text: "Nama bisnis wajib diisi!" })
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
      Swal.fire({ icon: "warning", text: "Pilih minimal 1 keyword untuk disimpan!" })
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
          confirmButtonText: "Lihat SEO Tools",
          cancelButtonText: "Tetap di sini"
        }).then((result) => {
          if (result.isConfirmed) {
            // Send selected keyword names to SEO Tools
            const kwsParam = encodeURIComponent(selected.map(s => s.keyword).join(","))
            router.push(`/seo-tools?business=${encodeURIComponent(businessName)}&keywords=${kwsParam}&contact=${selectedContactId || ""}`)
          }
        })
        setKeywords(prev => prev.map(k => k.selected ? { ...k, selected: false } : k))
      } else {
        Swal.fire({ icon: "error", text: data.message })
      }
    } catch (err) {
      Swal.fire({ icon: "error", text: "Gagal menyimpan keyword ke database" })
    } finally {
      setSaving(false)
    }
  }

  const selectedCount = keywords.filter(k => k.selected).length

  const difficultyColors = {
    easy: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-300 dark:border-amber-700",
    hard: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-300 dark:border-rose-700",
  }

  const intentColors = {
    informational: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    commercial: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
    transactional: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800",
    navigational: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-white/5 dark:text-gray-400 dark:border-gray-800",
  }

  if (accessLoading || !allowed) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-black dark:text-white" />
      </div>
    )
  }

  if (SelectorModal) {
    return SelectorModal
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <EcosystemNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 border-l-8 border-black dark:border-white pl-4">
          <h2 className="text-3xl font-black text-black dark:text-white uppercase tracking-widest">Keyword Suggestion</h2>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Cari keyword target potensial menggunakan AI</p>
        </div>

        {/* Input Selector & Form */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8 items-start">
          {/* Left: Input Form */}
          <div className="lg:col-span-1 bg-white dark:bg-white/5 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Pilih dari Database Prospek (CRM)</label>
              <select
                value={selectedContactId}
                onChange={(e) => handleContactChange(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <option value="">-- Pilih Kontak dari Database Prospek (CRM) --</option>
                {contacts.map(c => (
                  <option key={c.id} value={c.id.toString()}>
                    {c.name} ({c.category || "Tanpa Kategori"})
                  </option>
                ))}
                <option value="custom">Ketik Kustom / Baru</option>
              </select>
            </div>

            <hr className="border-t-2 border-black dark:border-white my-2" />

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Nama Bisnis *</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="cth. Kopi Kenangan"
                className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Kategori Bisnis</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="cth. Cafe / Coffee Shop"
                className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Website</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="cth. www.kopikenangan.com"
                className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Target Lokasi / Negara</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="cth. Indonesia, Jakarta"
                className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-sm border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {loading ? "Generating..." : "Generate dengan AI"}
            </button>
          </div>

          {/* Right: Results Grid */}
          <div className="lg:col-span-2">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 flex items-center gap-3 text-red-700 dark:text-red-400">
                <AlertCircle size={20} />
                <span className="font-bold text-sm">{error}</span>
              </div>
            )}

            {loading ? (
              <div className="text-center py-24 bg-white dark:bg-white/5 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
                <Loader2 size={48} className="mx-auto mb-4 text-gray-400 animate-spin" />
                <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-widest mb-2">Menganalisis Niche Bisnis...</h3>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Gemini AI sedang memetakan keyword volume dan persaingan</p>
              </div>
            ) : keywords.length > 0 ? (
              <>
                {/* Action Bar */}
                <div className="flex items-center justify-between mb-4 bg-white dark:bg-white/5 border-2 border-black dark:border-white p-3">
                  <div className="flex items-center gap-4">
                    <button onClick={toggleSelectAll} className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                      {keywords.every(k => k.selected) ? "Batal Pilih Semua" : "Pilih Semua"}
                    </button>
                    <span className="text-xs font-bold text-gray-400">{keywords.length} Keyword Suggestion</span>
                  </div>
                  {selectedCount > 0 && (
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white font-black uppercase tracking-widest text-xs border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
                    >
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      Simpan {selectedCount} Keyword
                    </button>
                  )}
                </div>

                {/* Table of Keywords */}
                <div className="bg-white dark:bg-black border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-4 border-black dark:border-white">
                        <th className="w-12 p-4 text-left"></th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Keyword</th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Pencarian / Bln (Volume)</th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Difficulty</th>
                        <th className="text-left p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Search Intent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keywords.map((kw, index) => (
                        <tr
                          key={index}
                          onClick={() => toggleSelect(index)}
                          className={`border-b border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors ${
                            kw.selected ? "bg-emerald-50/50 dark:bg-emerald-950/20" : ""
                          }`}
                        >
                          <td className="p-4">
                            <div className={`w-5 h-5 border-2 border-black dark:border-white flex items-center justify-center ${kw.selected ? "bg-emerald-500" : "bg-white dark:bg-black"}`}>
                              {kw.selected && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                          </td>
                          <td className="p-4 font-black text-black dark:text-white text-sm">
                            {kw.keyword}
                          </td>
                          <td className="p-4">
                            <span className="font-bold text-xs text-gray-600 dark:text-gray-400">
                              {kw.volume.toLocaleString("id-ID")} / bln
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest border-2 rounded-none ${difficultyColors[kw.difficulty] || ""}`}>
                              {kw.difficulty}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest border-2 rounded-none ${intentColors[kw.intent] || ""}`}>
                              {kw.intent}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : generated && !error ? (
              <div className="text-center py-24 bg-white dark:bg-white/5 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <Search size={48} className="mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-widest mb-2">Tidak Ada Keyword</h3>
                <p className="text-sm font-bold text-gray-500">Coba ganti kategori bisnis atau nama bisnis</p>
              </div>
            ) : (
              <div className="text-center py-24 bg-white dark:bg-white/5 border-4 border-dashed border-gray-300 dark:border-gray-700">
                <Key size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest mb-2">Generate Keyword Suggestion</h3>
                <p className="text-sm font-bold text-gray-400 dark:text-gray-500">Isi data bisnis di form sebelah kiri untuk mendeteksi keyword potensial.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function KeywordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-black dark:text-white" />
      </div>
    }>
      <KeywordPageContent />
    </Suspense>
  )
}
