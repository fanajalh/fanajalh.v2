"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import {
  Palette, MessageCircle, Briefcase, Tag, Link2,
  ChevronRight, LogOut, Shield, Star, Crown,
  Clock, X, Sparkles, Zap, Bell, Activity, ShoppingBag, Camera,
  Home, HelpCircle
} from "lucide-react"

interface NewsItem {
  id: number; title: string; description: string; badge: string;
  color_from: string; color_to: string; link: string; is_active: boolean;
}
interface FeaturedWork {
  id: number; title: string; client_name: string; badge: string;
  duration_text: string; is_active: boolean;
}
interface OrderItem {
  id: number;
  order_number: string;
  title: string | null;
  service: string;
  status: string;
}

// Map warna untuk Kabar Terbaru (News)
const GRADIENT_MAP: Record<string, string> = {
  "teal-500": "from-teal-400 to-emerald-600",
  "indigo-500": "from-indigo-500 to-blue-600",
  "rose-500": "from-rose-500 to-rose-700",
  "amber-500": "from-amber-400 to-orange-500",
  "slate-800": "from-slate-700 to-slate-900",
  "purple-600": "from-purple-500 to-fuchsia-700",
}

export default function UserHome() {
  const { data: session } = useSession()
  const [showAllShortcuts, setShowAllShortcuts] = useState(false)
  const [greeting, setGreeting] = useState("Selamat Datang")

  // Dynamic data
  const [news, setNews] = useState<NewsItem[]>([])
  const [works, setWorks] = useState<FeaturedWork[]>([])
  const [userOrders, setUserOrders] = useState<OrderItem[]>([])
  const [dbServices, setDbServices] = useState<any[]>([])

  useEffect(() => {
    // Sapaan otomatis sesuai waktu
    const hour = new Date().getHours()
    if (hour < 11) setGreeting("Selamat Pagi")
    else if (hour < 15) setGreeting("Selamat Siang")
    else if (hour < 18) setGreeting("Selamat Sore")
    else setGreeting("Selamat Malam")

    Promise.all([
      fetch("/api/admin/news").then(r => r.json()).catch(() => ({ data: [] })),
      fetch("/api/admin/featured-works").then(r => r.json()).catch(() => ({ data: [] })),
      fetch("/api/orders").then(r => r.json()).catch(() => ({ orders: [] })),
    ]).then(([n, w, o]) => {
      setNews((n.data || []).filter((i: NewsItem) => i.is_active))
      setWorks((w.data || []).filter((i: FeaturedWork) => i.is_active))
      setUserOrders(o.orders || [])
    })

    try {
      const saved = localStorage.getItem("websiteSettings")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.services) setDbServices(parsed.services)
      }
    } catch (e) {
      console.error(e)
    }

    fetch("/api/website-settings")
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.data) {
          const parsed = resData.data
          if (parsed.services) setDbServices(parsed.services)
          localStorage.setItem("websiteSettings", JSON.stringify(parsed))
        }
      })
      .catch(err => console.error("Error fetching settings:", err))
  }, [])

  return (
    <div className="bg-[#f4f6f9] min-h-screen pb-24 font-sans select-none overflow-x-hidden">

      {/* 1. FRESH ORANGE HEADER */}
      <div className="relative bg-gradient-to-br from-orange-500 via-[#ff7300] to-orange-600 w-full pt-10 pb-36 rounded-b-[2.5rem] overflow-hidden shadow-[0_8px_30px_rgba(249,115,22,0.3)]">
        {/* Glow Effects (Cahaya Pemanis) */}
        <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-white/20 rounded-full blur-[80px] mix-blend-overlay pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[200px] h-[200px] bg-yellow-400/20 rounded-full blur-[60px] mix-blend-overlay pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-5 z-10 flex flex-col gap-6">

          {/* Top Bar: Avatar & Actions */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full border-[2.5px] border-white/40 overflow-hidden bg-white shrink-0 shadow-sm">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || 'User')}&background=fff&color=ff6b00&bold=true`}
                  alt="Avatar" className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-[11px] font-bold text-orange-100 uppercase tracking-widest">{greeting},</p>
                <h1 className="text-lg font-black text-white tracking-tight leading-none mt-0.5 drop-shadow-sm">
                  {session?.user?.name?.split(' ')[0] || 'Ksatria'}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href="/ecosystem/tutorial" title="Tutorial Ekosistem" className="h-10 px-3 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center gap-1.5 text-white border border-white/20 active:scale-90 transition-all shadow-sm outline-none text-xs font-bold">
                <HelpCircle size={15} />
                <span className="hidden sm:inline">Tutorial</span>
              </Link>
              <Link href="/" title="Kembali ke Halaman Utama (Beranda)" className="h-10 px-4 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center gap-1.5 text-white border border-white/20 active:scale-90 transition-all shadow-sm outline-none text-xs font-bold">
                <Home size={15} />
                <span>Ke Beranda</span>
              </Link>
              <button title="Log Out" onClick={() => signOut({ callbackUrl: "/loginUser" })} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 active:scale-90 transition-all shadow-sm outline-none">
                <LogOut size={15} className="pr-0.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* 2. MAIN CONTENT OVERLAP */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 -mt-24 relative z-20 flex flex-col gap-6">

        {/* ================= AREA PESANAN (POSISI PALING ATAS!) ================= */}
        <div className="bg-white rounded-[2rem] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
          {/* Garis oranye di atas kartu */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 to-orange-500" />

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[17px] font-black flex items-center gap-2 text-slate-800">
              <Activity size={18} className="text-orange-500" /> Area Pesanan
            </h2>
            <span className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-md text-[10px] font-extrabold border border-orange-100">
              {userOrders.length} Pesanan
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {userOrders.length > 0 ? userOrders.slice(0, 5).map((item) => (
              <div key={item.id} className="bg-slate-50 rounded-[1.2rem] p-3 border border-slate-100 flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all hover:bg-orange-50 hover:border-orange-100">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-10 w-10 items-center justify-center shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-40" />
                    <div className="relative inline-flex rounded-full h-8 w-8 bg-orange-500 items-center justify-center shadow-sm">
                      <Clock size={14} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800 mb-0.5 line-clamp-1">
                      {item.title || item.service}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-slate-500">{item.order_number}</span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[11px] text-orange-500 font-bold uppercase tracking-wider">{item.status}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300 group-hover:text-orange-500 transition-colors" />
              </div>
            )) : (
              // Empty State kalau belum ada pesanan
              <div className="text-center py-6 px-4 bg-slate-50/80 rounded-[1.5rem] border border-dashed border-slate-200">
                <ShoppingBag size={28} className="mx-auto text-slate-300 mb-2" />
                <p className="text-[13px] text-slate-500 font-bold">Belum ada pesanan aktif</p>
                <p className="text-[11px] text-slate-400 mb-4 mt-0.5">Mulai wujudkan ide desainmu sekarang.</p>

                {/* INI BUTTON NYA BANG! */}
                <Link href="/layanan" className="inline-flex items-center justify-center gap-1.5 bg-orange-500 text-white px-5 py-2.5 rounded-[1rem] text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 active:scale-95 transition-all shadow-[0_8px_20px_rgba(249,115,22,0.25)] outline-none">
                  Mulai Pesan <ChevronRight size={14} strokeWidth={3} />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ================= BENTO GRID NAVIGATION ================= */}
        <div className="grid grid-cols-4 gap-3 md:gap-4">

          {/* Big Hero Button */}
          <Link href="/layanan" className="col-span-2 row-span-2 bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 active:scale-95 transition-all flex flex-col justify-between relative group hover:border-orange-200 hover:shadow-md">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full pointer-events-none transition-colors group-hover:bg-orange-100" />
            <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-50 text-orange-500 rounded-2xl flex items-center justify-center shadow-sm mb-6 relative z-10 group-hover:scale-110 transition-transform">
              <Palette size={24} strokeWidth={2.5} />
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-black text-slate-800 leading-tight">Katalog<br />Layanan</h3>
              <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1">
                Pesan <ChevronRight size={12} />
              </p>
            </div>
          </Link>

          {/* Small Buttons */}
          <Link href="/frames" className="col-span-1 row-span-1 bg-white rounded-[1.5rem] p-3 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all hover:border-emerald-200 hover:shadow-md">
            <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center">
              <Camera size={20} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-extrabold text-slate-700">Studio</span>
          </Link>

          <Link href="/portfolio" className="col-span-1 row-span-1 bg-white rounded-[1.5rem] p-3 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all hover:border-blue-200 hover:shadow-md">
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
              <Briefcase size={20} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-extrabold text-slate-700">Karya</span>
          </Link>

          <Link href="/paket" className="col-span-1 row-span-1 bg-white rounded-[1.5rem] p-3 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all relative hover:border-purple-200 hover:shadow-md">
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <div className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center">
              <Tag size={20} strokeWidth={2.5} />
            </div>
            <span className="text-[10px] font-extrabold text-slate-700">Promo</span>
          </Link>

          <button onClick={() => setShowAllShortcuts(true)} className="col-span-1 row-span-1 bg-slate-100 rounded-[1.5rem] p-3 shadow-inner border border-slate-200 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all outline-none">
            <div className="w-10 h-10 bg-white text-slate-500 rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </div>
            <span className="text-[10px] font-extrabold text-slate-700">Menu</span>
          </button>
        </div>

        {/* ================= ECOSYSTEM BISNIS BANNER SHORTCUT ================= */}
        <Link 
          href="/ecosystem/lead-finder" 
          className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 rounded-[1.5rem] p-4 text-white active:scale-[0.98] transition-all flex items-center justify-between shadow-[0_8px_30px_rgba(16,185,129,0.15)] group border border-emerald-400/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner">
              <Sparkles size={20} className="text-white animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-1.5">
                Ecosystem Bisnis <span className="bg-white/20 text-white text-[8px] font-black px-1.5 py-0.5 rounded">NEW</span>
              </h3>
              <p className="text-[10px] text-emerald-50 font-bold opacity-90">6 Fitur CRM, Lead Finder, Email Blast & SEO Terintegrasi</p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all group-hover:translate-x-1 duration-300">
            <ChevronRight size={16} strokeWidth={3} className="text-white" />
          </div>
        </Link>

        {/* ================= KABAR TERBARU (YANG SEMPAT ILANG) ================= */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-[17px] font-black text-slate-800 tracking-tight flex items-center gap-1.5">
              Kabar Terbaru <Sparkles size={16} className="text-amber-400" />
            </h2>
          </div>
          <div className="flex gap-4 overflow-x-auto snap-x pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-1">
            {news.length > 0 ? news.map((item) => (
              <a key={item.id} href={item.link || "#"} className="group min-w-[85%] md:min-w-[320px] h-48 rounded-[2rem] overflow-hidden relative snap-center shadow-sm hover:shadow-xl transition-all duration-300 active:scale-[0.98] block">
                <div className={`absolute inset-0 bg-gradient-to-br ${GRADIENT_MAP[item.color_from] || "from-slate-800"} ${GRADIENT_MAP[item.color_to] || "to-slate-900"} z-10 opacity-95`} />
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mt-10 -mr-10 blur-2xl z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0 pointer-events-none" />

                <div className="absolute inset-0 p-5 flex flex-col justify-between z-20">
                  <span className="self-start bg-white/20 backdrop-blur-md text-[10px] text-white font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border border-white/20 shadow-sm">
                    {item.badge}
                  </span>
                  <div>
                    <h3 className="font-black text-xl leading-tight text-white mb-1.5 drop-shadow-sm">{item.title}</h3>
                    <p className="text-white/80 text-xs font-medium line-clamp-2 drop-shadow-sm">{item.description}</p>
                  </div>
                </div>
              </a>
            )) : (
              // Fallback Dummy Card jika News kosong
              <div className="min-w-[85%] md:min-w-[320px] h-48 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-purple-600 relative snap-center p-5 flex flex-col justify-between shadow-md border border-indigo-400">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mt-8 -mr-8 blur-2xl z-10 pointer-events-none" />
                <span className="self-start bg-white/20 backdrop-blur-md text-[10px] text-white font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border border-white/20 shadow-sm z-20">Info</span>
                <div className="relative z-20">
                  <h3 className="font-black text-xl leading-tight text-white mb-1.5 drop-shadow-sm">Platform Siap Digunakan</h3>
                  <p className="text-white/90 text-xs font-medium line-clamp-2 drop-shadow-sm">Loading Content.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= PRODUK TOP / LAYANAN POPULER ================= */}
        {(() => {
          const topProducts = [
            { name: "Desain Poster", defaultPrice: "15.000", icon: Palette, badge: "TOP", badgeClass: "bg-yellow-400 text-yellow-900", hoverBg: "group-hover:bg-blue-50", hoverIcon: "group-hover:text-blue-500", link: "/order?service=poster&package=professional", badgeIcon: Star },
            { name: "Desain Bisnis", defaultPrice: "25.000", icon: Briefcase, badge: "HOT", badgeClass: "bg-orange-500 text-white", hoverBg: "group-hover:bg-rose-50", hoverIcon: "group-hover:text-rose-500", link: "/order?service=logo&package=professional", badgeIcon: Zap },
          ]
          const visibleProducts = topProducts.filter(p => {
            const matched = dbServices.find((s: any) => s.name.toLowerCase() === p.name.toLowerCase())
            return matched ? matched.active : true
          })

          if (visibleProducts.length === 0) return null

          return (
            <div>
              <div className="flex justify-between items-end mb-4 px-1">
                <h2 className="text-[17px] font-black text-slate-800 tracking-tight">Produk Top</h2>
                <Link href="/layanan" className="text-[11px] font-bold text-orange-500 hover:text-orange-600 transition flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
                  Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {visibleProducts.map((product, idx) => {
                  const matched = dbServices.find((s: any) => s.name.toLowerCase() === product.name.toLowerCase())
                  const displayPrice = matched ? new Intl.NumberFormat("id-ID").format(matched.price) : product.defaultPrice
                  const customStatus = matched?.customStatus
                  const IconComp = product.icon
                  const BadgeIcon = product.badgeIcon

                  return (
                    <Link key={idx} href={product.link} className="group bg-white rounded-3xl p-3 md:p-4 shadow-sm border border-slate-100 hover:shadow-md hover:border-orange-200 transition-all duration-300 flex flex-col active:scale-[0.98]">
                      <div className={`aspect-[4/3] bg-slate-50 rounded-[1.2rem] mb-3 overflow-hidden relative flex items-center justify-center ${product.hoverBg} transition-colors`}>
                        <div className={`absolute top-2 right-2 ${product.badgeClass} text-[9px] font-black px-2 py-0.5 rounded-md flex items-center gap-0.5 z-10 shadow-sm`}>
                          <BadgeIcon size={8} className="fill-current" /> {product.badge}
                        </div>
                        <IconComp className={`w-10 h-10 text-slate-300 ${product.hoverIcon} group-hover:scale-110 transition-all duration-500`} strokeWidth={1.5} />
                      </div>
                      <h3 className="text-[13px] md:text-[14px] font-extrabold text-slate-800 line-clamp-1 group-hover:text-orange-600 transition-colors">{product.name}</h3>
                      {customStatus ? (
                        <p className="text-[10px] text-red-500 font-bold mb-2">{customStatus}</p>
                      ) : (
                        <p className="text-[10px] text-slate-400 font-medium mb-2">Mulai Rp {displayPrice}</p>
                      )}
                      <div className="mt-auto bg-slate-900 text-white text-[11px] font-bold py-2 rounded-xl text-center group-hover:bg-orange-500 transition-colors">
                        Pesan Sekarang
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })()}

        {/* ================= KARYA UNGGULAN (PORTFOLIO) ================= */}
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100 mb-6">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h2 className="text-[17px] font-black text-slate-800">Karya Terbaik</h2>
              <p className="text-[11px] font-bold text-slate-400 mt-0.5">Inspirasi desain terkini</p>
            </div>
            <Link href="/portfolio" className="text-[11px] font-bold text-slate-400 hover:text-orange-500 transition-colors">Lihat Semua</Link>
          </div>

          <div className="flex flex-col gap-2.5">
            {works.length > 0 ? works.map((item) => (
              <Link key={item.id} href="/portfolio" className="group flex items-center justify-between p-2.5 rounded-[1.2rem] border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all active:scale-[0.98]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-amber-50 group-hover:text-amber-500 transition-colors shrink-0">
                    <Crown size={18} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-extrabold text-slate-800 mb-0.5 line-clamp-1">{item.title}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {item.duration_text}
                    </div>
                  </div>
                </div>
                <div className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-1 rounded-md border border-amber-100 shrink-0">
                  {item.badge}
                </div>
              </Link>
            )) : (
              <div className="text-center py-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-[12px] text-slate-400 font-bold">Belum ada data portfolio</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 3. MODAL "LAINNYA" (iOS Bottom Sheet Style) */}
      {showAllShortcuts && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] p-6 shadow-2xl w-full max-w-[400px] animate-in slide-in-from-bottom-10 duration-300">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6" />

            <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 leading-tight">Menu Utama</h2>
                <p className="text-xs font-semibold text-slate-500 mt-1">Jelajahi semua fitur aplikasi</p>
              </div>
              <button onClick={() => setShowAllShortcuts(false)} className="bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-colors rounded-full p-2">
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { icon: Palette, label: "Layanan", color: "orange", link: "/layanan" },
                { icon: Tag, label: "Paket", color: "purple", link: "/paket" },
                { icon: Briefcase, label: "Karya", color: "blue", link: "/portfolio" },
                { icon: Camera, label: "Studio", color: "emerald", link: "/frames" },
                { icon: Sparkles, label: "Ecosystem", color: "emerald", link: "/ecosystem/lead-finder" }
              ].map((item, idx) => (
                <Link key={idx} href={item.link} className={`group flex flex-col items-center gap-2 p-2 hover:bg-${item.color}-50 rounded-2xl transition-all active:scale-95`}>
                  <div className={`w-14 h-14 bg-slate-50 text-slate-600 rounded-[1.2rem] flex items-center justify-center group-hover:bg-${item.color}-100 group-hover:text-${item.color}-600 transition-colors border border-slate-100`}>
                    <item.icon className="w-6 h-6" strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-extrabold text-slate-600 text-center">{item.label}</span>
                </Link>
              ))}
            </div>

            <button onClick={() => setShowAllShortcuts(false)} className="w-full py-4 bg-slate-900 text-white font-extrabold rounded-[1.2rem] text-[13px] active:scale-95 outline-none">
              Tutup Menu
            </button>
          </div>
        </div>
      )}

    </div>
  )
}