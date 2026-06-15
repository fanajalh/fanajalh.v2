"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Sparkles, Loader2, Code, Info, CheckCircle2, Copy, Globe, AlertCircle, Building2, Check, ArrowRight, BookOpen } from "lucide-react"
import EcosystemNav from "@/components/sections/EcosystemNav"
import Swal from "sweetalert2"
import { useEcosystemAccess } from "@/lib/ecosystem-access-hook"

interface Contact {
  id: number
  name: string
  email: string
  website: string
  category: string
}

interface GEOContent {
  simulated_summary: string
  organization_schema: any
  faq_schema: any
  audit_checklist: Array<{ task: string; status: string; action: string }>
  brand_strategy: string
}

function AIOptimizationPageContent() {
  const { loading: accessLoading, allowed, SelectorModal } = useEcosystemAccess("geo")
  const searchParams = useSearchParams()
  const router = useRouter()

  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContactId, setSelectedContactId] = useState<string>("")

  // Form states
  const [brandName, setBrandName] = useState("")
  const [category, setCategory] = useState("")
  const [website, setWebsite] = useState("")
  const [founder, setFounder] = useState("")
  const [location, setLocation] = useState("Indonesia")
  const [keywords, setKeywords] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<GEOContent | null>(null)
  
  // Tab states for JSON-LD viewer
  const [schemaTab, setSchemaTab] = useState<"org" | "faq">("org")
  
  // Interactive checklist states
  const [checkedTasks, setCheckedTasks] = useState<Record<number, boolean>>({})

  // Fetch CRM contacts
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

  // Parse URL search params
  useEffect(() => {
    if (!searchParams) return
    const contactId = searchParams.get("contact")
    const brandParam = searchParams.get("brand") || searchParams.get("name")
    const catParam = searchParams.get("category")
    const webParam = searchParams.get("website")

    if (contactId) setSelectedContactId(contactId)
    if (brandParam) setBrandName(brandParam)
    if (catParam) setCategory(catParam)
    if (webParam) setWebsite(webParam)
  }, [searchParams])

  const handleContactChange = (id: string) => {
    setSelectedContactId(id)
    if (id === "custom") {
      setBrandName("")
      setCategory("")
      setWebsite("")
    } else {
      const contact = contacts.find(c => c.id.toString() === id)
      if (contact) {
        setBrandName(contact.name)
        setCategory(contact.category || "")
        setWebsite(contact.website || "")
      }
    }
  }

  const handleGenerate = async () => {
    if (!brandName.trim()) {
      Swal.fire({ icon: "warning", text: "Nama brand/bisnis wajib diisi!" })
      return
    }
    if (!website.trim()) {
      Swal.fire({ icon: "warning", text: "URL website wajib diisi!" })
      return
    }

    setLoading(true)
    setError("")
    setResult(null)
    setCheckedTasks({})

    try {
      const res = await fetch("/api/geo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: brandName,
          category,
          website,
          founder,
          location,
          keywords
        })
      })
      const data = await res.json()
      if (data.success) {
        setResult(data.geoContent)
      } else {
        setError(data.message || "Gagal menghasilkan rekomendasi optimasi AI")
      }
    } catch {
      setError("Gagal menghubungi server AI")
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    Swal.fire({
      icon: "success",
      title: "Disalin!",
      text: "Kode Schema JSON-LD berhasil disalin ke clipboard.",
      timer: 1500,
      showConfirmButton: false
    })
  }

  const toggleCheck = (index: number) => {
    setCheckedTasks(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
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
          <h2 className="text-3xl font-black text-black dark:text-white uppercase tracking-widest">Google AI Search Optimization</h2>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
            Optimasi GEO (Generative Engine Optimization) agar brand Anda dideteksi & dirangkum oleh Google AI Gemini
          </p>
        </div>

        {/* Info Box */}
        <div className="mb-8 bg-sky-50 dark:bg-sky-950/20 border-4 border-black dark:border-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-sky-600 dark:text-sky-450 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-black uppercase tracking-wider text-black dark:text-white mb-1">
                Mengapa Optimasi AI Google (GEO/AIO) Penting?
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold leading-relaxed">
                Saat ini, Google menggunakan AI Search (Gemini / Search Generative Experience) untuk langsung meringkas hasil pencarian di bagian teratas. 
                Dengan menanamkan **Schema Markup terstruktur**, mencantumkan entitas brand di direktori penting, serta menggunakan tag HTML semantik, 
                AI Google dapat mengenali profil website Anda (misal: mencari nama brand Anda seperti <i>"fanajalh"</i>) lalu merangkum dan mereferensikan bisnis Anda secara instan.
              </p>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Left Form */}
          <div className="lg:col-span-1 bg-white dark:bg-white/5 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Pilih dari Database Prospek (CRM)</label>
              <select
                value={selectedContactId}
                onChange={(e) => handleContactChange(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <option value="">-- Pilih Kontak dari Database Prospek --</option>
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
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Nama Brand / Bisnis *</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="cth. Fanajalh"
                className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Website URL *</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="cth. https://fanajah.com"
                className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Kategori Bisnis</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="cth. Jasa Desain Poster / Jasa Web"
                className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Nama Pendiri (Founder)</label>
              <input
                type="text"
                value={founder}
                onChange={(e) => setFounder(e.target.value)}
                placeholder="cth. Arfan"
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

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">Layanan & Kata Kunci Utama</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="cth. pembuatan poster, desain logo, branding"
                className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-sm border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
              {loading ? "Generating GEO..." : "Generate Optimasi AI"}
            </button>
          </div>

          {/* Right Output */}
          <div className="lg:col-span-2">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 flex items-center gap-3 text-red-700 dark:text-red-400">
                <AlertCircle size={20} />
                <span className="font-bold text-sm">{error}</span>
              </div>
            )}

            {loading ? (
              <div className="text-center py-32 bg-white dark:bg-white/5 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
                <Loader2 size={48} className="mx-auto mb-4 text-emerald-500 animate-spin" />
                <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-widest mb-2">Merumuskan Strategi GEO...</h3>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Google Gemini sedang membuat Schema Markup & pemetaan entitas brand</p>
              </div>
            ) : result ? (
              <div className="space-y-8">
                {/* 1. SIMULATOR AI GOOGLE SEARCH */}
                <div className="bg-white dark:bg-[#121212] border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs font-black uppercase text-gray-400 tracking-wider ml-2">Simulasi Google AI Search (SGE)</span>
                  </div>

                  <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 border-2 border-black dark:border-white p-5 rounded-none">
                    <div className="flex items-center gap-2 mb-3 text-indigo-600 dark:text-indigo-400">
                      <Sparkles size={16} />
                      <span className="text-xs font-black uppercase tracking-wider">AI Overview</span>
                    </div>
                    <p className="text-sm font-bold text-slate-850 dark:text-slate-200 leading-relaxed mb-4">
                      {result.simulated_summary}
                    </p>
                    <div className="flex gap-2 flex-wrap items-center">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Sumber Informasi:</span>
                      <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-black border border-black text-xs font-bold hover:bg-gray-50">
                        <Globe size={10} />
                        <span>{website.replace(/https?:\/\//, "")}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* 2. SCHEMA MARKUP JSON-LD GENERATOR */}
                <div className="bg-white dark:bg-white/5 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
                  {/* Selector tabs */}
                  <div className="flex border-b-4 border-black dark:border-white bg-gray-50 dark:bg-black">
                    <button
                      onClick={() => setSchemaTab("org")}
                      className={`flex-1 py-4 text-xs font-black uppercase tracking-widest border-r-4 border-black dark:border-white transition-colors ${
                        schemaTab === "org"
                          ? "bg-black dark:bg-white text-white dark:text-black"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                      }`}
                    >
                      Organization Schema
                    </button>
                    <button
                      onClick={() => setSchemaTab("faq")}
                      className={`flex-1 py-4 text-xs font-black uppercase tracking-widest transition-colors ${
                        schemaTab === "faq"
                          ? "bg-black dark:bg-white text-white dark:text-black"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
                      }`}
                    >
                      FAQ Schema (Brand Entity)
                    </button>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        JSON-LD Code (Tempel di bagian &lt;head&gt; website Anda)
                      </span>
                      <button
                        onClick={() => handleCopy(JSON.stringify(schemaTab === "org" ? result.organization_schema : result.faq_schema, null, 2))}
                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white border-2 border-black text-xs font-black uppercase tracking-wider hover:translate-y-0.5 hover:shadow-[1px_1px_0px_rgba(0,0,0,1)] shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        <Copy size={12} />
                        Copy Code
                      </button>
                    </div>

                    <pre className="p-4 bg-gray-900 text-emerald-400 font-mono text-xs overflow-x-auto border-2 border-black max-h-[300px] leading-relaxed">
                      {JSON.stringify(schemaTab === "org" ? result.organization_schema : result.faq_schema, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* 3. GEO AUDIT CHECKLIST */}
                <div className="bg-white dark:bg-white/5 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
                  <h3 className="text-lg font-black uppercase tracking-wider mb-4 text-black dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="text-emerald-500" />
                    Langkah Audit AI-Readiness (GEO Checklist)
                  </h3>
                  <div className="space-y-4">
                    {result.audit_checklist.map((item, index) => {
                      const isChecked = checkedTasks[index] || false
                      return (
                        <div
                          key={index}
                          onClick={() => toggleCheck(index)}
                          className={`p-4 border-2 border-black cursor-pointer transition-all flex items-start gap-4 ${
                            isChecked ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500" : "bg-white dark:bg-white/5"
                          }`}
                        >
                          <div className={`w-6 h-6 border-2 border-black flex items-center justify-center shrink-0 ${isChecked ? "bg-emerald-500 text-white" : "bg-white dark:bg-black"}`}>
                            {isChecked && <Check size={14} strokeWidth={3} />}
                          </div>
                          <div>
                            <h4 className={`text-xs font-black uppercase tracking-wider ${isChecked ? "text-emerald-700 dark:text-emerald-400 line-through" : "text-black dark:text-white"}`}>
                              {item.task}
                            </h4>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                              {item.action}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* 4. BRAND STRATEGY OVERVIEW */}
                <div className="bg-yellow-50 dark:bg-yellow-950/20 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
                  <h3 className="text-lg font-black uppercase tracking-wider mb-3 text-yellow-800 dark:text-yellow-400 flex items-center gap-2">
                    <BookOpen />
                    Strategi Visibilitas Mesin Generatif (GEO)
                  </h3>
                  <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-400 leading-relaxed">
                    {result.brand_strategy}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-32 bg-white dark:bg-white/5 border-4 border-dashed border-gray-300 dark:border-gray-700">
                <Sparkles size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest mb-2">Optimasi AI Google (GEO)</h3>
                <p className="text-sm font-bold text-gray-400 dark:text-gray-500 max-w-[450px] mx-auto leading-relaxed">
                  Isi informasi profil bisnis Anda di sebelah kiri. Sistem AI akan menyusun skema JSON-LD dan checklist audit agar brand Anda langsung terbaca oleh AI Google.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function AIOptimizationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-black dark:text-white" />
      </div>
    }>
      <AIOptimizationPageContent />
    </Suspense>
  )
}
