"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileText, ChevronRight, CalendarDays, Loader2, Newspaper } from "lucide-react"

interface NewsItem {
  id: number
  title: string
  slug: string
  category: string
  excerpt: string
  image_url: string
  created_at: string
}

export default function BeritaSection() {
  const [articles, setArticles] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setArticles(json.data)
        }
      })
      .catch((err) => console.error("Failed to load news:", err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="berita" className="relative py-20 lg:py-28 overflow-hidden">
      
      {/* Decorative Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-[120px]" />
        <div className="absolute bottom-[10%] -left-[10%] w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest text-orange-600 dark:text-orange-400 mx-auto">
            <Newspaper size={14} />
            Berita & Update
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-tight">
            Artikel & {" "}
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
              Update Rilis
            </span>
          </h2>
          
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
            Jelajahi catatan pembaruan terbaru, panduan fitur, dan portofolio desain.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="text-orange-500 animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white/50 dark:bg-slate-900/20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm flex flex-col items-center justify-center backdrop-blur-sm max-w-4xl mx-auto">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <FileText size={32} className="text-slate-400 dark:text-slate-500" />
            </div>
            <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300">
              Belum Ada Artikel Diterbitkan
            </h4>
            <p className="text-sm text-slate-500 mt-2">
              Nantikan berita dan pembaruan yang akan datang.
            </p>
          </div>
        ) : (
          /* Articles Grid */
          <div className="grid gap-6 md:gap-8 max-w-4xl mx-auto">
            {articles.map((article) => (
              <div
                key={article.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl sm:rounded-[2rem] p-5 sm:p-6 md:p-8 shadow-lg shadow-slate-200/20 dark:shadow-black/40 hover:shadow-2xl hover:shadow-orange-200/20 dark:hover:shadow-black/60 hover:-translate-y-1 transition-all duration-500 flex flex-col sm:flex-row gap-5 sm:gap-8 items-stretch overflow-hidden relative"
              >
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Thumbnail Image */}
                {article.image_url && (
                  <div className="sm:w-2/5 md:w-1/3 relative aspect-video sm:aspect-auto rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 shrink-0 shadow-inner z-10">
                    <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent opacity-0 group-hover:opacity-40 transition-opacity duration-500 z-10 mix-blend-overlay" />
                    <img 
                      src={article.image_url} 
                      alt={article.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                  </div>
                )}
                
                {/* Content Area */}
                <div className="flex flex-col justify-between flex-1 w-full z-10">
                  <div className="space-y-3 sm:space-y-4">
                    
                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-200/50 dark:border-orange-500/20">
                        {article.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        <CalendarDays size={12} />
                        {new Date(article.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </div>
                    </div>
                    
                    {/* Title & Excerpt */}
                    <div className="space-y-2">
                      <h4 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-orange-500 transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                        {article.excerpt || "Tidak ada deskripsi singkat."}
                      </p>
                    </div>
                  </div>

                  {/* Read More */}
                  <div className="pt-4 sm:pt-6 mt-3 sm:mt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <span
                      className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 group-hover:bg-orange-500 group-hover:text-white dark:group-hover:bg-orange-500 text-[10px] sm:text-[11px] font-black uppercase tracking-widest rounded-xl shadow-md transition-all duration-300 group-hover:-translate-y-0.5 cursor-default"
                    >
                      Baca Artikel
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
