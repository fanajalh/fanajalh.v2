"use client"

import { useState, Suspense } from "react"
import { Globe, Loader2, AlertCircle, Sparkles, TrendingUp, Search, Shield, Smartphone, FileText, ChevronDown, ChevronUp, ExternalLink, AlertTriangle, CheckCircle2, XCircle, ChevronLeft } from "lucide-react"
import Link from "next/link"
import EcosystemMobileNav from "@/components/sections/EcosystemMobileNav"
import Swal from "@/lib/custom-alert"
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
  if (grade.startsWith("A")) return "text-emerald-600"
  if (grade.startsWith("B")) return "text-sky-600"
  if (grade.startsWith("C")) return "text-amber-600"
  if (grade.startsWith("D")) return "text-orange-600"
  return "text-rose-600"
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

const SCORE_ICONS: Record<string, any> = {
  seo_onpage: Search,
  geo_readiness: Sparkles,
  content_quality: FileText,
  technical_seo: Shield,
  mobile_ux: Smartphone,
}

function MobileScoreRing({ score }: { score: number }) {
  const size = 120
  const strokeWidth = 8
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${getScoreRingColor(score)} transition-all duration-1000`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-slate-800">{score}</span>
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">/ 100</span>
      </div>
    </div>
  )
}

function MobileSiteAuditPageContent() {
  const { loading: accessLoading, allowed, SelectorModal } = useEcosystemAccess("site_audit")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<AuditResult | null>(null)
  const [auditUrl, setAuditUrl] = useState("")
  const [expandedScores, setExpandedScores] = useState<Record<string, boolean>>({})

  const handleAudit = async () => {
    if (!url.trim()) {
      Swal.fire({ icon: "warning", text: "URL website wajib diisi!", confirmButtonColor: "#ea580c" })
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
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-orange-600" />
      </div>
    )
  }
  if (SelectorModal) return SelectorModal

  return (
    <div className="bg-[#f4f6f9] min-h-screen pb-24 font-sans select-none w-full flex flex-col items-center">
      <div className="w-full max-w-md bg-[#f4f6f9] min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-orange-600 pt-12 pb-6 px-4 rounded-b-[2rem] shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Link href="/home" className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors active:scale-95">
              <ChevronLeft size={24} strokeWidth={2.5} />
            </Link>
            <div className="flex-1">
              <h1 className="text-white text-lg font-extrabold tracking-tight">Website Audit</h1>
              <p className="text-orange-100 text-xs font-medium">Skor SEO, GEO, Keyword & Ranking</p>
            </div>
          </div>
        </div>

        <EcosystemMobileNav />

        {/* Search Form */}
        <div className="px-4 mt-6">
          <div className="bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col gap-4">
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Masukkan URL Website</label>
            <div className="relative">
              <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAudit()}
                placeholder="cth. fanajah.com"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <button
              onClick={handleAudit}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-colors active:scale-95 outline-none flex items-center justify-center gap-1.5 shadow-sm shadow-orange-600/30 disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <TrendingUp size={16} />}
              {loading ? "Scanning..." : "Audit Sekarang"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-3 text-red-700">
            <AlertCircle size={20} className="shrink-0" />
            <span className="font-semibold text-xs leading-relaxed">{error}</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-20 mx-4 mt-6 bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
            <Loader2 size={40} className="mx-auto mb-3 text-orange-500 animate-spin" />
            <h3 className="text-sm font-extrabold text-slate-800 uppercase mb-1">Mengaudit Website</h3>
            <p className="text-xs font-semibold text-slate-400 max-w-[220px] mx-auto leading-relaxed">AI sedang menganalisis SEO, GEO, Keyword & Ranking dari website Anda.</p>
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="px-4 mt-6 flex flex-col gap-5">
            {/* Overall Score Card */}
            <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 flex flex-col items-center gap-4">
              <MobileScoreRing score={result.overall_score} />
              <span className={`text-3xl font-black ${getGradeColor(result.grade)}`}>{result.grade}</span>
              <h3 className="font-extrabold text-sm text-slate-800 text-center">{result.site_title || auditUrl}</h3>
              <a href={auditUrl.startsWith("http") ? auditUrl : `https://${auditUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400">
                <Globe size={10} /> {auditUrl} <ExternalLink size={8} />
              </a>
              <p className="text-[11px] font-semibold text-slate-500 leading-relaxed text-center">{result.summary}</p>

              {/* Schema badges */}
              {result.schema_detected && result.schema_detected.length > 0 && (
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {result.schema_detected.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 text-[8px] font-black uppercase tracking-wider border border-emerald-300 bg-emerald-50 text-emerald-700 rounded-lg">{s}</span>
                  ))}
                </div>
              )}
              {result.schema_detected && result.schema_detected.length === 0 && (
                <div className="flex items-center gap-1.5 text-rose-500">
                  <XCircle size={12} />
                  <span className="text-[9px] font-extrabold uppercase tracking-wider">Tidak ada Schema Markup</span>
                </div>
              )}
            </div>

            {/* Score Breakdown Cards */}
            {Object.entries(result.scores).map(([key, cat]) => {
              const Icon = SCORE_ICONS[key] || Search
              const isExpanded = expandedScores[key] || false
              return (
                <div key={key} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-4 flex items-center gap-3 cursor-pointer" onClick={() => toggleExpand(key)}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cat.score >= 70 ? "bg-emerald-50 text-emerald-600" : cat.score >= 40 ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[11px] font-extrabold text-slate-700">{cat.label}</h4>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full mt-1.5">
                        <div className={`h-full rounded-full ${getScoreBarColor(cat.score)} transition-all duration-700`} style={{ width: `${cat.score}%` }} />
                      </div>
                    </div>
                    <span className={`text-xl font-black ${cat.score >= 70 ? "text-emerald-600" : cat.score >= 40 ? "text-amber-600" : "text-rose-600"}`}>{cat.score}</span>
                    {isExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
                  </div>
                  {isExpanded && (
                    <div className="border-t border-slate-100 p-4 bg-slate-50/50 space-y-2">
                      {cat.details.map((d, i) => (
                        <p key={i} className="text-[10px] font-semibold text-slate-600 leading-relaxed">{d}</p>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Critical Issues */}
            {result.critical_issues && result.critical_issues.length > 0 && (
              <div className="bg-rose-50 rounded-[2rem] p-5 border border-rose-100">
                <h3 className="font-extrabold text-xs text-rose-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <AlertTriangle size={14} /> Masalah Kritis
                </h3>
                <div className="space-y-2.5">
                  {result.critical_issues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <XCircle size={12} className="text-rose-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] font-bold text-rose-800 leading-relaxed">{issue}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detected Keywords */}
            {result.detected_keywords && result.detected_keywords.length > 0 && (
              <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100">
                <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Search size={14} className="text-orange-500" /> Keyword Terdeteksi
                </h3>
                <div className="flex flex-col gap-2.5">
                  {result.detected_keywords.map((kw, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div>
                        <span className="text-[11px] font-extrabold text-slate-700">{kw.keyword}</span>
                        <span className="text-[9px] font-bold text-slate-400 ml-2">({kw.density})</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase border ${
                        kw.potential === "tinggi" ? "border-emerald-200 bg-emerald-50 text-emerald-600" :
                        kw.potential === "sedang" ? "border-amber-200 bg-amber-50 text-amber-600" :
                        "border-slate-200 bg-slate-50 text-slate-500"
                      }`}>
                        {kw.potential}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations && result.recommendations.length > 0 && (
              <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100">
                <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-500" /> Rekomendasi
                </h3>
                <div className="flex flex-col gap-3">
                  {result.recommendations.map((rec, i) => (
                    <div key={i} className="p-3.5 rounded-[1.5rem] bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`px-2 py-0.5 text-[7px] font-black uppercase tracking-wider rounded-md border ${
                          rec.priority === "high" ? "border-rose-200 bg-rose-50 text-rose-600" :
                          rec.priority === "medium" ? "border-amber-200 bg-amber-50 text-amber-600" :
                          "border-emerald-200 bg-emerald-50 text-emerald-600"
                        }`}>
                          {rec.priority === "high" ? "PRIORITAS" : rec.priority === "medium" ? "SEDANG" : "RENDAH"}
                        </span>
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{rec.category}</span>
                      </div>
                      <h4 className="text-[11px] font-extrabold text-slate-700">{rec.title}</h4>
                      <p className="text-[10px] font-medium text-slate-450 mt-1 leading-relaxed">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!result && !loading && !error && (
          <div className="text-center py-16 mx-4 mt-6 bg-white rounded-[2rem] border border-dashed border-slate-200 p-6">
            <Globe size={36} className="mx-auto mb-3 text-slate-300" />
            <h3 className="text-sm font-extrabold text-slate-300 uppercase mb-1">Website Audit</h3>
            <p className="text-xs font-bold text-slate-450 max-w-[200px] mx-auto leading-relaxed">Input URL website di atas untuk menganalisis skor SEO, GEO & Keyword secara otomatis.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function MobileSiteAuditPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-orange-600" />
      </div>
    }>
      <MobileSiteAuditPageContent />
    </Suspense>
  )
}
