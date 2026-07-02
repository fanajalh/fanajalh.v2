"use client"

import Link from "next/link"
import { Camera, Sparkles, ArrowRight, Layout, Monitor } from "lucide-react"

export default function PhotoboothSection() {
  return (
    <section id="photobooth" className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
      <div className="relative rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/80 text-white p-8 md:p-14 overflow-hidden border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Background Decorative Glows */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-orange-600/10 rounded-full blur-3xl" />
        
        {/* Content */}
        <div className="space-y-4 max-w-2xl text-left z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-black uppercase tracking-wider">
            <Sparkles size={14} className="animate-spin-slow" /> Baru! PhotoStudio
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Abadikan Momen Serumu <br />
            Dengan <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Frame Premium</span>
          </h2>
          <p className="text-sm md:text-base text-slate-400 font-semibold leading-relaxed">
            Pilih bingkai kustom keren dari berbagai event dan langsung ambil foto studio secara online, instan, gratis, dan berkualitas tinggi!
          </p>
          
          <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <Camera size={14} className="text-orange-500" /> Auto Crop
            </div>
            <div className="flex items-center gap-1.5">
              <Layout size={14} className="text-orange-500" /> Bingkai Keren
            </div>
            <div className="flex items-center gap-1.5">
              <Monitor size={14} className="text-orange-500" /> Ekspor HQ
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="shrink-0 z-10 w-full lg:w-auto">
          <Link
            href="/frames"
            className="flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 duration-300 w-full lg:w-auto"
          >
            Pilih Bingkai Foto <ArrowRight size={16} />
          </Link>
        </div>

      </div>
    </section>
  )
}
