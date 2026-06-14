"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { MobileHeader } from "@/components/MobileHeader"
import { Filter, X, Instagram } from "lucide-react"

export default function PortfolioPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")
  const [selectedTitle, setSelectedTitle] = useState("")
  const [activeCategory, setActiveCategory] = useState("Semua")

  const [portfolioItems, setPortfolioItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await fetch("/api/admin/portfolio-designs", { cache: "no-store" })
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

  const categories = ["Semua", ...new Set(portfolioItems.map((item) => item.category))]

  const filteredItems = activeCategory === "Semua" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory)

  const openModal = (imageSrc: string, title: string) => {
    setSelectedImage(imageSrc)
    setSelectedTitle(title)
    setIsModalOpen(true)
    document.body.style.overflow = 'hidden' 
  }

  const closeModal = () => {
    setIsModalOpen(false)
    document.body.style.overflow = 'auto'
  }

  return (
    <div className="bg-white min-h-screen font-sans pb-24 w-full">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex justify-center">
        <div className="w-full max-w-6xl">
          <MobileHeader title="Karya Kami" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full">
      {/* Description & Instagram Link */}
      <div className="px-5 pt-6 pb-4">
        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Katalog Karya</h2>
        <p className="text-[13px] font-medium text-gray-500 mt-1 mb-4 leading-relaxed">
          Eksplorasi kumpulan desain terbaik kami. Untuk update terbaru, jangan ragu untuk mengunjungi Instagram resmi kami.
        </p>
        <a 
          href="https://www.instagram.com/fan_ajalah" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center gap-2 max-w-max bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-orange-100 transition-colors"
        >
          <Instagram size={16} /> @fan_ajalah
        </a>
      </div>

      {/* Filter Categories */}
      <div className="px-5 mb-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap shadow-sm border ${
                activeCategory === cat 
                ? "bg-gray-900 text-white border-gray-900" 
                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50 hover:text-orange-600 hover:border-orange-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      ) : (
      <div className="px-5 pb-6 mt-4">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              onClick={() => openModal(item.image, item.title)}
              className="group relative break-inside-avoid rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all border border-gray-100 bg-gray-50"
            >
              {/* Image Aspect ratio simulation */}
              <div className={`relative w-full h-48 md:h-56`}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Category Badge overlaying image */}
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-md text-gray-900 px-2.5 py-1 rounded-lg text-[9px] font-black shadow-sm uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>

                {/* Dark Gradient Overlay for text at bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                   <p className="text-white text-sm font-bold line-clamp-1">{item.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      )}
      </div>

      {/* Modal Lightbox */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/95 backdrop-blur-md p-5 animate-in fade-in duration-200"
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-lg md:max-w-2xl flex flex-col items-center animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action Bar */}
            <div className="w-full flex justify-between items-center mb-4">
              <h3 className="text-white font-extrabold text-lg line-clamp-1 flex-1 pr-4">{selectedTitle}</h3>
              <button
                onClick={closeModal}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Image Preview */}
            <div className="w-full relative aspect-[3/4] bg-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-700">
               {/* Gunakan unoptimized object-contain untuk menghindari bug gambar layout */}
              <img
                  src={selectedImage}
                  alt={selectedTitle}
                  className="w-full h-full object-contain"
              />
            </div>
            
            <button
               onClick={closeModal} 
               className="mt-6 font-bold text-orange-500 bg-orange-500/10 px-6 py-2.5 rounded-xl hover:bg-orange-500/20 transition-colors"
            >
              Tutup Preview
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
