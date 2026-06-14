"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Monitor, Smartphone, ExternalLink, Github, Code2, Sparkles } from "lucide-react"
import FadeIn from "@/components/ui/FadeIn"

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

  const filteredItems = filter === "All" ? portfolioItems : portfolioItems.filter(item => item.category === filter)

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
            <span className="font-bold tracking-tight">Fanz Tech <span className="text-orange-500">Dev</span></span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-16 lg:mt-24">
        
        {/* Header */}
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-widest border border-orange-200 dark:border-orange-500/20">
              <Sparkles size={14} />
              Our Showcase
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-black dark:text-white">
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
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                  filter === cat 
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/10 scale-105" 
                  : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10"
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
            <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => {
            const techs = item.tech ? item.tech.split(',') : [];
            return (
            <FadeIn key={item.id} delay={0.1 + (index * 0.1)}>
              <div className="group relative bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                
                {/* Image Section */}
                <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-white/5">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color || 'from-gray-500 to-gray-700'} opacity-20 group-hover:opacity-40 transition-opacity z-10 mix-blend-overlay`} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 z-20 flex gap-2">
                    <span className="bg-white/90 dark:bg-black/90 backdrop-blur-sm text-black dark:text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                      {item.category === "Web" ? <Monitor size={12} /> : <Smartphone size={12} />}
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <p className="text-xs font-bold text-orange-500 mb-2 uppercase tracking-widest">{item.type}</p>
                  <h3 className="text-xl font-bold text-black dark:text-white mb-3 group-hover:text-orange-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed flex-1 font-medium">
                    {item.description}
                  </p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {techs.map((t: string) => (
                      <span key={t} className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 text-[10px] font-bold">
                        {t.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-white/10 mt-auto">
                    {item.link ? (
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-xs font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    ) : (
                      <button disabled className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-600 rounded-xl text-xs font-bold cursor-not-allowed">
                        <ExternalLink size={14} /> No Demo
                      </button>
                    )}
                    
                    {item.github_link ? (
                      <a href={item.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-white/10 transition-colors" title="View Source">
                        <Github size={16} />
                      </a>
                    ) : (
                      <button disabled className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-gray-700 cursor-not-allowed" title="No Source">
                        <Github size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>
          )})}
        </div>
        )}

        {/* CTA Section */}
        <FadeIn delay={0.4}>
          <div className="mt-24 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-orange-500 to-rose-600 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black mb-4">Punya Ide Aplikasi Hebat?</h2>
              <p className="text-orange-100 mb-8 font-medium">
                Mari wujudkan visi Anda menjadi produk digital nyata yang siap digunakan. Konsultasikan kebutuhan Anda sekarang juga.
              </p>
              <a 
                href="https://wa.me/6285133737623?text=Halo,%20saya%20tertarik%20untuk%20membuat%20aplikasi/website"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-orange-600 hover:bg-gray-50 px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-xl shadow-black/10"
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
