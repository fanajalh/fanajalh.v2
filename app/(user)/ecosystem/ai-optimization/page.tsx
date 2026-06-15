"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Sparkles, Loader2, Code, Info, CheckCircle2, Copy, Globe, AlertCircle, Building2, Check, ArrowRight, BookOpen, ChevronLeft } from "lucide-react"
import Link from "next/link"
import EcosystemMobileNav from "@/components/sections/EcosystemMobileNav"
import Swal from "@/lib/custom-alert"
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

function MobileAIOptimizationPageContent() {
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
  
  // Tab states for JSON-LD
  const [schemaTab, setSchemaTab] = useState<"org" | "faq">("org")
  
  // Checklist
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
      Swal.fire({ icon: "warning", text: "Nama brand/bisnis wajib diisi!", confirmButtonColor: "#ea580c" })
      return
    }
    if (!website.trim()) {
      Swal.fire({ icon: "warning", text: "URL website wajib diisi!", confirmButtonColor: "#ea580c" })
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
      text: "Kode Schema JSON-LD berhasil disalin.",
      timer: 1500,
      showConfirmButton: false,
      confirmButtonColor: "#ea580c"
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
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
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
              <h1 className="text-white text-lg font-extrabold tracking-tight">AI Optimization</h1>
              <p className="text-orange-100 text-xs font-medium">GEO (Generative Engine Optimization)</p>
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
                <option value="">-- Pilih Kontak CRM --</option>
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
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Nama Brand / Bisnis *</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="cth. Fanajalh"
                className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Website URL *</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="cth. https://fanajah.com"
                className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Kategori Bisnis</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="cth. Jasa Desain / Jasa Web"
                className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Pendiri (Founder)</label>
              <input
                type="text"
                value={founder}
                onChange={(e) => setFounder(e.target.value)}
                placeholder="cth. Arfan"
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

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Layanan Utama</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="cth. pembuatan poster, desain logo"
                className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-colors active:scale-95 outline-none flex items-center justify-center gap-1.5 shadow-sm shadow-orange-600/30 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              {loading ? "Menyusun GEO..." : "Generate Optimasi AI"}
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

        {/* 5. RESULTS AND TABS */}
        {loading ? (
          <div className="text-center py-20 mx-4 mt-6 bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
            <Loader2 size={36} className="mx-auto mb-3 text-orange-500 animate-spin" />
            <h3 className="text-sm font-extrabold text-slate-850 uppercase mb-1">AI Sedang Merancang</h3>
            <p className="text-xs font-semibold text-slate-400 max-w-[200px] mx-auto leading-relaxed">Menyusun integrasi database dan markup yang ramah bot crawler Google AI.</p>
          </div>
        ) : result ? (
          <div className="px-4 mt-6 flex flex-col gap-6">
            {/* SIMULATOR AI GOOGLE */}
            <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-3 text-slate-400">
                <Sparkles size={14} className="text-violet-500" />
                <span className="text-[10px] font-black uppercase tracking-wider">Simulasi Google AI Search (SGE)</span>
              </div>
              <div className="bg-gradient-to-r from-violet-50/50 to-indigo-50/50 border border-indigo-100 p-4 rounded-2xl">
                <p className="text-[11px] font-semibold text-slate-700 leading-relaxed mb-3">
                  {result.simulated_summary}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black uppercase text-slate-400">Sumber:</span>
                  <a href={website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600">
                    <Globe size={10} className="text-slate-400" />
                    <span>{website.replace(/https?:\/\//, "")}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* SCHEMA MARKUPS CARD */}
            <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex flex-col gap-4">
              <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">Salin Kode Schema Markup</h3>
              <div className="flex gap-2 bg-slate-50 p-1 rounded-xl">
                <button
                  onClick={() => setSchemaTab("org")}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                    schemaTab === "org" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                  }`}
                >
                  Organization
                </button>
                <button
                  onClick={() => setSchemaTab("faq")}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                    schemaTab === "faq" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                  }`}
                >
                  FAQ Page
                </button>
              </div>

              <div className="relative">
                <pre className="p-3 bg-slate-950 text-emerald-400 font-mono text-[9px] overflow-x-auto rounded-2xl max-h-[200px] leading-relaxed border border-slate-900">
                  {JSON.stringify(schemaTab === "org" ? result.organization_schema : result.faq_schema, null, 2)}
                </pre>
                <button
                  onClick={() => handleCopy(JSON.stringify(schemaTab === "org" ? result.organization_schema : result.faq_schema, null, 2))}
                  className="absolute right-3 top-3 bg-slate-800 text-white p-2 rounded-xl border border-slate-700 active:scale-95 transition-transform"
                >
                  <Copy size={12} />
                </button>
              </div>
            </div>

            {/* AUDIT CHECKLIST */}
            <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100">
              <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-500" />
                GEO Checklist (AI-Readiness)
              </h3>
              <div className="flex flex-col gap-3">
                {result.audit_checklist.map((item, index) => {
                  const isChecked = checkedTasks[index] || false
                  return (
                    <div
                      key={index}
                      onClick={() => toggleCheck(index)}
                      className={`p-3.5 rounded-[1.5rem] border transition-all flex gap-3 ${
                        isChecked ? "bg-emerald-50/30 border-emerald-200" : "bg-slate-50/50 border-slate-100"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${isChecked ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-350"}`}>
                        {isChecked && <Check size={12} strokeWidth={3} />}
                      </div>
                      <div>
                        <h4 className={`text-[11px] font-extrabold ${isChecked ? "text-emerald-700 line-through" : "text-slate-700"}`}>
                          {item.task}
                        </h4>
                        <p className="text-[10px] font-medium text-slate-450 mt-1 leading-relaxed">
                          {item.action}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* BRAND STRATEGY */}
            <div className="bg-amber-55 text-amber-900 border border-amber-100 p-5 rounded-[2rem] flex flex-col gap-2">
              <h4 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen size={14} className="text-amber-700" />
                Strategi SEO Generatif
              </h4>
              <p className="text-[10px] font-semibold leading-relaxed opacity-90">
                {result.brand_strategy}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 mx-4 mt-6 bg-white rounded-[2rem] border border-dashed border-slate-200 p-6">
            <Sparkles size={36} className="mx-auto mb-3 text-slate-300" />
            <h3 className="text-sm font-extrabold text-slate-300 uppercase mb-1">Optimasi Google AI</h3>
            <p className="text-xs font-bold text-slate-450 max-w-[200px] mx-auto leading-relaxed">Masukkan profil brand Anda untuk membuat markup Schema & checklist optimasi GEO.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MobileAIOptimizationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-orange-600" />
      </div>
    }>
      <MobileAIOptimizationPageContent />
    </Suspense>
  )
}
