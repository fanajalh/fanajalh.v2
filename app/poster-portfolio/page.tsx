"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { 
  ArrowLeft, Search, X, Instagram, Filter, ExternalLink, Sparkles, 
  ShoppingCart, Share2, ArrowRight, ShoppingBag
} from "lucide-react"
import FadeIn from "@/components/ui/FadeIn"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export default function PosterPortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("Semua")
  const [searchQuery, setSearchQuery] = useState("")

  // Product detail modal state
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

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

  const openProductDetail = (product: any) => {
    setSelectedProduct(product)
    setActiveImageIndex(0)
    document.body.style.overflow = "hidden"
  }

  const closeProductDetail = () => {
    setSelectedProduct(null)
    document.body.style.overflow = "auto"
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-24 selection:bg-orange-500/25 selection:text-orange-500">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-6 h-[76px] flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-bold text-sm"
          >
            <ArrowLeft size={18} />
            Kembali
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-extrabold tracking-tight text-sm">
              Fanajalah <span className="text-orange-500">Design</span>
            </span>
          </div>
        </div>
      </nav>
 
      <main className="max-w-7xl mx-auto px-6 mt-12 lg:mt-20">
        {/* Header */}
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 text-orange-600 text-xs font-bold uppercase tracking-wider rounded-full border border-orange-100/50 dark:border-orange-900/30">
              <Sparkles size={14} className="animate-pulse" />
              Creative Gallery
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
              Katalog Template <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Desain Poster</span>
            </h1>
            <p className="text-base md:text-lg text-slate-550 dark:text-slate-400 font-medium leading-relaxed">
              Temukan berbagai template poster digital premium mulai dari template poster event, konser, promosi bisnis, infografis, hingga media sosial.
            </p>
          </div>
        </FadeIn>
 
        {/* Filter and Search Bar */}
        <FadeIn delay={0.1}>
          <div className="flex flex-col md:flex-row gap-5 items-center justify-between mb-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-5 rounded-[2rem] shadow-sm shadow-slate-100 dark:shadow-none">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-2xl border ${
                    activeCategory === cat
                      ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-transparent shadow-md shadow-orange-500/10"
                      : "bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-450 border-slate-100 dark:border-slate-900 hover:border-orange-500/50 hover:text-orange-500"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
 
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={18} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari desain..."
                className="w-full pl-10 pr-4 py-3 text-xs bg-[#f8fafc] dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-850 rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all uppercase placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500"
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
            <div className="w-12 h-12 border-4 border-slate-100 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm flex flex-col items-center justify-center">
            <Filter size={40} className="text-slate-400 mb-4" />
            <h4 className="text-lg font-bold uppercase tracking-wider text-slate-500">
              Karya Tidak Ditemukan
            </h4>
            <p className="text-xs text-slate-400 mt-2">
              Cobalah kategori lain atau ubah kata kunci pencarian Anda.
            </p>
          </div>
        ) : (
          <FadeIn delay={0.2}>
            {/* Lynk.id style product grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {filteredItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => openProductDetail(item)}
                  className="group bg-orange-50/5 dark:bg-slate-900 cursor-pointer transition-all duration-300 rounded-[2rem] border border-slate-150 dark:border-slate-900 hover:border-orange-500/50 flex flex-col overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1"
                >
                  {/* Image Container with Canva Badge */}
                  <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-950 p-2">
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                      <Image
                        src={item.image ? item.image.split("|")[0] : "/ucapan.png"}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        quality={80}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* Canva overlay badge */}
                      <div className="absolute bottom-3 right-3 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#7d2ae8] to-[#00c4cc] border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-md">
                        <span className="text-[8px] sm:text-[9px] font-black text-white italic tracking-tight">Canva</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer - Lynk.id style */}
                  <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-850 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white group-hover:text-orange-500 transition-colors truncate">
                          {item.title} {!item.title.includes("✨") && "✨"}
                        </h3>
                        <span className={`text-[8px] sm:text-[9px] font-black uppercase shrink-0 ${
                          item.stock === 0 ? "text-rose-600" : item.stock <= 5 ? "text-orange-500" : "text-emerald-600"
                        }`}>
                          {item.stock === 0 ? "Habis" : item.stock <= 5 ? "Sisa" : `Stok: ${item.stock ?? 10}`}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-xs sm:text-sm font-black text-orange-500">
                          IDR {new Intl.NumberFormat("id-ID").format(item.price_discount || 10000)}
                        </div>
                        <div className="text-[10px] sm:text-xs font-semibold text-slate-400 line-through">
                          IDR {new Intl.NumberFormat("id-ID").format(item.price_original || 15000)}
                        </div>
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
          <div className="mt-24 p-10 md:p-14 bg-gradient-to-br from-orange-500/5 to-amber-500/5 border border-slate-100 dark:border-slate-900 text-center relative overflow-hidden rounded-[2.5rem] shadow-sm">
            <div className="relative z-10 space-y-6">
              <Instagram className="w-12 h-12 text-orange-500 mx-auto transition-transform hover:rotate-12 duration-350" />
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                Behind the Scenes & Inspirasi
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
                Ikuti Instagram kami untuk melihat proses kreatif dan portfolio desain terbaru setiap harinya.
              </p>
              <a
                href="https://www.instagram.com/fan_ajalah"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-md shadow-orange-500/10 hover:scale-105 active:scale-95"
              >
                Follow @fan_ajalah
              </a>
            </div>
          </div>
        </FadeIn>
      </main>
 
      {/* ================= PRODUCT DETAIL MODAL (LYNK.ID STYLE) ================= */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm p-4 transition-all duration-300"
          onClick={closeProductDetail}
        >
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-md bg-[#f4f6f9] dark:bg-slate-955 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
              <button
                onClick={closeProductDetail}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white border border-slate-150 dark:border-slate-700/60 active:scale-90 transition-all"
              >
                <ArrowLeft size={16} strokeWidth={2.5} />
              </button>
              <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Detail Produk</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/payment?package=custom&title=${encodeURIComponent(selectedProduct.title)}&image=${encodeURIComponent(selectedProduct.image)}`)
                    toast.success("Tautan produk disalin!")
                  }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-500 border border-slate-150 dark:border-slate-700/60 hover:text-orange-500"
                >
                  <Share2 size={16} />
                </button>
                <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 text-slate-500 border border-slate-150 dark:border-slate-700/60">
                  <ShoppingBag size={16} />
                </button>
              </div>
            </div>
 
            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              
              {/* Product Big Image Box with Canva badge */}
              <div className="bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-850 rounded-[2rem] shadow-sm flex flex-col items-center justify-center gap-4">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                  <Image
                    src={selectedProduct.image ? selectedProduct.image.split("|")[activeImageIndex] : "/ucapan.png"}
                    alt={selectedProduct.title}
                    fill
                    className="object-cover"
                  />
                  {/* Canva logo overlay */}
                  <div className="absolute bottom-4 right-4 z-10 w-12 h-12 rounded-full bg-gradient-to-tr from-[#7d2ae8] to-[#00c4cc] border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-lg">
                    <span className="text-[10px] font-black text-white italic tracking-tight">Canva</span>
                  </div>
                </div>

                {/* Thumbnails list if there are multiple images */}
                {selectedProduct.image && selectedProduct.image.split("|").filter(Boolean).length > 1 && (
                  <div className="flex flex-wrap justify-center gap-2 w-full">
                    {selectedProduct.image.split("|").filter(Boolean).map((imgUrl: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                          activeImageIndex === idx
                            ? "border-orange-500 scale-105 shadow-md shadow-orange-500/10"
                            : "border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imgUrl} alt={`thumbnail-${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
 
              {/* Title & Price Box */}
              <div className="bg-white dark:bg-slate-900 p-6 border border-slate-100 dark:border-slate-850 rounded-[2rem] shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="text-[17px] font-extrabold text-slate-855 dark:text-white">
                    {selectedProduct.title} {!selectedProduct.title.includes("✨") && "✨"}
                  </h3>
                  <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${
                    selectedProduct.stock === 0 ? "text-rose-600 font-extrabold" : selectedProduct.stock <= 5 ? "text-orange-500 font-extrabold" : "text-slate-400 dark:text-slate-550"
                  }`}>
                    Status: {selectedProduct.stock === 0 ? "Habis" : selectedProduct.stock <= 5 ? `Sisa Sedikit (${selectedProduct.stock})` : `Tersedia (Stok: ${selectedProduct.stock ?? 10})`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 line-through">
                    IDR {new Intl.NumberFormat("id-ID").format(selectedProduct.price_original || 15000)}
                  </p>
                  <p className="text-xl font-black text-orange-500 mt-0.5">
                    IDR {new Intl.NumberFormat("id-ID").format(selectedProduct.price_discount || 10000)}
                  </p>
                </div>
              </div>
 
              {/* Description Box */}
              <div className="bg-white dark:bg-slate-900 p-6 border border-slate-100 dark:border-slate-850 rounded-[2rem] shadow-sm space-y-2.5">
                <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Description</h4>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-350 leading-relaxed space-y-2">
                  <p className="text-slate-850 dark:text-white uppercase font-extrabold">HALO, SELAMAT DATANG DI FANAJAH DESIGN ✨</p>
                  <p>
                    {selectedProduct.description || 
                      `Template ini dirancang khusus untuk kebutuhan ${selectedProduct.title}. Didesain dengan visual eksklusif yang elegan, sangat cocok untuk branding instan.`
                    }
                  </p>
                  <p>
                    Template ini sepenuhnya dapat diedit dengan mudah menggunakan Canva (akun gratis/pro) atau Photoshop (PSD).
                  </p>
                </div>
              </div>
 
            </div>
 
            {/* Modal Footer / Bottom Sticky Bar */}
            <div className="px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3.5">
              <button 
                onClick={() => {
                  toast.success("Ditambahkan ke keranjang!")
                }}
                className="w-14 h-14 rounded-2xl border border-orange-500/40 hover:border-orange-500 text-orange-500 flex items-center justify-center transition-colors shrink-0"
              >
                <ShoppingCart size={20} strokeWidth={2.5} />
              </button>
              
              {selectedProduct.stock === 0 ? (
                <button
                  disabled
                  className="flex-1 h-14 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 font-extrabold text-sm uppercase tracking-wider rounded-2xl flex items-center justify-center cursor-not-allowed"
                >
                  Stok Habis
                </button>
              ) : (
                <Link
                  href={`/payment?package=custom_template&title=${encodeURIComponent(selectedProduct.title)}&image=${encodeURIComponent(selectedProduct.image ? selectedProduct.image.split("|")[0] : "/ucapan.png")}&price=${selectedProduct.price_discount || 10000}`}
                  className="flex-1 h-14 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm uppercase tracking-wider rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/15 active:scale-95 transition-all duration-300"
                  onClick={() => {
                    closeProductDetail()
                  }}
                >
                  I Want This
                </Link>
              )}
            </div>
 
          </motion.div>
        </div>
      )}
 
    </div>
  )
}
