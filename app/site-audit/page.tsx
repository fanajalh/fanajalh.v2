"use client"

import { useState, Suspense } from "react"
import { Globe, Loader2, AlertCircle, Sparkles, TrendingUp, Search, Shield, Smartphone, FileText, ChevronDown, ChevronUp, ExternalLink, ArrowRight, AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import EcosystemNav from "@/components/sections/EcosystemNav"
import Swal from "sweetalert2"
import { useEcosystemAccess } from "@/lib/ecosystem-access-hook"

interface ScoreCategory {
  score: number
  max: number
  label: string
  details: string[]
}

interface DetectedKeyword {
  keyword: string
  density: string
  potential: string
}

interface Recommendation {
  priority: string
  category: string
  title: string
  description: string
}

interface AuditResult {
  overall_score: number
  grade: string
  site_title: string
  meta_description: string
  scores: {
    seo_onpage: ScoreCategory
    geo_readiness: ScoreCategory
    content_quality: ScoreCategory
    technical_seo: ScoreCategory
    mobile_ux: ScoreCategory
  }
  detected_keywords: DetectedKeyword[]
  schema_detected: string[]
  critical_issues: string[]
  recommendations: Recommendation[]
  summary: string
}

function getGradeColor(grade: string) {
  if (grade.startsWith("A")) return "text-emerald-500"
  if (grade.startsWith("B")) return "text-sky-500"
  if (grade.startsWith("C")) return "text-amber-500"
  if (grade.startsWith("D")) return "text-orange-500"
  return "text-rose-500"
}

function getScoreBarColor(score: number) {
  if (score >= 80) return "bg-emerald-500"
  if (score >= 60) return "bg-sky-500"
  if (score >= 40) return "bg-amber-500"
  if (score >= 20) return "bg-orange-500"
  return "bg-rose-500"
}

function getScoreRingColor(score: number) {
  if (score >= 80) return "stroke-emerald-500"
  if (score >= 60) return "stroke-sky-500"
  if (score >= 40) return "stroke-amber-500"
  if (score >= 20) return "stroke-orange-500"
  return "stroke-rose-500"
}

function getPriorityBadge(priority: string) {
  switch (priority) {
    case "high": return "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-700"
    case "medium": return "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700"
    case "low": return "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700"
    default: return "bg-gray-100 text-gray-700 border-gray-300"
  }
}

const SCORE_ICONS: Record<string, any> = {
  seo_onpage: Search,
  geo_readiness: Sparkles,
  content_quality: FileText,
  technical_seo: Shield,
  mobile_ux: Smartphone,
}

function ScoreRing({ score, size = 160 }: { score: number; size?: number }) {
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-800"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${getScoreRingColor(score)} transition-all duration-1000 ease-out`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black text-black dark:text-white">{score}</span>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">/ 100</span>
      </div>
    </div>
  )
}

function SiteAuditPageContent() {
  const { loading: accessLoading, allowed, SelectorModal } = useEcosystemAccess("site_audit")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<AuditResult | null>(null)
  const [auditUrl, setAuditUrl] = useState("")
  const [expandedScores, setExpandedScores] = useState<Record<string, boolean>>({})

  const handleAudit = async () => {
    if (!url.trim()) {
      Swal.fire({ icon: "warning", text: "URL website wajib diisi!" })
      return
    }
    setLoading(true)
    setError("")
    setResult(null)
    setAuditUrl(url)

    try {
      const res = await fetch("/api/site-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      })
      const data = await res.json()
      if (data.success) {
        setResult(data.audit)
      } else {
        setError(data.message || "Gagal mengaudit website")
      }
    } catch {
      setError("Gagal menghubungi server")
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (key: string) => {
    setExpandedScores(prev => ({ ...prev, [key]: !prev[key] }))
  }

  if (accessLoading || !allowed) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-black dark:text-white" />
      </div>
    )
  }
  if (SelectorModal) return SelectorModal

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <EcosystemNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 border-l-8 border-black dark:border-white pl-4">
          <h2 className="text-3xl font-black text-black dark:text-white uppercase tracking-widest">Website Audit & Score</h2>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
            Input URL → Analisis otomatis SEO, GEO, Keyword, & Ranking Score
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10 bg-white dark:bg-white/5 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
          <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">Masukkan URL Website yang Ingin Diaudit</label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAudit()}
                placeholder="cth. https://fanajah.com atau fanajah.com"
                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>
            <button
              onClick={handleAudit}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-sm border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <TrendingUp size={18} />}
              {loading ? "Scanning..." : "Audit Sekarang"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 flex items-center gap-3 text-red-700 dark:text-red-400">
            <AlertCircle size={20} />
            <span className="font-bold text-sm">{error}</span>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="text-center py-32 bg-white dark:bg-white/5 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
            <Loader2 size={56} className="mx-auto mb-4 text-emerald-500 animate-spin" />
            <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-widest mb-2">Mengaudit Website...</h3>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest max-w-md mx-auto">AI sedang memuat & menganalisis HTML, Schema Markup, SEO On-Page, GEO Readiness, dan struktur konten dari <span className="text-black dark:text-white">{auditUrl}</span></p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-8">
            {/* 1. OVERALL SCORE HERO */}
            <div className="bg-white dark:bg-white/5 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Score Ring */}
                <div className="flex flex-col items-center gap-3">
                  <ScoreRing score={result.overall_score} />
                  <span className={`text-4xl font-black ${getGradeColor(result.grade)}`}>{result.grade}</span>
                </div>

                {/* Site Info */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-wider mb-1">{result.site_title || auditUrl}</h3>
                  <a href={auditUrl.startsWith("http") ? auditUrl : `https://${auditUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-4">
                    <Globe size={12} />
                    {auditUrl}
                    <ExternalLink size={10} />
                  </a>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl">
                    {result.summary}
                  </p>

                  {/* Schema Badges */}
                  {result.schema_detected && result.schema_detected.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mr-1">Schema Terdeteksi:</span>
                      {result.schema_detected.map((s, i) => (
                        <span key={i} className="px-2 py-1 text-[9px] font-black uppercase tracking-wider border-2 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400">{s}</span>
                      ))}
                    </div>
                  )}
                  {result.schema_detected && result.schema_detected.length === 0 && (
                    <div className="flex items-center gap-2 mt-4 text-rose-500">
                      <XCircle size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Tidak ada Schema Markup terdeteksi</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 2. SCORE BREAKDOWN CARDS */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.entries(result.scores).map(([key, cat]) => {
                const Icon = SCORE_ICONS[key] || Search
                const isExpanded = expandedScores[key] || false
                return (
                  <div key={key} className="bg-white dark:bg-white/5 border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                    <div className="p-4 cursor-pointer" onClick={() => toggleExpand(key)}>
                      <div className="flex items-center justify-between mb-3">
                        <Icon size={18} className="text-gray-400" />
                        <span className={`text-2xl font-black ${cat.score >= 70 ? "text-emerald-500" : cat.score >= 40 ? "text-amber-500" : "text-rose-500"}`}>{cat.score}</span>
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2">{cat.label}</h4>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-800">
                        <div className={`h-full ${getScoreBarColor(cat.score)} transition-all duration-700`} style={{ width: `${cat.score}%` }} />
                      </div>
                      <div className="flex justify-end mt-2">
                        {isExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="border-t-2 border-black dark:border-white p-4 bg-gray-50 dark:bg-black/40 space-y-2">
                        {cat.details.map((d, i) => (
                          <p key={i} className="text-[11px] font-semibold text-gray-600 dark:text-gray-400 leading-relaxed">{d}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* 3. CRITICAL ISSUES */}
            {result.critical_issues && result.critical_issues.length > 0 && (
              <div className="bg-rose-50 dark:bg-rose-950/20 border-4 border-rose-500 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <h3 className="text-lg font-black uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-4 flex items-center gap-2">
                  <AlertTriangle /> Masalah Kritis
                </h3>
                <div className="space-y-3">
                  {result.critical_issues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <XCircle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-xs font-bold text-rose-800 dark:text-rose-300 leading-relaxed">{issue}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. DETECTED KEYWORDS */}
            {result.detected_keywords && result.detected_keywords.length > 0 && (
              <div className="bg-white dark:bg-white/5 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
                <h3 className="text-lg font-black uppercase tracking-wider text-black dark:text-white mb-4 flex items-center gap-2">
                  <Search size={20} /> Kata Kunci Terdeteksi
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-4 border-black dark:border-white">
                        <th className="text-left p-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Keyword</th>
                        <th className="text-left p-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Density</th>
                        <th className="text-left p-3 text-[10px] font-black uppercase tracking-widest text-gray-500">Potensi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.detected_keywords.map((kw, i) => (
                        <tr key={i} className="border-b border-gray-200 dark:border-white/10">
                          <td className="p-3 font-black text-black dark:text-white">{kw.keyword}</td>
                          <td className="p-3 font-bold text-gray-500">{kw.density}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-wider border-2 ${
                              kw.potential === "tinggi" ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" :
                              kw.potential === "sedang" ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400" :
                              "border-gray-400 bg-gray-50 text-gray-600 dark:bg-gray-900 dark:text-gray-400"
                            }`}>
                              {kw.potential}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 5. RECOMMENDATIONS */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="bg-white dark:bg-white/5 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
                <h3 className="text-lg font-black uppercase tracking-wider text-black dark:text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-500" /> Rekomendasi Perbaikan
                </h3>
                <div className="space-y-4">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="p-4 border-2 border-black dark:border-white bg-gray-50 dark:bg-black/40 flex items-start gap-4">
                      <div className="flex flex-col gap-2 shrink-0">
                        <span className={`px-2 py-1 text-[8px] font-black uppercase tracking-wider border-2 text-center ${getPriorityBadge(rec.priority)}`}>
                          {rec.priority === "high" ? "PRIORITAS" : rec.priority === "medium" ? "SEDANG" : "RENDAH"}
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-400 text-center">{rec.category}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-black dark:text-white">{rec.title}</h4>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{rec.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && !error && (
          <div className="text-center py-32 bg-white dark:bg-white/5 border-4 border-dashed border-gray-300 dark:border-gray-700">
            <Globe size={56} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-xl font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest mb-2">Audit Website</h3>
            <p className="text-sm font-bold text-gray-400 dark:text-gray-500 max-w-md mx-auto">
              Masukkan URL website di atas. AI akan menganalisis SEO, GEO, kata kunci, dan ranking score secara otomatis.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default function SiteAuditPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-black dark:text-white" />
      </div>
    }>
      <SiteAuditPageContent />
    </Suspense>
  )
}
