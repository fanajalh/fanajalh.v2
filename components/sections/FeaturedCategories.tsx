"use client"

import Link from "next/link"
import { FileImage, Smartphone, Code, Printer, Palette, ArrowRight } from "lucide-react"

// Icon mapping helper for categories
const iconMap: { [key: string]: any } = {
  FileImage: FileImage,
  Smartphone: Smartphone,
  Code: Code,
  Printer: Printer,
  Palette: Palette
}

interface FeaturedCategoriesProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  websiteSettings?: any;
  products?: any[];
}

const CATEGORY_DEFS = [
  {
    id: "poster",
    title: "Poster",
    iconName: "FileImage"
  },
  {
    id: "social",
    title: "Media Sosial",
    iconName: "Smartphone"
  },
  {
    id: "webcode",
    title: "Source Code",
    iconName: "Code"
  },
  {
    id: "print",
    title: "Cetak / UMKM",
    iconName: "Printer"
  }
]

export default function FeaturedCategories({ activeCategory, setActiveCategory, websiteSettings, products = [] }: FeaturedCategoriesProps) {
  const config = websiteSettings?.featuredCategories || {}
  const title = config.title || "Kategori Pilihan"

  const categoryCards = CATEGORY_DEFS.map((cat) => {
    const count = products.filter((p) => p.categoryId === cat.id).length
    return {
      ...cat,
      count: `${count} item`
    }
  })

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-10 space-y-10">
      
      {/* ================= HEADER AREA ================= */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h2>
        <Link 
          href="#products" 
          className="group flex items-center gap-1.5 text-sm font-bold text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 transition-colors"
        >
          Lihat Semua
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* ================= OVERLAPPING CARDS CAROUSEL / GRID ================= */}
      <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 md:gap-8 pt-4 pb-8 -mx-6 px-6 lg:mx-0 lg:px-0 scroll-smooth md:grid md:grid-cols-2 lg:grid-cols-4">
        {categoryCards.map((cat) => {
          const IconComponent = iconMap[cat.iconName] || Palette // Ambil icon yang benar
          const isActive = activeCategory === cat.id

          return (
            <div
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`relative overflow-hidden w-[45vw] sm:w-[40vw] md:w-full shrink-0 snap-center aspect-square max-h-[220px] rounded-[1.5rem] p-5 cursor-pointer group transition-all duration-300 bg-white dark:bg-slate-900 border ${
                isActive ? "border-orange-500 dark:border-orange-500 shadow-xl shadow-orange-500/15 scale-[1.02]" : "border-slate-200/60 dark:border-slate-800 hover:scale-[1.02] hover:shadow-xl hover:shadow-slate-200 dark:hover:shadow-none hover:border-orange-300 group-hover:text-orange-500"
              }`}
            >
              {/* Icon Container (Overlapping Style) */}
              <div className={`absolute -bottom-6 -right-6 w-[75%] h-[75%] rounded-[1.5rem] flex items-center justify-center transition-all duration-300 ease-out border ${
                isActive 
                  ? "bg-gradient-to-br from-[#ff7a00] to-[#ea580c] border-transparent text-white shadow-xl shadow-orange-500/25 scale-105" 
                  : "bg-orange-50/50 dark:bg-orange-500/5 border-orange-100 dark:border-orange-900/30 text-orange-500 group-hover:border-transparent group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-orange-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-orange-500/20 group-hover:scale-105"
              }`}>
                <IconComponent 
                  size={28} 
                  className={`md:w-8 md:h-8 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} 
                />
              </div>

              {/* Text Content - Positioned Top Left */}
              <div className="relative z-20 flex flex-col items-start">
                <h3 className={`text-xl md:text-2xl font-black tracking-tight ${isActive ? "text-orange-500" : "text-slate-850 dark:text-white"}`}>
                  {cat.title}
                </h3>
                <p className={`text-xs md:text-sm font-bold mt-1 opacity-80 flex items-center gap-1 transition-transform group-hover:translate-x-1 ${isActive ? "text-orange-600 dark:text-orange-400" : "text-slate-500 dark:text-slate-400"}`}>
                  {cat.count} <ArrowRight className="w-3 h-3" />
                </p>
              </div>
            </div>
          )
        })}
      </div>

    </section>
  )
}