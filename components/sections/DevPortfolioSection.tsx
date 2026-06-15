"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Monitor, Smartphone, ExternalLink, Github, Code2, ArrowRight } from "lucide-react"

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

export default function DevPortfolioSection() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/admin/portfolio-dev", { cache: "no-store" })
        const json = await res.json()
        setItems(json.data || [])
      } catch (error) {
        console.error("Failed to fetch dev portfolio", error)
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  if (!loading && items.length === 0) {
    return null
  }

  const displayItems = items.slice(0, 3)

  return (
    <section id="dev-portfolio" className="relative py-24 lg:py-32 bg-white dark:bg-black overflow-hidden border-t border-gray-200 dark:border-white/10 selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 text-xs font-bold mb-2 uppercase tracking-[0.2em]">
            <Code2 className="w-3.5 h-3.5 text-black dark:text-white" />
            <span className="text-black dark:text-white">Tech Solutions</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tight">
            Web & Mobile Apps
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Produk digital berupa website interaktif dan aplikasi mobile yang siap mengeskalasi bisnis Anda ke level selanjutnya.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 dark:border-white/10 border-t-black dark:border-t-white rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-gray-200 dark:border-white/10 mb-16">
            {displayItems.map((item) => {
              const techs = item.tech ? item.tech.split(',') : []
              return (
                <div
                  key={item.id}
                  className="group relative bg-white dark:bg-black border-r border-b border-gray-200 dark:border-white/10 overflow-hidden hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-500 flex flex-col h-full"
                >
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
                        {techs.slice(0, 3).map((t: string) => (
                          <span
                            key={t}
                            className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 text-[9px] font-bold uppercase tracking-wide"
                          >
                            {t.trim()}
                          </span>
                        ))}
                        {techs.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 text-[9px] font-bold uppercase">
                            +{techs.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-white/10 mt-auto">
                        {item.link ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white text-[10px] font-bold uppercase tracking-widest hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white transition-colors"
                          >
                            <ExternalLink size={12} /> Live Demo
                          </a>
                        ) : (
                          <button
                            disabled
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-400 dark:text-gray-600 text-[10px] font-bold uppercase tracking-widest cursor-not-allowed"
                          >
                            <ExternalLink size={12} /> No Demo
                          </button>
                        )}

                        {item.github_link ? (
                          <a
                            href={item.github_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-black dark:text-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
                            title="View Source"
                          >
                            <Github size={14} />
                          </a>
                        ) : (
                          <button
                            disabled
                            className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-300 dark:text-gray-700 cursor-not-allowed"
                            title="No Source"
                          >
                            <Github size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="text-center">
          <Link
            href="/dev-portfolio"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white border border-black dark:border-white font-bold text-xs uppercase tracking-widest transition-all"
          >
            Lihat Semua Project <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  )
}
