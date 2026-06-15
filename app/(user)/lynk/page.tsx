"use client"

import { MobileHeader } from "@/components/MobileHeader"
import { ExternalLink, ScanLine, ArrowRight, ShoppingBag, Globe, Sparkles, QrCode } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LynkPage() {
  const lynkUrl = "https://lynk.id/fan_ajalah"

  return (
    // select-none untuk mencegah blok teks (Feel Native App)
    <div className="bg-[#f4f6f9] min-h-screen font-sans pb-24 relative overflow-hidden select-none">
      
      {/* 1. Header Fungsional */}
      <div className="bg-white sticky top-0 z-50 border-b border-slate-100/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <MobileHeader title="Link & QR Connect" />
      </div>

      {/* Ambient Background (Gaya Gojek Premium) */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-orange-400/20 to-amber-300/10 rounded-full blur-[80px] pointer-events-none -mt-20 -mr-20" />
      <div className="absolute top-[40%] left-0 w-[300px] h-[300px] bg-gradient-to-tr from-blue-400/10 to-indigo-300/5 rounded-full blur-[60px] pointer-events-none -ml-20" />

      <div className="px-5 pt-8 relative z-10 flex flex-col items-center max-w-md mx-auto">
        
        {/* 2. PROFILE SECTION (Gaya Minimalis Modern) */}
        <div className="relative mb-3">
          <div className="w-24 h-24 rounded-[1.8rem] border-[4px] border-white shadow-[0_8px_20px_rgba(0,0,0,0.06)] bg-white flex items-center justify-center p-1 rotate-3 hover:rotate-0 transition-transform duration-300">
            <div className="w-full h-full bg-gradient-to-br from-orange-500 to-amber-500 rounded-[1.3rem] flex items-center justify-center text-white font-black text-3xl shadow-inner">
              JP
            </div>
          </div>
          {/* Verified Badge */}
          <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-xl border-[3px] border-[#f4f6f9] shadow-sm">
            <Sparkles size={14} className="fill-current" />
          </div>
        </div>

        <h2 className="text-[22px] font-black text-slate-800 tracking-tight text-center mt-2">JokiPoster</h2>
        <div className="bg-slate-200/50 px-3 py-1 rounded-full mt-1.5 mb-8 flex items-center gap-1.5 backdrop-blur-sm border border-slate-200/60">
          <Globe size={12} className="text-slate-500" /> 
          <p className="text-[11px] font-extrabold text-slate-600 tracking-wider">@fan_ajalah</p>
        </div>

        {/* 3. DIGITAL PASS / QR CARD (Gaya Apple Wallet / GoPay) */}
        <div className="w-full bg-white rounded-[2rem] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] mb-8 border border-slate-100 relative group overflow-hidden active:scale-[0.98] transition-transform duration-300">
          
          {/* Card Header */}
          <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <QrCode size={18} className="text-orange-400" />
              <span className="text-xs font-bold tracking-widest uppercase text-slate-300">Scan to Connect</span>
            </div>
            <ScanLine size={18} className="text-slate-400 animate-pulse" />
          </div>

          {/* Pemisah Berlubang (Efek Tiket Fisik) */}
          <div className="relative flex justify-between items-center -my-3 z-10">
            <div className="w-6 h-6 bg-[#f4f6f9] rounded-full -ml-3 border-r border-slate-100 shadow-inner"></div>
            <div className="w-full border-t-[2px] border-dashed border-slate-200"></div>
            <div className="w-6 h-6 bg-[#f4f6f9] rounded-full -mr-3 border-l border-slate-100 shadow-inner"></div>
          </div>

          {/* QR Area */}
          <div className="p-8 flex flex-col items-center bg-white relative">
            <div className="relative aspect-square w-full max-w-[200px] bg-white rounded-3xl p-3 shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_8px_20px_rgba(0,0,0,0.04)] flex items-center justify-center group-hover:shadow-[0_0_0_2px_rgba(249,115,22,0.2),0_12px_24px_rgba(249,115,22,0.1)] transition-all">
              {/* Bingkai sudut QR (Gaya Scanner) */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-orange-500 rounded-tl-3xl"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-orange-500 rounded-tr-3xl"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-orange-500 rounded-bl-3xl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-orange-500 rounded-br-3xl"></div>

              <Image
                src="/qr.png" 
                alt="QR Code JokiPoster"
                width={200}
                height={200}
                className="w-full h-full object-contain mix-blend-multiply"
              />
              
              {/* Animasi Scan Line (Lebih Halus & Premium) */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_15px_rgba(249,115,22,1)] animate-[scan_2.5s_ease-in-out_infinite] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 4. HIGH-CONVERTING ACTION BUTTONS (Gaya Gojek) */}
        <div className="w-full space-y-3.5">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-1 flex items-center gap-2">
            Aksi Utama <div className="h-px bg-slate-200 flex-1"></div>
          </h3>
          
          <Link
            href={lynkUrl} 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center p-3 bg-orange-600 rounded-[1.5rem] shadow-[0_8px_20px_rgba(234,88,12,0.25)] text-white active:scale-95 transition-all outline-none"
          >
            <div className="bg-white/20 p-3.5 rounded-2xl flex items-center justify-center shrink-0">
              <ShoppingBag size={22} strokeWidth={2.5} />
            </div>
            <div className="ml-4 flex-1">
              <span className="block font-extrabold text-[15px] tracking-tight leading-none mb-1">Akses Toko Digital</span>
              <span className="block font-medium text-[11px] text-orange-200">Buka halaman Lynk.id</span>
            </div>
            <div className="bg-white/10 p-2 rounded-full mr-1">
              <ExternalLink size={16} strokeWidth={2.5} />
            </div>
          </Link>

          <Link
            href="/premium" 
            className="w-full flex items-center p-3 bg-white border border-slate-200/80 rounded-[1.5rem] shadow-sm text-slate-800 hover:border-slate-300 hover:bg-slate-50 active:scale-95 transition-all outline-none"
          >
            <div className="bg-slate-100 text-slate-500 p-3.5 rounded-2xl flex items-center justify-center shrink-0">
              <ArrowRight size={22} strokeWidth={2.5} />
            </div>
            <div className="ml-4 flex-1">
              <span className="block font-extrabold text-[15px] tracking-tight leading-none mb-1">Konsultasi Desain</span>
              <span className="block font-medium text-[11px] text-slate-400">Chat dengan admin sekarang</span>
            </div>
          </Link>
        </div>

      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 5%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { top: 95%; opacity: 0; }
        }
      `}</style>
    </div>
  )
}