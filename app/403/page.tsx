"use client"

import Link from "next/link"
import { ShieldAlert, ArrowLeft } from "lucide-react"

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-6 select-none font-sans">
      <div className="bg-white dark:bg-white/5 border-4 border-black dark:border-white p-8 md:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.2)] max-w-lg w-full text-center">
        
        {/* Error Code Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-500 text-amber-600 dark:text-amber-400 font-black tracking-widest text-xs uppercase mb-6">
          <ShieldAlert size={14} /> ERROR 403
        </div>

        {/* Big Code */}
        <h1 className="text-7xl md:text-8xl font-black text-black dark:text-white mb-4 tracking-tighter">
          403
        </h1>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-black uppercase text-black dark:text-white tracking-widest mb-4">
          Akses Ditolak
        </h2>

        {/* Description */}
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
          Maaf, Anda tidak memiliki izin atau kredensial yang memadai untuk mengakses halaman ini. Jika menurut Anda ini kesalahan, silakan login dengan akun yang sesuai.
        </p>

        {/* Action Button */}
        <Link 
          href="/" 
          className="w-full inline-flex items-center justify-center gap-2 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-sm border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Kembali ke Beranda
        </Link>
        
      </div>
    </div>
  )
}
