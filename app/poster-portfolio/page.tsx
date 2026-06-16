"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Search, X, Instagram, Filter, ExternalLink, Sparkles, MessageCircle } from "lucide-react"
import FadeIn from "@/components/ui/FadeIn"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function PosterPortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("Semua")
  const [searchQuery, setSearchQuery] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")
  const [selectedTitle, setSelectedTitle] = useState("")

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch("/api/admin/portfolio-designs", { cache: "no-store" })
        const json = await res.json()
        setPortfolioItems(json.data || [])
      } catch (error) {
        console.error("Failed to fetch portfolio designs", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPortfolio()
  }, [])

  const categories = ["Semua", ...new Set(portfolioItems.map((item) => item.category))]

  const filteredItems = portfolioItems.filter((item) => {
    const matchesCategory = activeCategory === "Semua" || item.category === activeCategory
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

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

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pb-24 selection:bg-orange-500 selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors font-bold text-sm"
          >
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2 border-l border-gray-200 dark:border-white/10 pl-3">
              <span className="font-black tracking-tight text-sm uppercase">
                AllFanajalh <span className="text-orange-500">Design</span>
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-16 lg:mt-24">
        {/* Header */}
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-widest border border-orange-200 dark:border-orange-500/20">
              <Sparkles size={14} />
              Creative Gallery
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-black dark:text-white uppercase leading-[1.05]">
              Katalog Joki <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">Desain Poster</span>
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
              Temukan berbagai karya poster digital premium mulai dari poster event, konser, promosi bisnis, infografis, hingga media sosial.
            </p>
          </div>
        </FadeIn>

        {/* Filter and Search Bar */}
        <FadeIn delay={0.1}>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-12 bg-gray-50 dark:bg-white/5 border border-gray-250 dark:border-white/10 p-4">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                    activeCategory === cat
                      ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
                      : "bg-white dark:bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-black dark:hover:border-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari desain..."
                className="w-full pl-10 pr-4 py-3 text-xs bg-white dark:bg-black text-black dark:text-white border border-gray-200 dark:border-white/10 font-bold focus:outline-none focus:border-black dark:focus:border-white transition-all uppercase placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </FadeIn>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="w-12 h-12 border-4 border-gray-200 dark:border-white/10 border-t-black dark:border-t-white rounded-full animate-spin"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex flex-col items-center justify-center">
            <Filter size={40} className="text-gray-400 mb-4" />
            <h4 className="text-lg font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Karya Tidak Ditemukan
            </h4>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Cobalah kategori lain atau ubah kata kunci pencarian Anda.
            </p>
          </div>
        ) : (
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-gray-200 dark:border-white/10">
              {filteredItems.map((item, index) => (
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
          </FadeIn>
        )}

        {/* CTA Instagram */}
        <FadeIn delay={0.3}>
          <div className="mt-24 p-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-center relative overflow-hidden">
            <div className="relative z-10">
              <Instagram className="w-12 h-12 text-black dark:text-white mx-auto mb-6 transition-colors" />
              <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-4">
                Behind the Scenes & Inspirasi
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-xl mx-auto font-medium">
                Ikuti Instagram kami untuk melihat proses kreatif dan portfolio desain terbaru setiap harinya.
              </p>
              <a
                href="https://www.instagram.com/fan_ajalah"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-black dark:bg-white text-white dark:text-black hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white border border-black dark:border-white font-bold py-4 px-10 transition-all duration-300"
              >
                Follow @fan_ajalah
              </a>
            </div>
          </div>
        </FadeIn>
      </main>

      {/* Lightbox Modal */}
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
    </div>
  )
}
