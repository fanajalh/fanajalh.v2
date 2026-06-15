"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Monitor, Smartphone, ExternalLink, Github, Code2, Sparkles } from "lucide-react"
import FadeIn from "@/components/ui/FadeIn"

const DEFAULT_DEV_PORTFOLIO = [
  {
    id: "default-1",
    title: "Amanah E-Commerce & Custom CMS",
    category: "Web",
    type: "E-Commerce System",
    description: "Platform e-commerce modern dengan integrasi gerbang pembayaran otomatis, sinkronisasi stok real-time, dan dashboard admin kustom yang komprehensif.",
    tech: "Next.js, TailwindCSS, PostgreSQL, Midtrans",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80",
    color: "from-blue-500 to-indigo-600",
    link: "https://amanah-store.demo",
    github_link: "https://github.com/fanajah/amanah-store"
  },
  {
    id: "default-2",
    title: "Cafe Jakarta Reservasi App",
    category: "APK",
    type: "Mobile App",
    description: "Aplikasi mobile kustom untuk pemesanan meja, pre-order menu makanan, dan loyalitas pelanggan terintegrasi QR Code Scanner.",
    tech: "React Native, Node.js, Express, MongoDB",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80",
    color: "from-amber-500 to-orange-600",
    link: null,
    github_link: "https://github.com/fanajah/cafe-jakarta-app"
  },
  {
    id: "default-3",
    title: "Fanz ERP Business Dashboard",
    category: "Web",
    type: "Enterprise Solution",
    description: "Sistem perencanaan sumber daya perusahaan (ERP) internal untuk analitik real-time penjualan, inventarisasi pergudangan, dan keuangan.",
    tech: "React.js, Express, Chart.js, PostgreSQL",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
    color: "from-emerald-500 to-teal-600",
    link: "https://erp-dashboard.demo",
    github_link: null
  }
]

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("All")

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch("/api/admin/portfolio-dev", { cache: "no-store" })
        const json = await res.json()
        setPortfolioItems(json.data || [])
      } catch (error) {
        console.error("Failed to fetch portfolio", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPortfolio()
  }, [])

  const displayItems = portfolioItems
  const filteredItems = filter === "All" ? displayItems : displayItems.filter(item => item.category === filter)

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pb-24 selection:bg-orange-500 selection:text-white">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors font-semibold text-sm">
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-2">
            <Code2 size={20} className="text-orange-500" />
            <span className="font-bold tracking-tight">AllFanajalh <span className="text-orange-500">Dev</span></span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-16 lg:mt-24">
        
        {/* Header */}
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-widest border border-orange-200 dark:border-orange-500/20">
              <Sparkles size={14} />
              Our Showcase
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-black dark:text-white uppercase">
              Portofolio Web & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Aplikasi</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Kumpulan project pengembangan website dan aplikasi mobile yang telah kami selesaikan dengan teknologi modern dan desain yang memukau.
            </p>
          </div>
        </FadeIn>

        {/* Filters */}
        <FadeIn delay={0.1}>
          <div className="flex justify-center gap-3 mb-16">
            {["All", "Web", "APK"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-3 font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 border ${
                  filter === cat 
                  ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white" 
                  : "bg-white dark:bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-black dark:hover:border-white"
                }`}
              >
                {cat === "Web" && <Monitor size={16} />}
                {cat === "APK" && <Smartphone size={16} />}
                {cat === "All" && <Sparkles size={16} />}
                {cat === "All" ? "Semua Project" : cat === "Web" ? "Website" : "Aplikasi Mobile"}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 dark:border-white/10 border-t-black dark:border-t-white rounded-full animate-spin"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-black border border-gray-200 dark:border-white/10 flex flex-col items-center justify-center">
            <Code2 size={40} className="text-gray-400 mb-4" />
            <h4 className="text-lg font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Belum Ada Project</h4>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Semua project dev yang sedang dikerjakan akan tampil di sini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-gray-200 dark:border-white/10">
            {filteredItems.map((item, index) => {
              const techs = item.tech ? item.tech.split(',') : []
              return (
                <FadeIn key={item.id} delay={0.1 + (index * 0.05)}>
                  <div className="group relative bg-white dark:bg-black border-r border-b border-gray-200 dark:border-white/10 overflow-hidden hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-500 flex flex-col h-full">
                    
                    {/* Image Section */}
                    <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.color || 'from-gray-500 to-gray-700'} opacity-20 group-hover:opacity-35 transition-opacity z-10 mix-blend-overlay`} />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 z-20">
                        <span className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 text-black dark:text-white px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                          {item.category === "Web" ? <Monitor size={12} /> : <Smartphone size={12} />}
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 md:p-8 flex flex-col flex-1 bg-transparent justify-between">
                      <div>
                        <p className="text-[10px] font-black text-orange-500 mb-2 uppercase tracking-widest">{item.type}</p>
                        <h3 className="text-lg font-bold text-black dark:text-white mb-3 group-hover:underline decoration-2 underline-offset-4 transition-all line-clamp-1">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed font-medium">
                          {item.description}
                        </p>
                      </div>
                      
                      <div>
                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-1.5 mb-8">
                          {techs.map((t: string) => (
                            <span key={t} className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 text-[9px] font-bold uppercase tracking-wide">
                              {t.trim()}
                            </span>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-white/10 mt-auto">
                          {item.link ? (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white text-[10px] font-bold uppercase tracking-widest hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white transition-colors">
                              <ExternalLink size={12} /> Live Demo
                            </a>
                          ) : (
                            <button disabled className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-600 text-[10px] font-bold uppercase tracking-widest cursor-not-allowed">
                              <ExternalLink size={12} /> No Demo
                            </button>
                          )}
                          
                          {item.github_link ? (
                            <a href={item.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors" title="View Source">
                              <Github size={14} />
                            </a>
                          ) : (
                            <button disabled className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-300 dark:text-gray-700 cursor-not-allowed" title="No Source">
                              <Github size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              )
            })}
          </div>
        )}

        {/* CTA Section */}
        <FadeIn delay={0.3}>
          <div className="mt-24 p-8 md:p-12 bg-gradient-to-br from-orange-500 to-rose-600 text-white text-center relative overflow-hidden border border-orange-400">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black mb-4 uppercase">Punya Ide Aplikasi Hebat?</h2>
              <p className="text-orange-100 mb-8 font-medium">
                Mari wujudkan visi Anda menjadi produk digital nyata yang siap digunakan. Konsultasikan kebutuhan Anda sekarang juga.
              </p>
              <a 
                href="https://wa.me/6285133737623?text=Halo,%20saya%20tertarik%20untuk%20membuat%20aplikasi/website"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 font-bold text-xs uppercase tracking-widest transition-all"
              >
                Mulai Konsultasi Gratis
              </a>
            </div>
          </div>
        </FadeIn>

      </main>
    </div>
  )
}
