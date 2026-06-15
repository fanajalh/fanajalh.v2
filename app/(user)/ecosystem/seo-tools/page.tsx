"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Wrench, FileText, Search, Loader2, Sparkles, Copy, Check, Trash2, Layout, BookOpen, MessageSquare, ChevronLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import Swal from "@/lib/custom-alert"
import { useEcosystemAccess } from "@/lib/ecosystem-access-hook"
import EcosystemMobileNav from "@/components/sections/EcosystemMobileNav"

interface SEOProject {
  id: number
  contact_id: number | null
  business_name: string
  website: string | null
  product: string | null
  meta_title: string | null
  meta_description: string | null
  blog_article: string | null
  faq_schema: string | null
  status: string
  created_at: string
  contact_name?: string
}

function MobileSEOToolsPageContent() {
  const { loading: accessLoading, allowed, SelectorModal } = useEcosystemAccess("seo")
  const searchParams = useSearchParams()
  const router = useRouter()

  const [businessName, setBusinessName] = useState("")
  const [product, setProduct] = useState("")
  const [keywordsInput, setKeywordsInput] = useState("")
  const [contactId, setContactId] = useState<string>("")

  const [activeTab, setActiveTab] = useState<"meta" | "article" | "faq">("meta")
  const [loading, setLoading] = useState(false)
  const [seoResult, setSeoResult] = useState<{
    meta_title: string
    meta_description: string
    blog_article: string
    faq_schema: any
  } | null>(null)
  
  const [error, setError] = useState("")
  const [projects, setProjects] = useState<SEOProject[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    if (!searchParams) return
    const busParam = searchParams.get("business")
    const kwsParam = searchParams.get("keywords")
    const conParam = searchParams.get("contact")

    if (busParam) setBusinessName(busParam)
    if (kwsParam) setKeywordsInput(kwsParam.split(",").join(", "))
    if (conParam) setContactId(conParam)
  }, [searchParams])

  const fetchProjects = async () => {
    setLoadingProjects(true)
    try {
      const res = await fetch("/api/seo/projects")
      const data = await res.json()
      if (data.success) {
        setProjects(data.projects)
      }
    } catch (err) {
      console.error("Gagal mengambil project SEO", err)
    } finally {
      setLoadingProjects(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleGenerate = async () => {
    if (!businessName.trim() || !keywordsInput.trim()) {
      Swal.fire({ icon: "warning", text: "Nama bisnis dan kata kunci wajib diisi!", confirmButtonColor: "#ea580c" })
      return
    }

    setLoading(true)
    setError("")
    setSeoResult(null)

    try {
      const res = await fetch("/api/seo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          product,
          keywords: keywordsInput.split(",").map(k => k.trim()),
          contact_id: contactId ? parseInt(contactId) : null
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSeoResult(data.seoContent)
        Swal.fire({ icon: "success", text: "Konten SEO berhasil digenerate dan disimpan!", timer: 2000, showConfirmButton: false })
        fetchProjects()
      } else {
        setError(data.message || "Gagal membuat konten SEO")
      }
    } catch {
      setError("Gagal menghubungi AI Writer")
    } finally {
      setLoading(false)
    }
  }

  const handleLoadProject = (proj: SEOProject) => {
    setBusinessName(proj.business_name)
    setProduct(proj.product || "")
    setContactId(proj.contact_id ? proj.contact_id.toString() : "")
    
    let parsedFaq = null
    try {
      parsedFaq = proj.faq_schema ? JSON.parse(proj.faq_schema) : null
    } catch {
      parsedFaq = proj.faq_schema
    }

    setSeoResult({
      meta_title: proj.meta_title || "",
      meta_description: proj.meta_description || "",
      blog_article: proj.blog_article || "",
      faq_schema: parsedFaq
    })

    Swal.fire({ icon: "success", text: "Project dimuat!", timer: 1000, showConfirmButton: false })
  }

  const handleDeleteProject = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const confirm = await Swal.fire({
      title: "Hapus Project?",
      text: "Data project SEO akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!",
      confirmButtonColor: "#ea580c",
      cancelButtonColor: "#64748b"
    })
    if (!confirm.isConfirmed) return

    try {
      const res = await fetch(`/api/seo/projects?id=${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        Swal.fire({ icon: "success", text: "Project dihapus!", timer: 1500, showConfirmButton: false })
        fetchProjects()
        setSeoResult(null)
      }
    } catch {
      Swal.fire({ icon: "error", text: "Gagal menghapus project", confirmButtonColor: "#ea580c" })
    }
  }

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
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
              <h1 className="text-white text-lg font-extrabold tracking-tight">SEO Writer</h1>
              <p className="text-orange-100 text-xs font-medium">Buat Artikel & Meta Tags AI</p>
            </div>
          </div>
        </div>

        {/* 2. PROGRESSION TABS SUBHEADER */}
        <EcosystemMobileNav />

        {/* 3. MAIN FORM */}
        <div className="px-4 mt-6">
          <div className="bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-orange-500" /> SEO Generator
            </h3>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Nama Bisnis *</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="cth. Cafe Lestari"
                className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Deskripsi Produk/Layanan</label>
              <input
                type="text"
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                placeholder="cth. Kopi susu specialty dan cake"
                className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Kata Kunci Target (pisahkan koma) *</label>
              <textarea
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="cafe terdekat, kopi enak bandung"
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-xs font-semibold outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-colors active:scale-95 outline-none flex items-center justify-center gap-1.5 shadow-sm shadow-orange-600/30 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Wrench size={16} />}
              {loading ? "Menulis Artikel..." : "Tulis Konten SEO"}
            </button>
          </div>
        </div>

        {/* 4. HISTORY SEO PROJECTS */}
        {projects.length > 0 && (
          <div className="px-4 mt-6">
            <div className="bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100">
              <h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-3 pl-1">Project SEO Tersimpan</h3>
              <div className="flex gap-2.5 overflow-x-auto snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-1">
                {projects.map(p => (
                  <div
                    key={p.id}
                    onClick={() => handleLoadProject(p)}
                    className="snap-center p-3 rounded-2xl bg-slate-50 border border-slate-200/60 hover:bg-slate-100 cursor-pointer transition-all flex items-center gap-3 shrink-0 max-w-[200px]"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-extrabold text-xs text-slate-850 truncate">{p.business_name}</p>
                      <p className="text-[9px] font-bold text-slate-400 mt-0.5 truncate">{p.product || "Umum"}</p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteProject(p.id, e)}
                      className="p-1 rounded-full text-slate-450 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. ERROR DISPLAY */}
        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-650">
            <AlertCircle size={20} className="shrink-0" />
            <span className="font-semibold text-xs leading-relaxed">{error}</span>
          </div>
        )}

        {/* 6. CONTENT RESULT */}
        <div className="px-4 mt-6 flex-grow">
          {loading ? (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
              <Loader2 size={36} className="mx-auto mb-3 text-orange-500 animate-spin" />
              <h3 className="text-sm font-extrabold text-slate-850 uppercase mb-1">AI Sedang Menulis</h3>
              <p className="text-xs font-semibold text-slate-450 leading-relaxed max-w-[200px] mx-auto">Menyusun meta tags, artikel blog, dan schema FAQPage secara optimal.</p>
            </div>
          ) : seoResult ? (
            <div className="flex flex-col gap-4">
              {/* Tab Selector Buttons */}
              <div className="flex bg-slate-200/60 p-1 rounded-full border border-slate-200">
                {[
                  { id: "meta", label: "Meta Tags", icon: Layout },
                  { id: "article", label: "Artikel Blog", icon: BookOpen },
                  { id: "faq", label: "FAQ Schema", icon: MessageSquare },
                ].map((tab) => {
                  const isSelected = activeTab === tab.id
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all ${
                        isSelected ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"
                      }`}
                    >
                      <Icon size={12} />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>

              {/* Tab Content Cards */}
              <div className="bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 mb-6">
                {/* Meta Tags */}
                {activeTab === "meta" && (
                  <div className="flex flex-col gap-5">
                    <div>
                      <h4 className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Google Snippet Preview</h4>
                      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm font-sans max-w-full">
                        <div className="text-[10px] text-slate-400 truncate mb-1">
                          https://{businessName.toLowerCase().replace(/\s+/g, '') || 'website'}.com
                        </div>
                        <h3 className="text-sm text-blue-700 font-bold leading-tight mb-1 hover:underline cursor-pointer">
                          {seoResult.meta_title}
                        </h3>
                        <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">
                          {seoResult.meta_description}
                        </p>
                      </div>
                    </div>

                    <hr className="border-t border-slate-100" />

                    <div className="flex flex-col gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-1.5 px-0.5">
                          <span className="text-[9px] font-extrabold uppercase text-slate-450">Meta Title ({seoResult.meta_title.length} char)</span>
                          <button
                            onClick={() => copyToClipboard(seoResult.meta_title, "title")}
                            className="text-[10px] font-extrabold uppercase text-orange-600 flex items-center gap-1"
                          >
                            {copiedField === "title" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copiedField === "title" ? "Tersalin" : "Salin"}
                          </button>
                        </div>
                        <input
                          type="text"
                          readOnly
                          value={seoResult.meta_title}
                          className="w-full px-4 py-2.5 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-xl text-xs font-semibold outline-none"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1.5 px-0.5">
                          <span className="text-[9px] font-extrabold uppercase text-slate-450">Meta Description ({seoResult.meta_description.length} char)</span>
                          <button
                            onClick={() => copyToClipboard(seoResult.meta_description, "desc")}
                            className="text-[10px] font-extrabold uppercase text-orange-600 flex items-center gap-1"
                          >
                            {copiedField === "desc" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copiedField === "desc" ? "Tersalin" : "Salin"}
                          </button>
                        </div>
                        <textarea
                          readOnly
                          value={seoResult.meta_description}
                          rows={3}
                          className="w-full px-4 py-2.5 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-xl text-xs font-semibold outline-none leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Article */}
                {activeTab === "article" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                      <span className="text-[9px] font-extrabold uppercase text-slate-400">Pratinjau HTML</span>
                      <button
                        onClick={() => copyToClipboard(seoResult.blog_article, "article")}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-1.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-sm shadow-orange-600/20 active:scale-95 transition-all"
                      >
                        {copiedField === "article" ? <Check size={12} /> : <Copy size={12} />}
                        {copiedField === "article" ? "Tersalin" : "Salin HTML"}
                      </button>
                    </div>

                    <div className="prose max-w-none text-xs leading-relaxed max-h-[300px] overflow-y-auto border border-slate-200/80 rounded-2xl p-4 bg-slate-50 font-sans">
                      <div dangerouslySetInnerHTML={{ __html: seoResult.blog_article }} />
                    </div>
                  </div>
                )}

                {/* FAQ Schema */}
                {activeTab === "faq" && (
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                      <span className="text-[9px] font-extrabold uppercase text-slate-400">JSON-LD FAQ Schema</span>
                      <button
                        onClick={() => copyToClipboard(JSON.stringify(seoResult.faq_schema, null, 2), "faq")}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-1.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-sm shadow-orange-600/20 active:scale-95 transition-all"
                      >
                        {copiedField === "faq" ? <Check size={12} /> : <Copy size={12} />}
                        {copiedField === "faq" ? "Tersalin" : "Salin Schema"}
                      </button>
                    </div>

                    <pre className="bg-slate-900 text-emerald-400 p-4 rounded-2xl text-[10px] font-mono overflow-auto max-h-[280px] leading-relaxed">
                      {JSON.stringify(seoResult.faq_schema, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 mx-4 mt-6 bg-white rounded-[2rem] border border-dashed border-slate-200 p-6 shadow-sm">
              <Wrench size={36} className="mx-auto mb-3 text-slate-300" />
              <h3 className="text-sm font-extrabold text-slate-350 uppercase mb-1">Tulis Konten SEO</h3>
              <p className="text-xs font-bold text-slate-450 max-w-[200px] mx-auto leading-relaxed">Masukkan info bisnis dan keywords di form atas untuk menulis konten SEO otomatis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MobileSEOToolsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-orange-600" />
      </div>
    }>
      <MobileSEOToolsPageContent />
    </Suspense>
  )
}
