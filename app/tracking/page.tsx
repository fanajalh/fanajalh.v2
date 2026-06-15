"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { BarChart3, Users, Mail, Key, Sparkles, RefreshCw, Loader2, ArrowUp, ArrowDown, Minus, Clock, Eye, Send, CheckCircle2, ChevronRight, Search, TrendingUp, Award, Calendar, ListFilter } from "lucide-react"
import EcosystemNav from "@/components/sections/EcosystemNav"
import Swal from "@/lib/custom-alert"
import Link from "next/link"
import { useEcosystemAccess } from "@/lib/ecosystem-access-hook"

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

export default function TrackingPage() {
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
          confirmButtonColor: "#000000"
        })
        fetchDashboardData()
        fetchKeywords()
      } else {
        Swal.fire({ icon: "error", text: data.message, confirmButtonColor: "#000000" })
      }
    } catch {
      Swal.fire({ icon: "error", text: "Koneksi terputus saat cek SERP", confirmButtonColor: "#000000" })
    } finally {
      setCheckingKeywordId(null)
    }
  }

  if (accessLoading || !allowed) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-black dark:text-white" />
      </div>
    )
  }

  if (!mounted) return null

  // Format Recharts funnel data
  const funnelChartData = stats
    ? [
        { name: "Leads Found", value: stats.funnel.leads_found, fill: "url(#leadsGrad)" },
        { name: "CRM Contacts", value: stats.funnel.crm_total, fill: "url(#crmGrad)" },
        { name: "Email Sent", value: stats.funnel.blast_sent, fill: "url(#sentGrad)" },
        { name: "Email Opened", value: stats.funnel.email_opened, fill: "url(#openGrad)" },
        { name: "Email Replied", value: stats.funnel.email_replied, fill: "url(#replyGrad)" },
        { name: "Deals Closed", value: stats.funnel.deals, fill: "url(#dealGrad)" },
      ]
    : []

  const renderRankArrow = (current: number | null, previous: number | null) => {
    if (current === null) return <span className="text-gray-450">—</span>
    if (previous === null) return <span className="px-2 py-0.5 bg-blue-100 text-blue-800 border border-blue-300 text-[10px] font-black uppercase">NEW</span>
    if (current < previous) {
      return (
        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-black bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 border border-emerald-200 dark:border-emerald-800 text-[10px]">
          <ArrowUp size={11} strokeWidth={3} /> {previous - current}
        </span>
      )
    }
    if (current > previous) {
      return (
        <span className="text-rose-600 dark:text-rose-400 flex items-center gap-0.5 font-black bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 border border-rose-200 dark:border-rose-800 text-[10px]">
          <ArrowDown size={11} strokeWidth={3} /> {current - previous}
        </span>
      )
    }
    return (
      <span className="text-gray-400 dark:text-gray-500 flex items-center gap-0.5 text-xs">
        <Minus size={11} strokeWidth={3} /> 0
      </span>
    )
  }

  const getRankBadge = (pos: number | null) => {
    if (pos === null) return <span className="text-gray-400 text-xs">Belum dicek</span>
    if (pos === 1) return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-400 text-black border-2 border-black font-black text-xs shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">🥇 Rank #1</span>
    if (pos <= 3) return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-200 text-black border-2 border-black font-black text-xs shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">🥈 Rank #{pos}</span>
    if (pos <= 10) return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-800 border-2 border-orange-400 font-black text-xs">🥉 Rank #{pos}</span>
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white dark:bg-zinc-900 text-black dark:text-white border-2 border-black dark:border-zinc-700 font-bold text-xs">Rank #{pos}</span>
  }

  const filteredKeywords = keywords.filter(kw =>
    kw.keyword.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (kw.contact_name && kw.contact_name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (

    <div className="min-h-screen bg-gray-50 dark:bg-black font-sans selection:bg-yellow-400 selection:text-black">
      {!SelectorModal && <EcosystemNav />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {SelectorModal ? (
          <div className="py-12">
            {SelectorModal}
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-l-8 border-black dark:border-white pl-5 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400 text-black border-2 border-black font-black text-[10px] uppercase tracking-widest mb-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">

              <TrendingUp size={12} strokeWidth={2.5} /> Real-Time Analytics
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white uppercase tracking-wider">Tracking & Analytics</h2>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Pantau performa funnel konversi dan ranking SEO Google Indonesia</p>
          </div>
          
          <button
            onClick={() => { fetchDashboardData(); fetchKeywords(); }}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-zinc-900 text-black dark:text-white border-4 border-black dark:border-white text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] transition-all active:scale-95 shrink-0"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} strokeWidth={2.5} />
            Refresh Dashboard
          </button>
        </div>

        {loading ? (
          <div className="py-32 text-center">
            <Loader2 size={56} className="animate-spin mx-auto text-black dark:text-white mb-4" strokeWidth={2.5} />
            <h3 className="text-lg font-black uppercase tracking-widest text-black dark:text-white">Menyusun Data Laporan...</h3>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Sistem sedang menghubungi database & API pihak ketiga</p>
          </div>
        ) : !stats ? (
          <div className="py-24 text-center border-4 border-dashed border-red-500 bg-red-50 dark:bg-red-950/20 max-w-2xl mx-auto">
            <h3 className="text-lg font-black text-red-500 uppercase tracking-widest">Gagal memuat stats</h3>
            <p className="text-xs font-semibold text-red-400 mt-1">Koneksi API bermasalah. Coba refresh halaman beberapa saat lagi.</p>
          </div>
        ) : (
          <div className="space-y-10">
            
            {/* KPI Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "CRM Contacts", value: stats.contacts.total_contacts, desc: `${stats.contacts.leads_found} prospek Google Maps`, icon: Users, color: "from-blue-500 to-indigo-600", border: "border-blue-500" },
                { title: "Email Blast Sent", value: stats.emails.emails_sent, desc: `${stats.rates.openRate}% rata-rata dibuka`, icon: Mail, color: "from-purple-500 to-fuchsia-600", border: "border-purple-500" },
                { title: "SEO Projects", value: stats.seo.total_projects, desc: `${stats.seo.generated} artikel blog AI dibuat`, icon: Key, color: "from-emerald-500 to-teal-600", border: "border-emerald-500" },
                { title: "Avg. Rank Google", value: stats.keywords.avg_position ? parseFloat(stats.keywords.avg_position).toFixed(1) : "—", desc: `${stats.keywords.total_keywords} kata kunci dilacak`, icon: BarChart3, color: "from-amber-400 to-orange-500", border: "border-amber-500" },
              ].map((kpi, idx) => (
                <div 
                  key={idx} 
                  className="bg-white dark:bg-zinc-950 border-4 border-black dark:border-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] relative overflow-hidden group hover:translate-y-[-4px] transition-transform duration-300"
                >
                  {/* Accent Line */}
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${kpi.color}`} />
                  
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-405 dark:text-gray-450">{kpi.title}</p>
                      <h4 className="text-4xl font-black text-black dark:text-white mt-2 tracking-tight">{kpi.value}</h4>
                    </div>
                    <div className="w-12 h-12 border-3 border-black dark:border-zinc-800 flex items-center justify-center bg-gray-50 dark:bg-zinc-900 group-hover:rotate-6 transition-transform">
                      <kpi.icon size={20} className="text-black dark:text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-[10px] font-bold text-gray-450 uppercase tracking-widest mt-4 border-t-2 border-dashed border-gray-150 dark:border-zinc-800 pt-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-white animate-pulse" />
                    {kpi.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Funnel & Campaigns Performance */}
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* Funnel Chart */}
              <div className="lg:col-span-2 bg-white dark:bg-zinc-950 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-black dark:text-white flex items-center gap-2">
                    <Sparkles size={18} className="text-amber-500" /> Funnel Konversi Marketing
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-zinc-900 px-3 py-1 border-2 border-black dark:border-zinc-800 text-slate-500">
                    B2B PIPELINE
                  </span>
                </div>
                
                <div className="h-[300px] w-full font-black text-[10px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={funnelChartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ea580c" stopOpacity={0.95}/>
                          <stop offset="100%" stopColor="#c2410c" stopOpacity={0.75}/>
                        </linearGradient>
                        <linearGradient id="crmGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.95}/>
                          <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.75}/>
                        </linearGradient>
                        <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.95}/>
                          <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.75}/>
                        </linearGradient>
                        <linearGradient id="openGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.95}/>
                          <stop offset="100%" stopColor="#047857" stopOpacity={0.75}/>
                        </linearGradient>
                        <linearGradient id="replyGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.95}/>
                          <stop offset="100%" stopColor="#0f766e" stopOpacity={0.75}/>
                        </linearGradient>
                        <linearGradient id="dealGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#059669" stopOpacity={0.95}/>
                          <stop offset="100%" stopColor="#047857" stopOpacity={0.75}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:opacity-5" />
                      <XAxis dataKey="name" tickLine={false} stroke="#94a3b8" fontSize={10} />
                      <YAxis tickLine={false} stroke="#94a3b8" fontSize={10} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#000",
                          border: "3px solid #fff",
                          color: "#fff",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                          fontFamily: "monospace",
                          fontWeight: "900"
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 0, 0, 0]}>
                        {funnelChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} stroke="#000" strokeWidth={3} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Conversion Stats */}
              <div className="lg:col-span-1 bg-white dark:bg-zinc-950 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-black dark:text-white mb-6 border-b-2 border-black dark:border-zinc-800 pb-3">Rates & Efisiensi</h3>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                        <span>Open Rate Email</span>
                        <span className="text-purple-600 font-black">{stats.rates.openRate}%</span>
                      </div>
                      <div className="h-5 bg-gray-150 dark:bg-zinc-900 border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-500 border-r-2 border-black" style={{ width: `${stats.rates.openRate}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                        <span>Reply Rate (dari open)</span>
                        <span className="text-teal-600 font-black">{stats.rates.replyRate}%</span>
                      </div>
                      <div className="h-5 bg-gray-150 dark:bg-zinc-900 border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 border-r-2 border-black" style={{ width: `${stats.rates.replyRate}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-gray-500 mb-2">
                        <span>Conversion Rate (Deals/Contacts)</span>
                        <span className="text-emerald-600 font-black">{stats.rates.conversionRate}%</span>
                      </div>
                      <div className="h-5 bg-gray-150 dark:bg-zinc-900 border-2 border-black overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 border-r-2 border-black" style={{ width: `${stats.rates.conversionRate}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-yellow-50 dark:bg-zinc-900/40 border-2 border-black dark:border-zinc-800 text-[10px] font-bold text-slate-700 dark:text-gray-400 uppercase tracking-widest text-center leading-relaxed">
                  💡 Funnel konversi ini otomatis diperbarui secara realtime dari aktivitas CRM dan email blast.
                </div>
              </div>
            </div>

            {/* Keyword Tracker Table */}
            <div className="bg-white dark:bg-zinc-950 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b-2 border-black dark:border-zinc-800 pb-5">
                <h3 className="text-sm font-black uppercase tracking-widest text-black dark:text-white flex items-center gap-2">
                  <Key size={18} className="text-amber-500" /> SERP Rank Tracker (Google Indonesia)
                </h3>
                
                {/* Search Input */}
                <div className="relative w-full md:w-80">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari kata kunci atau bisnis..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-zinc-900 border-2 border-black dark:border-zinc-700 text-xs font-bold uppercase tracking-wide placeholder-gray-400 outline-none focus:bg-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>
              </div>

              {loadingKeywords ? (
                <div className="py-12 text-center"><Loader2 size={32} className="animate-spin text-black dark:text-white mx-auto" /></div>
              ) : filteredKeywords.length === 0 ? (
                <div className="py-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest border-2 border-dashed border-gray-200 dark:border-zinc-800">
                  {searchTerm ? "Tidak ada kata kunci yang cocok" : (
                    <>
                      Belum ada keyword yang dilacak. Generate di{" "}
                      <Link href="/keyword" className="text-orange-600 dark:text-orange-400 underline font-black">
                        Keyword Planner
                      </Link>
                    </>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-4 border-black dark:border-white text-left">
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-405">Kata Kunci</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-405">Klien / Bisnis</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-405">Volume Cari</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-405">Posisi Google</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-405">Perubahan</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-405 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-gray-100 dark:divide-zinc-900">
                      {filteredKeywords.map((kw) => (
                        <tr key={kw.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/50 transition-colors">
                          <td className="p-4 font-black text-black dark:text-white">{kw.keyword}</td>
                          <td className="p-4 text-xs font-bold text-gray-500 uppercase">{kw.contact_name || "Umum"}</td>
                          <td className="p-4 text-xs font-bold text-gray-600 dark:text-gray-400">
                            {kw.search_volume ? (
                              <span className="bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 text-slate-700 dark:text-gray-300 font-extrabold border border-slate-200 dark:border-zinc-700">
                                📊 {kw.search_volume.toLocaleString("id-ID")} / bln
                              </span>
                            ) : "—"}
                          </td>
                          <td className="p-4 font-black">
                            {getRankBadge(kw.current_position)}
                          </td>
                          <td className="p-4">{renderRankArrow(kw.current_position, kw.previous_position)}</td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleCheckSERP(kw)}
                              disabled={checkingKeywordId === kw.id}
                              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-[10px] font-black uppercase tracking-widest border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1.5px] hover:translate-y-[1.5px] hover:shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 transition-all flex items-center gap-1.5 ml-auto"
                            >
                              {checkingKeywordId === kw.id ? (
                                <>
                                  <Loader2 size={12} className="animate-spin" />
                                  Checking...
                                </>
                              ) : (
                                "Cek Posisi"
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Campaign History & Timeline Grid */}
            <div className="grid lg:grid-cols-2 gap-8">
              
              {/* Campaign Performance History */}
              <div className="bg-white dark:bg-zinc-950 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
                <h3 className="text-sm font-black uppercase tracking-widest text-black dark:text-white mb-6 border-b-2 border-black dark:border-zinc-800 pb-3">Performa Campaign Terakhir</h3>
                
                {campaigns.length === 0 ? (
                  <div className="py-16 text-center text-xs font-bold text-gray-400 uppercase tracking-widest border-2 border-dashed border-gray-200 dark:border-zinc-800">
                    Belum ada campaign yang terkirim
                  </div>
                ) : (
                  <div className="space-y-4">
                    {campaigns.map(c => {
                      const openPercent = c.sent_count > 0 ? Math.round((c.open_count / c.sent_count) * 100) : 0
                      const replyPercent = c.open_count > 0 ? Math.round((c.reply_count / c.open_count) * 100) : 0
                      return (
                        <div key={c.id} className="p-5 border-2 border-black dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                          <div className="flex justify-between items-start border-b border-gray-200 dark:border-zinc-850 pb-3 mb-4">
                            <div>
                              <h4 className="font-black text-xs text-black dark:text-white uppercase truncate max-w-[280px]">{c.name}</h4>
                              <p className="text-[10px] text-gray-400 mt-1 font-semibold leading-relaxed truncate max-w-[280px]">{c.subject}</p>
                            </div>
                            <span className="text-[10px] font-black uppercase bg-white dark:bg-black px-2.5 py-1 border border-black dark:border-zinc-700 text-gray-400 shrink-0">
                              {new Date(c.sent_at).toLocaleDateString("id-ID")}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="border-r border-gray-200 dark:border-zinc-850">
                              <p className="font-black text-2xl text-black dark:text-white tracking-tight">{c.sent_count}</p>
                              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Terkirim</p>
                            </div>
                            <div className="border-r border-gray-200 dark:border-zinc-850">
                              <p className="font-black text-2xl text-purple-600">{openPercent}%</p>
                              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Opened</p>
                            </div>
                            <div>
                              <p className="font-black text-2xl text-teal-600">{replyPercent}%</p>
                              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Replied</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Recent Events Feed */}
              <div className="bg-white dark:bg-zinc-950 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
                <h3 className="text-sm font-black uppercase tracking-widest text-black dark:text-white mb-6 border-b-2 border-black dark:border-zinc-800 pb-3">Log Aktivitas Terbaru</h3>
                
                {recentEvents.length === 0 ? (
                  <div className="py-16 text-center text-xs font-bold text-gray-400 uppercase tracking-widest border-2 border-dashed border-gray-200 dark:border-zinc-800">
                    Belum ada aktivitas tercatat
                  </div>
                ) : (
                  <div className="relative border-l-2 border-black dark:border-zinc-700 pl-6 ml-4 space-y-6 max-h-[350px] overflow-y-auto pr-1">
                    {recentEvents.map((evt) => {
                      // Custom colors based on event type
                      let iconColor = "bg-slate-900 border-slate-900"
                      if (evt.event_type.includes("LEAD")) iconColor = "bg-orange-500 border-orange-600"
                      else if (evt.event_type.includes("EMAIL")) iconColor = "bg-purple-500 border-purple-600"
                      else if (evt.event_type.includes("CRM")) iconColor = "bg-blue-500 border-blue-600"
                      else if (evt.event_type.includes("SEO")) iconColor = "bg-emerald-500 border-emerald-600"

                      return (
                        <div key={evt.id} className="relative group">
                          {/* Timeline node */}
                          <div className={`absolute -left-[32px] top-1.5 w-4.5 h-4.5 rounded-full border-2 border-black dark:border-zinc-800 ${iconColor} flex items-center justify-center shadow-[1px_1px_0px_rgba(0,0,0,1)]`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          </div>
                          <div className="bg-slate-50 dark:bg-zinc-900 border-2 border-black dark:border-zinc-800 p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                            <p className="font-black text-black dark:text-white uppercase tracking-wider text-[11px]">
                              {evt.event_type.replace(/_/g, " ")}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 mt-1 flex items-center gap-1">
                              <Clock size={11} />
                              {new Date(evt.created_at).toLocaleString("id-ID")}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
          </>
        )}
      </main>
    </div>
  )
}
