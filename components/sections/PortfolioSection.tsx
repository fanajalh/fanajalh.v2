"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  Palette, Code2, Search, X, Monitor, Smartphone, 
  ExternalLink, Github, ArrowRight, Sparkles 
} from "lucide-react"



export default function PortfolioSection() {
  const [activeTab, setActiveTab] = useState<"design" | "dev">("design")
  
  // Design items
  const [designItems, setDesignItems] = useState<any[]>([])
  const [designLoading, setDesignLoading] = useState(true)
  
  // Dev items
  const [devItems, setDevItems] = useState<any[]>([])
  const [devLoading, setDevLoading] = useState(true)

  // Lightbox modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")
  const [selectedTitle, setSelectedTitle] = useState("")

  useEffect(() => {
    // Fetch design posters
    const fetchDesign = async () => {
      try {
        const res = await fetch("/api/admin/portfolio-designs", { cache: "no-store" })
        const json = await res.json()
        setDesignItems(json.data || [])
      } catch (error) {
        console.error("Failed to fetch design portfolio", error)
      } finally {
        setDesignLoading(false)
      }
    }
    
    // Fetch dev projects
    const fetchDev = async () => {
      try {
        const res = await fetch("/api/admin/portfolio-dev", { cache: "no-store" })
        const json = await res.json()
        setDevItems(json.data || [])
      } catch (error) {
        console.error("Failed to fetch dev portfolio", error)
      } finally {
        setDevLoading(false)
      }
    }

    fetchDesign()
    fetchDev()
  }, [])

  const openModal = (imageSrc: string, title: string) => {
    setSelectedImage(imageSrc)
    setSelectedTitle(title)
    setIsModalOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = "auto"
  }

  // Slice limits for home preview
  const displayDesigns = designItems.slice(0, 6)
  const displayDevs = devItems.slice(0, 3)

  return (
    <section id="portfolio" className="relative py-24 lg:py-32 bg-white dark:bg-black overflow-hidden border-t border-gray-200 dark:border-white/10 selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),dark:linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 text-xs font-bold mb-2 uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5 text-black dark:text-white" />
            <span className="text-black dark:text-white">Our Works</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tight uppercase">
            Portfolio Kami
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Kumpulan hasil karya desain kreatif terbaik dan solusi website/aplikasi mobile modern yang kami kembangkan.
          </p>
        </div>

        {/* Unified Neo-Brutalist Tabs */}
        <div className="flex justify-center gap-4 mb-16 relative z-20">
          <button
            onClick={() => setActiveTab("design")}
            className={`flex items-center gap-3 px-10 py-5 font-black text-sm sm:text-base uppercase tracking-widest transition-all duration-300 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 ${
              activeTab === "design"
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "bg-white dark:bg-black text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <Palette size={22} />
            Desain Poster
          </button>
          <button
            onClick={() => setActiveTab("dev")}
            className={`flex items-center gap-3 px-10 py-5 font-black text-sm sm:text-base uppercase tracking-widest transition-all duration-300 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 ${
              activeTab === "dev"
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "bg-white dark:bg-black text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
            }`}
          >
            <Code2 size={22} />
            Web & Aplikasi
          </button>
        </div>

        {/* Active Tab Content */}
        {activeTab === "design" ? (
          /* TAB 1: DESAIN POSTER (Joki Poster Showcase) */
          <div>
            {designLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-gray-200 dark:border-white/10 border-t-black dark:border-t-white rounded-full animate-spin"></div>
              </div>
            ) : displayDesigns.length === 0 ? (
              <div className="text-center py-20 border border-gray-200 dark:border-white/10 bg-white dark:bg-black/5 flex flex-col items-center justify-center">
                <Palette size={36} className="text-gray-400 mb-4" />
                <h4 className="text-base font-bold uppercase tracking-wider text-gray-500">Belum Ada Desain</h4>
                <p className="text-xs text-gray-400 mt-2">Daftar karya desain poster akan tampil di sini.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-gray-200 dark:border-white/10 mb-16 animate-in fade-in duration-500">
                  {displayDesigns.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => openModal(item.image, item.title)}
                      className="group relative bg-white dark:bg-black cursor-pointer transition-all duration-500 border-r border-b border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 flex flex-col"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-white/5 border-b border-gray-200 dark:border-white/10">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          quality={80}
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-white/80 dark:bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                          <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500 bg-black dark:bg-white text-white dark:text-black w-14 h-14 flex items-center justify-center">
                            <Search className="w-6 h-6" />
                          </div>
                        </div>

                        {/* Category Tag */}
                        <div className="absolute top-5 left-5 z-20">
                          <span className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 text-black dark:text-white px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                            {item.category}
                          </span>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="p-6 bg-transparent flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-black dark:text-white mb-2 group-hover:underline decoration-2 underline-offset-4 transition-all">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 font-medium">
                            {item.description}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="w-8 h-8 border border-gray-200 dark:border-white/10 flex items-center justify-center text-black dark:text-white group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors">
                            <ExternalLink size={14} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View All Designs Button */}
                <div className="text-center">
                  <Link
                    href="/poster-portfolio"
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white border-2 border-black dark:border-white font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Lihat Semua Desain Poster
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </>
            )}
          </div>
        ) : (
          /* TAB 2: WEB & APLIKASI (Developer Portfolio) */
          <div>
            {devLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-gray-200 dark:border-white/10 border-t-black dark:border-t-white rounded-full animate-spin"></div>
              </div>
            ) : displayDevs.length === 0 ? (
              <div className="text-center py-20 border border-gray-200 dark:border-white/10 bg-white dark:bg-black/5 flex flex-col items-center justify-center">
                <Code2 size={36} className="text-gray-400 mb-4" />
                <h4 className="text-base font-bold uppercase tracking-wider text-gray-500">Belum Ada Project</h4>
                <p className="text-xs text-gray-400 mt-2">Daftar project web & aplikasi akan tampil di sini.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-gray-200 dark:border-white/10 mb-16 animate-in fade-in duration-500">
                  {displayDevs.map((item) => {
                    const techs = item.tech ? item.tech.split(",") : []
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

                {/* View All Dev Projects Button */}
                <div className="text-center">
                  <Link
                    href="/dev-portfolio"
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-black dark:bg-white text-white dark:text-black hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white border-2 border-black dark:border-white font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  >
                    Lihat Semua Project Dev
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </>
            )}
          </div>
        )}

      </div>

      {/* Lightbox Modal (Design Tab Only) */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[150] flex items-center justify-center bg-white/95 dark:bg-black/95 backdrop-blur-md p-4 transition-all duration-500"
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-4xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              aria-label="Tutup modal"
              onClick={closeModal}
              className="absolute -top-12 right-0 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 bg-white dark:bg-black border border-gray-200 dark:border-white/10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-4 shadow-2xl">
              <div className="relative aspect-[3/4] md:aspect-auto md:h-[70vh] w-full bg-gray-50 dark:bg-white/5 overflow-hidden border border-gray-100 dark:border-white/5">
                <Image
                  src={selectedImage}
                  alt={selectedTitle}
                  fill
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  quality={90}
                  className="object-contain"
                />
              </div>
              <div className="py-6 px-4 text-center border-t border-gray-100 dark:border-white/5 mt-4">
                <h3 className="text-xl font-bold text-black dark:text-white">{selectedTitle}</h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
