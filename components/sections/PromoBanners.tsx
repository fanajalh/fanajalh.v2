"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { headersConfig } from "@/components/sections/headersConfig"

interface PromoBannersProps {
  setActiveCategory: (cat: string) => void;
  websiteSettings?: any;
}

export default function PromoBanners({ setActiveCategory, websiteSettings }: PromoBannersProps) {
  const config = websiteSettings?.promoBanners || {}
  
  const leftBadge = config.leftBadge || headersConfig.highlights.left.badge
  const leftTitle = config.leftTitle || headersConfig.highlights.left.title
  const leftSubtitle = config.leftSubtitle || headersConfig.highlights.left.subtitle
  const leftButtonText = config.leftButtonText || headersConfig.highlights.left.buttonText
  const leftImage = config.leftImage || headersConfig.highlights.left.image
  const leftLink = config.leftLink || ""

  const rightBadge = config.rightBadge || headersConfig.highlights.right.badge
  const rightTitle = config.rightTitle || headersConfig.highlights.right.title
  const rightSubtitle = config.rightSubtitle || headersConfig.highlights.right.subtitle
  const rightButtonText = config.rightButtonText || headersConfig.highlights.right.buttonText
  const rightImage = config.rightImage || headersConfig.highlights.right.image
  const rightLink = config.rightLink || ""

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 pt-8">
      
      {/* ================= LEFT PROMO BANNER ================= */}
      <div className="relative p-8 md:p-10 flex flex-col justify-center group min-h-[320px] cursor-pointer transition-transform duration-500 ease-out hover:-translate-y-2">
        
        {/* Layer Background (Tetap rounded, nggak motong gambar) */}
        <div className="absolute inset-0 rounded-[2.5rem] bg-[#FFF8F3] dark:bg-slate-900 border border-orange-100/60 dark:border-white/5 shadow-sm transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:shadow-orange-500/10 overflow-hidden z-0"></div>
        
        {/* Text Content (Dibatasi max-w-[55%] biar nggak nabrak gambar) */}
        <div className="space-y-5 w-full max-w-[55%] z-20 relative">
          <span className="inline-block bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-[0.15em] shadow-sm">
            {leftBadge}
          </span>
          <div className="space-y-2.5">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-[1.2] tracking-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
              {leftTitle}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-3">
              {leftSubtitle}
            </p>
          </div>
          <Link 
            href={leftLink || "#products"} 
            onClick={() => {
              if (!leftLink) {
                setActiveCategory("poster");
              }
            }}
            target={leftLink && (leftLink.startsWith("http") || leftLink.includes("wa.me")) ? "_blank" : undefined}
            className="inline-flex items-center gap-2.5 mt-2 px-6 py-3.5 bg-gradient-to-r from-[#ff7a00] to-[#ea580c] hover:opacity-90 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:scale-105 active:scale-95"
          >
            {leftButtonText}
            <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
        
        {/* Visual Image (Melayang di luar text, pakai border dan radius) */}
        <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-[40%] sm:w-[42%] md:w-[38%] z-30 pointer-events-none transition-transform duration-700 ease-out group-hover:-translate-x-4 group-hover:-translate-y-1/2 group-hover:scale-110">
          <img 
            src={leftImage} 
            alt="Highlight Left" 
            className="w-full h-auto object-cover rounded-2xl md:rounded-[20px] shadow-[0_20px_40px_rgba(234,88,12,0.2)] border-[4px] sm:border-[6px] border-white dark:border-slate-800 transform -rotate-3 transition-transform duration-500 group-hover:-rotate-6"
          />
        </div>
      </div>

      {/* ================= RIGHT PROMO BANNER ================= */}
      <div className="relative p-6 sm:p-8 md:p-10 flex flex-col justify-center group min-h-[300px] md:min-h-[320px] cursor-pointer transition-transform duration-500 ease-out hover:-translate-y-2">
        
        {/* Layer Background */}
        <div className="absolute inset-0 rounded-[2rem] md:rounded-[2.5rem] bg-[#F2F8FA] dark:bg-slate-900 border border-sky-100/60 dark:border-white/5 shadow-sm transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:shadow-sky-500/10 overflow-hidden z-0"></div>
        
        {/* Text Content */}
        <div className="space-y-4 md:space-y-5 w-full max-w-[65%] sm:max-w-[60%] md:max-w-[55%] z-20 relative">
          <span className="inline-block bg-sky-100 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-[0.15em] shadow-sm">
            {rightBadge}
          </span>
          <div className="space-y-2.5">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-[1.2] tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300">
              {rightTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-3">
              {rightSubtitle}
            </p>
          </div>
          <Link 
            href={rightLink || "#products"} 
            onClick={() => {
              if (!rightLink) {
                setActiveCategory("webcode");
              }
            }}
            target={rightLink && (rightLink.startsWith("http") || rightLink.includes("wa.me")) ? "_blank" : undefined}
            className="inline-flex items-center gap-2 mt-2 px-5 md:px-6 py-3 md:py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-extrabold text-xs md:text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-slate-900/15 transition-all hover:scale-105 active:scale-95"
          >
            {rightButtonText}
            <ArrowRight size={14} className="md:w-4 md:h-4 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>

        {/* Visual Image */}
        <div className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-[40%] sm:w-[42%] md:w-[38%] z-30 pointer-events-none transition-transform duration-700 ease-out group-hover:-translate-x-4 group-hover:-translate-y-1/2 group-hover:scale-110">
          <img 
            src={rightImage} 
            alt="Highlight Right" 
            className="w-full h-auto object-cover rounded-2xl md:rounded-[20px] shadow-[0_20px_40px_rgba(14,165,233,0.2)] border-[4px] sm:border-[6px] border-white dark:border-slate-800 transform rotate-3 transition-transform duration-500 group-hover:rotate-6"
          />
        </div>
      </div>

    </section>
  )
}