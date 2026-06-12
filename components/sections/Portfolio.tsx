"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Search, Instagram, Filter, ExternalLink } from "lucide-react"

export default function Portfolio() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState("")
  const [selectedTitle, setSelectedTitle] = useState("")
  const [activeCategory, setActiveCategory] = useState("Semua")

  const portfolioItems = [
    { title: "Poster Edukasi Kesehatan", category: "Edukasi", image: "/TBC Fiks.png", description: "Infografis kampanye kesehatan TBC dengan tipografi modern." },
    { title: "Poster Promosi Cafe", category: "Promosi", image: "/promosi.png", description: "Desain estetik minimalis untuk promo menu baru." },
    { title: "Poster Ucapan Nasional", category: "Poster", image: "/flyer.png", description: "Visual elegan untuk perayaan hari besar nasional." },
    { title: "Social Media Branding", category: "Social Media", image: "/ucapan.png", description: "Template Instagram premium untuk konsistensi brand." },
    { title: "Banner Event Tech", category: "Print", image: "/Poster Seminar.png", description: "Desain futuristik untuk seminar teknologi & bisnis." },
    { title: "Data Infografis", category: "Edukasi", image: "/infografis.jpg", description: "Visualisasi data kompleks menjadi sangat mudah dibaca." },
  ]

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
    <section id="portfolio" className="relative py-24 lg:py-32 bg-white dark:bg-black overflow-hidden selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black">
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 text-xs font-bold mb-2 uppercase tracking-[0.2em]">
            <Filter className="w-3.5 h-3.5 text-black dark:text-white" />
            <span className="text-black dark:text-white">Showcase</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tight">
            Selected Works
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Koleksi karya desain terbaik kami yang telah membantu klien mencapai target bisnis mereka.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 text-sm font-bold transition-all duration-300 border ${
                activeCategory === cat 
                ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white" 
                : "bg-white dark:bg-transparent text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
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
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay saat hover */}
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

        {/* CTA Instagram */}
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
      </div>

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