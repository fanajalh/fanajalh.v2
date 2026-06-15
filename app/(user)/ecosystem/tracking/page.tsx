"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { BarChart3, Users, Mail, Key, Sparkles, RefreshCw, Loader2, ArrowUp, ArrowDown, Minus, Clock, ChevronRight, ChevronLeft, Search, TrendingUp, Award } from "lucide-react"
import Link from "next/link"
import Swal from "@/lib/custom-alert"
import { useEcosystemAccess } from "@/lib/ecosystem-access-hook"
import EcosystemMobileNav from "@/components/sections/EcosystemMobileNav"

interface Keyword {
  id: number
  keyword: string
  search_volume: number | null
  current_position: number | null
  previous_position: number | null
  traffic_estimate: number | null
  last_checked: string | null
  contact_name?: string
}

interface Campaign {
  id: number
  name: string
  subject: string
  total_recipients: number
  sent_count: number
  open_count: number
  reply_count: number
  sent_at: string
}

interface EventLog {
  id: number
  event_type: string
  reference_id: number | null
  reference_type: string | null
  metadata: any
  created_at: string
}

interface StatsData {
  contacts: {
    total_contacts: string
    leads_found: string
    status_new: string
    status_contacted: string
    status_opened: string
    status_replied: string
    status_deal: string
  }
  generated: {
    campaigns: string
    sent: string
    opened: string
    replied: string
    projects: string
    keywords: string
    generated: string
    published: string
  }
  emails: {
    total_recipients: string
    emails_sent: string
    emails_opened: string
    emails_replied: string
    total_campaigns: string
  }
  seo: {
    total_projects: string
    generated: string
    published: string
  }
  keywords: {
    total_keywords: string
    avg_position: string | null
  }
  funnel: {
    leads_found: number
    crm_total: number
    blast_sent: number
    email_opened: number
    email_replied: number
    deals: number
  }
  rates: {
    openRate: string
    replyRate: string
    conversionRate: string
  }
}

export default function MobileTrackingPage() {
  const { loading: accessLoading, allowed, SelectorModal } = useEcosystemAccess("tracking")
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<StatsData | null>(null)
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [recentEvents, setRecentEvents] = useState<EventLog[]>([])
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [loadingKeywords, setLoadingKeywords] = useState(true)
  const [checkingKeywordId, setCheckingKeywordId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    setMounted(true)
    fetchDashboardData()
    fetchKeywords()
  }, [])

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/tracking/stats")
      const data = await res.json()
      if (data.success) {
        setStats(data.stats)
        setCampaigns(data.campaigns)
        setRecentEvents(data.recentEvents)
      }
    } catch (err) {
      console.error("Gagal memuat stats", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchKeywords = async () => {
    setLoadingKeywords(true)
    try {
      const res = await fetch("/api/tracking/stats")
      const data = await res.json()
      if (data.success) {
        setKeywords(data.keywordsList || [])
      }
    } catch (err) {
      console.error("Gagal memuat keywords", err)
    } finally {
      setLoadingKeywords(false)
    }
  }

  const handleCheckSERP = async (kw: Keyword) => {
    setCheckingKeywordId(kw.id)
    try {
      const res = await fetch("/api/tracking/serp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: kw.keyword }),
      })
      const data = await res.json()
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Selesai Cek!",
          html: `Keyword <b>"${kw.keyword}"</b> berhasil dicek.<br/>Posisi sekarang: <b>${data.results.length > 0 ? "Masuk Top 100" : "Tidak ditemukan"}</b>`,
          confirmButtonColor: "#ea580c"
        })
        fetchDashboardData()
        fetchKeywords()
      } else {
        Swal.fire({ icon: "error", text: data.message, confirmButtonColor: "#ea580c" })
      }
    } catch {
      Swal.fire({ icon: "error", text: "Koneksi terputus saat cek SERP", confirmButtonColor: "#ea580c" })
    } finally {
      setCheckingKeywordId(null)
    }
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

  if (!mounted) return null

  const funnelChartData = stats
    ? [
        { name: "Leads", value: stats.funnel.leads_found, fill: "url(#leadsGradMobile)" },
        { name: "CRM", value: stats.funnel.crm_total, fill: "url(#crmGradMobile)" },
        { name: "Blast", value: stats.funnel.blast_sent, fill: "url(#sentGradMobile)" },
        { name: "Open", value: stats.funnel.email_opened, fill: "url(#openGradMobile)" },
        { name: "Reply", value: stats.funnel.email_replied, fill: "url(#replyGradMobile)" },
        { name: "Deal", value: stats.funnel.deals, fill: "url(#dealGradMobile)" },
      ]
    : []

  const renderRankArrow = (current: number | null, previous: number | null) => {
    if (current === null) return <span className="text-slate-405">—</span>
    if (previous === null) return <span className="text-blue-500 font-extrabold text-[9px] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">NEW</span>
    if (current < previous) {
      return (
        <span className="text-emerald-600 font-extrabold text-[9px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5">
          <ArrowUp size={10} strokeWidth={3} /> {previous - current}
        </span>
      )
    }
    if (current > previous) {
      return (
        <span className="text-rose-600 font-extrabold text-[9px] bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 flex items-center gap-0.5">
          <ArrowDown size={10} strokeWidth={3} /> {current - previous}
        </span>
      )
    }
    return (
      <span className="text-slate-400 flex items-center gap-0.5 text-[10px]">
        <Minus size={10} strokeWidth={3} /> 0
      </span>
    )
  }

  const getRankBadge = (pos: number | null) => {
    if (pos === null) return <span className="text-slate-400 text-[10px] font-bold">Belum Cek</span>
    if (pos === 1) return <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-yellow-400 text-yellow-950 font-black text-[9px] rounded-md border border-yellow-500">🥇 #{pos}</span>
    if (pos <= 3) return <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-slate-200 text-slate-800 font-black text-[9px] rounded-md border border-slate-300">🥈 #{pos}</span>
    if (pos <= 10) return <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-orange-50 text-orange-700 font-black text-[9px] rounded-md border border-orange-200">🥉 #{pos}</span>
    return <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-slate-100 text-slate-700 font-extrabold text-[9px] rounded-md border border-slate-200">#{pos}</span>
  }

  const filteredKeywords = keywords.filter(kw =>
    kw.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (kw.contact_name && kw.contact_name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="bg-[#f4f6f9] min-h-screen pb-24 font-sans select-none w-full flex flex-col items-center">
      <div className="w-full max-w-md bg-[#f4f6f9] min-h-screen flex flex-col">
        {/* 1. SUPER APP HEADER */}
        <div className="bg-orange-600 pt-12 pb-6 px-4 rounded-b-[2rem] shadow-sm sticky top-0 z-50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Link href="/home" className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors active:scale-95">
                <ChevronLeft size={24} strokeWidth={2.5} />
              </Link>
              <div className="flex-1">
                <h1 className="text-white text-lg font-extrabold tracking-tight">Tracking</h1>
                <p className="text-orange-100 text-xs font-medium">Analitik Performa & SERP</p>
              </div>
            </div>
            <button
              onClick={() => { fetchDashboardData(); fetchKeywords(); }}
              disabled={loading}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white active:scale-90 transition-all outline-none"
              title="Refresh Data"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* 2. PROGRESSION TABS SUBHEADER */}
        <EcosystemMobileNav />

        {loading ? (
          <div className="py-24 text-center">
            <Loader2 size={36} className="animate-spin mx-auto text-orange-500 mb-3" />
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Menyusun Laporan...</h3>
          </div>
        ) : !stats ? (
          <div className="py-16 text-center mx-4 mt-6 bg-white rounded-2xl border border-red-200 p-6 text-red-500 font-bold text-xs">
            Gagal mengambil stats data
          </div>
        ) : (
          <div className="flex flex-col gap-6 mt-6 pb-6">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 gap-3.5 px-4">
              {[
                { title: "CRM Kontak", value: stats.contacts.total_contacts, label: `${stats.contacts.leads_found} lead finder`, icon: Users, color: "from-orange-500 to-amber-500 bg-orange-500/5", border: "border-orange-100" },
                { title: "Email Blast", value: stats.emails.emails_sent, label: `${stats.rates.openRate}% Open`, icon: Mail, color: "from-purple-500 to-fuchsia-500 bg-purple-500/5", border: "border-purple-100" },
                { title: "SEO Artikel", value: stats.seo.total_projects, label: `${stats.seo.generated} dibuat`, icon: Key, color: "from-emerald-500 to-teal-500 bg-emerald-500/5", border: "border-emerald-100" },
                { title: "Google Rank", value: stats.keywords.avg_position ? parseFloat(stats.keywords.avg_position).toFixed(1) : "—", label: `${stats.keywords.total_keywords} kata kunci`, icon: BarChart3, color: "from-indigo-500 to-blue-500 bg-indigo-500/5", border: "border-indigo-100" },
              ].map((kpi, idx) => (
                <div key={idx} className={`bg-white rounded-2xl p-4 border ${kpi.border} shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col justify-between relative overflow-hidden group active:scale-[0.98] transition-transform duration-200`}>
                  {/* Small top bar indicator */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${kpi.color.split(' ').slice(0, 3).join(' ')}`} />
                  
                  <div className="flex justify-between items-start pt-1">
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400">{kpi.title}</span>
                    <kpi.icon size={14} className="text-slate-400 group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-800 mt-2.5 leading-none">{kpi.value}</h4>
                  <p className="text-[9px] font-black text-slate-500 uppercase mt-3.5 border-t border-dashed border-slate-100 pt-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-800 animate-pulse" />
                    {kpi.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Funnel Chart Card */}
            <div className="px-4">
              <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black text-slate-850 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles size={14} className="text-orange-500" /> Funnel Konversi Marketing
                  </h3>
                  <span className="text-[9px] font-black bg-slate-50 border border-slate-100 px-2 py-0.5 text-slate-450 uppercase rounded">
                    Realtime
                  </span>
                </div>
                
                <div className="h-[200px] w-full font-extrabold text-[9px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={funnelChartData} margin={{ top: 10, right: 0, left: -30, bottom: 0 }}>
                      <defs>
                        <linearGradient id="leadsGradMobile" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ea580c" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#ea580c" stopOpacity={0.4}/>
                        </linearGradient>
                        <linearGradient id="crmGradMobile" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        </linearGradient>
                        <linearGradient id="sentGradMobile" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                        </linearGradient>
                        <linearGradient id="openGradMobile" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#10b981" stopOpacity={0.4}/>
                        </linearGradient>
                        <linearGradient id="replyGradMobile" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.4}/>
                        </linearGradient>
                        <linearGradient id="dealGradMobile" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#059669" stopOpacity={0.9}/>
                          <stop offset="100%" stopColor="#059669" stopOpacity={0.4}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" tickLine={false} stroke="#94a3b8" />
                      <YAxis tickLine={false} stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "12px", color: "#fff", fontSize: "10px" }} />
                      <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                        {funnelChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Rates Progress Bars */}
            <div className="px-4">
              <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-4">
                <h3 className="text-xs font-black text-slate-850 uppercase tracking-wide">Konversi & Efisiensi</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-[11px] font-extrabold text-slate-500 mb-1.5 px-0.5">
                      <span>Open Rate Email</span>
                      <span className="text-purple-600 font-black">{stats.rates.openRate}%</span>
                    </div>
                    <div className="h-3.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 rounded-full" style={{ width: `${stats.rates.openRate}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-extrabold text-slate-500 mb-1.5 px-0.5">
                      <span>Reply Rate</span>
                      <span className="text-teal-600 font-black">{stats.rates.replyRate}%</span>
                    </div>
                    <div className="h-3.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full" style={{ width: `${stats.rates.replyRate}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-extrabold text-slate-500 mb-1.5 px-0.5">
                      <span>Conversion Rate (Deals)</span>
                      <span className="text-emerald-600 font-black">{stats.rates.conversionRate}%</span>
                    </div>
                    <div className="h-3.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full" style={{ width: `${stats.rates.conversionRate}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Keyword Rank Tracker Cards */}
            <div className="px-4 flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-black text-slate-855 uppercase tracking-wider pl-1">SERP Rank Tracker</h3>
                
                {/* Search Filter for Mobile keywords */}
                <div className="relative w-full">
                  <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari kata kunci..."
                    className="w-full pl-9 pr-4 py-2.5 bg-white text-slate-800 border border-slate-200/80 rounded-2xl text-[11px] font-bold uppercase tracking-wider outline-none focus:border-orange-500 transition-all shadow-sm"
                  />
                </div>
              </div>
              
              {loadingKeywords ? (
                <div className="py-8 text-center bg-white rounded-2xl"><Loader2 size={24} className="animate-spin text-orange-500 mx-auto" /></div>
              ) : filteredKeywords.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-[1.8rem] p-5 border border-slate-150 text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                  {searchTerm ? "Kata kunci tidak ditemukan" : (
                    <>
                      Belum ada keyword yang dilacak. Generate keyword di{" "}
                      <Link href="/ecosystem/keyword" className="text-orange-600 underline font-black">
                        Keyword Planner
                      </Link>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredKeywords.map((kw) => (
                    <div
                      key={kw.id}
                      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.015)] flex justify-between items-center hover:shadow-md transition-shadow"
                    >
                      <div className="min-w-0 max-w-[55%]">
                        <h4 className="font-extrabold text-[12.5px] text-slate-800 truncate leading-snug">{kw.keyword}</h4>
                        <div className="flex items-center gap-1.5 mt-1.5 text-[9px] font-black text-slate-400 uppercase tracking-wider">
                          <span className="truncate">{kw.contact_name || "Umum"}</span>
                          {kw.search_volume && (
                            <>
                              <span>•</span>
                              <span className="text-slate-500 shrink-0">📈 {kw.search_volume.toLocaleString("id-ID")}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-center flex flex-col items-center">
                          {getRankBadge(kw.current_position)}
                          <div className="mt-1.5 flex items-center justify-center h-4">{renderRankArrow(kw.current_position, kw.previous_position)}</div>
                        </div>

                        <button
                          onClick={() => handleCheckSERP(kw)}
                          disabled={checkingKeywordId === kw.id}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-3.5 py-2 rounded-full text-[10px] font-extrabold transition-colors active:scale-95 outline-none shadow-sm disabled:opacity-50"
                        >
                          {checkingKeywordId === kw.id ? "Cek..." : "Cek Rank"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Campaign Performance & History */}
            {campaigns.length > 0 && (
              <div className="px-4 flex flex-col gap-3">
                <h3 className="text-sm font-black text-slate-850 uppercase tracking-wider pl-1">Performa Campaign</h3>
                {campaigns.slice(0, 3).map(c => {
                  const openPercent = c.sent_count > 0 ? Math.round((c.open_count / c.sent_count) * 100) : 0
                  const replyPercent = c.open_count > 0 ? Math.round((c.reply_count / c.open_count) * 100) : 0
                  return (
                    <div key={c.id} className="p-4 bg-white rounded-[1.8rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
                      <div className="flex justify-between items-start border-b border-slate-50 pb-2.5 mb-3">
                        <div className="max-w-[70%]">
                          <h4 className="font-extrabold text-xs text-slate-800 truncate leading-snug">{c.name}</h4>
                          <p className="text-[9px] text-slate-400 mt-0.5 truncate leading-relaxed">{c.subject}</p>
                        </div>
                        <span className="text-[8.5px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-0.5 border border-slate-100 rounded">{new Date(c.sent_at).toLocaleDateString("id-ID")}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-center bg-slate-50/70 py-2.5 rounded-xl border border-slate-100/60">
                        <div>
                          <p className="font-black text-[14px] text-slate-800 leading-none">{c.sent_count}</p>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mt-1.5">Terkirim</p>
                        </div>
                        <div>
                          <p className="font-black text-[14px] text-purple-600 leading-none">{openPercent}%</p>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mt-1.5">Opened</p>
                        </div>
                        <div>
                          <p className="font-black text-[14px] text-teal-600 leading-none">{replyPercent}%</p>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mt-1.5">Replied</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Activity Logs */}
            {recentEvents.length > 0 && (
              <div className="px-4 flex flex-col gap-3">
                <h3 className="text-sm font-black text-slate-850 uppercase tracking-wider pl-1">Log Aktivitas Terbaru</h3>
                <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] max-h-[300px] overflow-y-auto relative">
                  
                  {/* Vertical Timeline line */}
                  <div className="absolute left-[33px] top-[28px] bottom-[28px] w-0.5 bg-slate-100" />
                  
                  <div className="flex flex-col gap-5.5 relative">
                    {recentEvents.map((evt) => {
                      // Custom colors based on event type
                      let iconColor = "bg-slate-800 border-slate-900"
                      if (evt.event_type.includes("LEAD")) iconColor = "bg-orange-500 border-orange-500"
                      else if (evt.event_type.includes("EMAIL")) iconColor = "bg-purple-500 border-purple-500"
                      else if (evt.event_type.includes("CRM")) iconColor = "bg-blue-500 border-blue-500"
                      else if (evt.event_type.includes("SEO")) iconColor = "bg-emerald-500 border-emerald-500"

                      return (
                        <div key={evt.id} className="flex gap-4 items-center">
                          {/* Node Icon */}
                          <div className={`w-3.5 h-3.5 rounded-full border border-white z-10 flex items-center justify-center shrink-0 ${iconColor} shadow-[0_2px_6px_rgba(0,0,0,0.1)]`}>
                            <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                          </div>
                          
                          <div className="bg-slate-50/70 p-2.5 rounded-xl border border-slate-100/80 flex-1 min-w-0 flex justify-between items-center">
                            <div className="min-w-0 flex-1 pr-2">
                              <p className="font-black text-[10.5px] text-slate-700 uppercase tracking-wide truncate">{evt.event_type.replace(/_/g, " ")}</p>
                              <p className="text-[8.5px] font-bold text-slate-400 mt-1 flex items-center gap-1">
                                <Clock size={9} />
                                {new Date(evt.created_at).toLocaleString("id-ID")}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}
