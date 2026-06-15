"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Wrench, FileText, Search, Loader2, Sparkles, Copy, Check, Trash2, Layout, BookOpen, MessageSquare, Plus, ExternalLink } from "lucide-react"
import EcosystemNav from "@/components/sections/EcosystemNav"
import Swal from "sweetalert2"
import { useEcosystemAccess } from "@/lib/ecosystem-access-hook"

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

function SEOToolsPageContent() {
  const { loading: accessLoading, allowed, SelectorModal } = useEcosystemAccess("seo")
  const searchParams = useSearchParams()
  const router = useRouter()

  // Form states
  const [businessName, setBusinessName] = useState("")
  const [product, setProduct] = useState("")
  const [keywordsInput, setKeywordsInput] = useState("")
  const [contactId, setContactId] = useState<string>("")

  // Content state
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

  // Load params from URL if redirecting from Keywords page
  useEffect(() => {
    if (!searchParams) return
    const busParam = searchParams.get("business")
    const kwsParam = searchParams.get("keywords")
    const conParam = searchParams.get("contact")

    if (busParam) setBusinessName(busParam)
    if (kwsParam) setKeywordsInput(kwsParam.split(",").join(", "))
    if (conParam) setContactId(conParam)
  }, [searchParams])

  // Fetch past SEO projects
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
      Swal.fire({ icon: "warning", text: "Nama bisnis dan kata kunci wajib diisi!" })
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
        Swal.fire({ icon: "success", text: "Konten SEO berhasil digenerate dan disimpan ke database!", timer: 2000, showConfirmButton: false })
        fetchProjects() // Refresh projects history
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

    Swal.fire({ icon: "success", text: "Project berhasil dimuat!", timer: 1000, showConfirmButton: false })
  }

  const handleDeleteProject = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    const confirm = await Swal.fire({
      title: "Hapus Project?",
      text: "Data project SEO akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Hapus!"
    })
    if (!confirm.isConfirmed) return

    try {
      const res = await fetch(`/api/seo/projects?id=${id}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        Swal.fire({ icon: "success", text: "Project dihapus!", timer: 1500, showConfirmButton: false })
        fetchProjects()
        // If current viewing project was deleted, clear current result
        setSeoResult(null)
      }
    } catch {
      Swal.fire({ icon: "error", text: "Gagal menghapus project" })
    }
  }

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
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
            <div className="mb-8 border-l-8 border-black dark:border-white pl-4">
              <h2 className="text-3xl font-black text-black dark:text-white uppercase tracking-widest">SEO Tools</h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Generate meta tags, blog artikel, dan FAQ schema secara otomatis</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

          {/* Left panel: Input Form */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-white/5 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] space-y-4">
              <h3 className="text-lg font-black uppercase tracking-widest text-black dark:text-white flex items-center gap-2">
                <Sparkles size={18} /> SEO Generator
              </h3>
              
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Nama Bisnis *</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="cth. Cafe Lestari"
                  className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Produk Utama / Layanan</label>
                <input
                  type="text"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="cth. Kopi khas nusantara dan pastry premium"
                  className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Kata Kunci Target (Koma Dipisahkan) *</label>
                <textarea
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  placeholder="cafe terdekat, kopi nikmat jakarta, cafe instagramable"
                  rows={3}
                  className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-xs font-bold focus:outline-none"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-sm border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Wrench size={18} />}
                {loading ? "Menulis Konten..." : "Tulis Konten SEO"}
              </button>
            </div>

            {/* History SEO Projects */}
            <div className="bg-white dark:bg-white/5 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-sm font-black uppercase tracking-widest text-black dark:text-white mb-4">Project SEO Tersimpan</h3>
              
              {loadingProjects ? (
                <div className="py-8 text-center"><Loader2 size={24} className="animate-spin text-gray-400 mx-auto" /></div>
              ) : projects.length === 0 ? (
                <p className="text-xs font-bold text-gray-400 text-center py-6">Belum ada project SEO yang disimpan.</p>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {projects.map(p => (
                    <div
                      key={p.id}
                      onClick={() => handleLoadProject(p)}
                      className="group p-3 border-2 border-black dark:border-white/10 hover:border-black dark:hover:border-white bg-gray-50 dark:bg-black cursor-pointer transition-colors flex justify-between items-center"
                    >
                      <div className="min-w-0">
                        <p className="font-black text-xs text-black dark:text-white uppercase truncate">{p.business_name}</p>
                        <p className="text-[9px] font-bold text-gray-400 mt-1 uppercase truncate">{p.product || "Umum"}</p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteProject(p.id, e)}
                        className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-all border-2 border-transparent hover:border-red-500"
                        title="Hapus project"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right panel: Content Tabs and Display */}
          <div className="lg:col-span-2">
            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 flex items-center gap-3 text-red-700 dark:text-red-400">
                <Search size={20} />
                <span className="font-bold text-sm">{error}</span>
              </div>
            )}

            {loading ? (
              <div className="text-center py-32 bg-white dark:bg-white/5 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <Loader2 size={48} className="mx-auto mb-4 text-gray-400 animate-spin" />
                <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-widest mb-2">AI Sedang Menulis...</h3>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Menyusun artikel SEO, meta tags, dan schema FAQPage</p>
                <div className="mt-6 flex justify-center gap-2">
                  <span className="w-3 h-3 bg-black dark:bg-white animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-3 h-3 bg-black dark:bg-white animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-3 h-3 bg-black dark:bg-white animate-bounce"></span>
                </div>
              </div>
            ) : seoResult ? (
              <div className="space-y-6">
                {/* Custom Tabs */}
                <div className="flex border-b-4 border-black dark:border-white overflow-x-auto no-scrollbar">
                  {[
                    { id: "meta", label: "Meta Tags", icon: Layout },
                    { id: "article", label: "Artikel Blog SEO", icon: BookOpen },
                    { id: "faq", label: "FAQ Schema (JSON-LD)", icon: MessageSquare },
                  ].map((tab) => {
                    const Icon = tab.icon
                    const isSelected = activeTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest whitespace-nowrap border-t-2 border-x-2 border-transparent transition-all -mb-[4px] ${
                          isSelected
                            ? "bg-white dark:bg-white/5 text-black dark:text-white border-black dark:border-white border-b-4 border-b-white dark:border-b-black"
                            : "text-gray-400 hover:text-black dark:hover:text-white"
                        }`}
                      >
                        <Icon size={14} />
                        {tab.label}
                      </button>
                    )
                  })}
                </div>

                {/* Tab content wrapper */}
                <div className="bg-white dark:bg-white/5 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
                  
                  {/* TAB 1: META TAGS */}
                  {activeTab === "meta" && (
                    <div className="space-y-6">
                      {/* Search Snippet Preview */}
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Google Search Snippet Preview</h4>
                        <div className="bg-white dark:bg-zinc-900 border-2 border-black p-4 font-sans max-w-xl">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate mb-1">
                            <span>https://{businessName.toLowerCase().replace(/\s+/g, '') || 'website'}.com</span>
                            <span className="text-[8px]">&#9660;</span>
                          </div>
                          <h3 className="text-xl text-blue-800 dark:text-blue-400 hover:underline cursor-pointer font-medium leading-tight mb-1">
                            {seoResult.meta_title || "Judul Halaman Pencarian Google"}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-normal line-clamp-2">
                            {seoResult.meta_description || "Deskripsi ringkasan halaman yang persuasif dan mengandung kata kunci target."}
                          </p>
                        </div>
                      </div>

                      <hr className="border-t-2 border-black dark:border-white/10" />

                      {/* Copy Fields */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Meta Title ({seoResult.meta_title.length} chars)</span>
                            <button
                              onClick={() => copyToClipboard(seoResult.meta_title, "title")}
                              className="text-xs font-black uppercase tracking-widest flex items-center gap-1 text-gray-500 hover:text-black dark:hover:text-white"
                            >
                              {copiedField === "title" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                              {copiedField === "title" ? "Tersalin" : "Salin"}
                            </button>
                          </div>
                          <input
                            type="text"
                            readOnly
                            value={seoResult.meta_title}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-black border-2 border-black dark:border-white/20 text-sm font-bold text-black dark:text-white"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Meta Description ({seoResult.meta_description.length} chars)</span>
                            <button
                              onClick={() => copyToClipboard(seoResult.meta_description, "desc")}
                              className="text-xs font-black uppercase tracking-widest flex items-center gap-1 text-gray-500 hover:text-black dark:hover:text-white"
                            >
                              {copiedField === "desc" ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                              {copiedField === "desc" ? "Tersalin" : "Salin"}
                            </button>
                          </div>
                          <textarea
                            readOnly
                            value={seoResult.meta_description}
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-black border-2 border-black dark:border-white/20 text-xs font-bold text-black dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: BLOG ARTICLE */}
                  {activeTab === "article" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b-2 border-black dark:border-white/10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">HTML Content</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyToClipboard(seoResult.blog_article || "", "article")}
                            className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black border-2 border-black hover:translate-y-0.5 transition-transform"
                          >
                            {copiedField === "article" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copiedField === "article" ? "Tersalin" : "Salin HTML"}
                          </button>
                        </div>
                      </div>

                      {/* Rendered HTML article preview */}
                      <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed overflow-y-auto max-h-[500px] border-2 border-gray-100 dark:border-white/10 p-6 bg-white dark:bg-black font-sans">
                        <div dangerouslySetInnerHTML={{ __html: seoResult.blog_article || "" }} />
                      </div>
                    </div>
                  )}

                  {/* TAB 3: FAQ SCHEMA */}
                  {activeTab === "faq" && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b-2 border-black dark:border-white/10">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">JSON-LD FAQ Schema</span>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(seoResult.faq_schema, null, 2) || "", "faq")}
                          className="text-xs font-black uppercase tracking-widest flex items-center gap-1.5 px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black border-2 border-black hover:translate-y-0.5 transition-transform"
                        >
                          {copiedField === "faq" ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          {copiedField === "faq" ? "Tersalin" : "Salin Schema"}
                        </button>
                      </div>

                      <pre className="bg-gray-900 text-green-400 p-4 border-2 border-black text-xs font-mono overflow-auto max-h-[400px]">
                        {JSON.stringify(seoResult.faq_schema, null, 2)}
                      </pre>
                    </div>
                  )}

                </div>
              </div>
            ) : (
              <div className="text-center py-32 bg-white dark:bg-white/5 border-4 border-dashed border-gray-300 dark:border-gray-700">
                <Wrench size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest mb-2">Tulis Konten SEO Baru</h3>
                <p className="text-sm font-bold text-gray-400 dark:text-gray-500">Masukkan nama bisnis dan kata kunci target di panel kiri untuk mulai menulis konten SEO.</p>
              </div>
            )}
          </div>
        </div>
          </>
        )}
      </main>
    </div>
  )
}

export default function SEOToolsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-black dark:text-white" />
      </div>
    }>
      <SEOToolsPageContent />
    </Suspense>
  )
}
