"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Monitor, Smartphone, ExternalLink, Github, Code2, ArrowRight } from "lucide-react"

export default function DevPortfolioSection() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("/api/admin/portfolio-dev", { cache: "no-store" })
        const json = await res.json()
        setItems((json.data || []).slice(0, 3)) // Show only top 3
      } catch (error) {
        console.error("Failed to fetch dev portfolio", error)
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  if (items.length === 0 && !loading) return null;

  return (
    <section className="relative py-24 bg-gray-50 dark:bg-white/5 border-t border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-black border border-gray-200 dark:border-white/10 px-4 py-2 text-xs font-bold mb-2 uppercase tracking-[0.2em] shadow-sm">
            <Code2 className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-black dark:text-white">Tech Solutions</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-black dark:text-white tracking-tight">
            Web & Mobile Apps
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Produk digital berupa website interaktif dan aplikasi mobile yang siap mengeskalasi bisnis Anda ke level selanjutnya.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {items.map((item, index) => {
              const techs = item.tech ? item.tech.split(',') : [];
              return (
              <div key={item.id} className="group relative bg-white dark:bg-black border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full">
                
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
                  <h3 className="text-xl font-bold text-black dark:text-white mb-3 group-hover:text-orange-500 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed flex-1 font-medium">
                    {item.description}
                  </p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {techs.slice(0, 3).map((t: string) => (
                      <span key={t} className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 text-[10px] font-bold">
                        {t.trim()}
                      </span>
                    ))}
                    {techs.length > 3 && <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 text-[10px] font-bold">+{techs.length - 3}</span>}
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
            )})}
          </div>
        )}

        <div className="text-center">
          <Link href="/dev-portfolio" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 font-bold text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm hover:shadow-md group">
            Lihat Semua Project <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  )
}
