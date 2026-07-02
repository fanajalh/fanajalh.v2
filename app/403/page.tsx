"use client"

import Link from "next/link"
import { ShieldAlert, ArrowLeft } from "lucide-react"
export default function Forbidden() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6 select-none font-sans relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0"></div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 md:p-12 rounded-[2rem] shadow-2xl shadow-orange-500/10 dark:shadow-orange-500/5 max-w-lg w-full text-center relative z-10 animate-in zoom-in-95 duration-200">
        
        {/* Error Code Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 text-orange-600 dark:text-orange-400 font-bold tracking-widest text-xs uppercase mb-6 rounded-full shadow-sm">
          <ShieldAlert size={14} /> ERROR 403
        </div>

        {/* Big Code */}
        <h1 className="text-7xl md:text-8xl font-black mb-4 tracking-tighter bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
          403
        </h1>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-black uppercase text-slate-850 dark:text-white tracking-widest mb-4">
          Akses Ditolak
        </h2>

        {/* Description */}
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
          Maaf, Anda tidak memiliki izin atau kredensial yang memadai untuk mengakses halaman ini. Jika menurut Anda ini kesalahan, silakan login dengan akun yang sesuai.
        </p>

        {/* Action Button */}
        <Link 
          href="/" 
          className="w-full inline-flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold uppercase tracking-widest text-sm rounded-2xl shadow-lg shadow-orange-500/20 active:scale-[0.97] transition-all duration-200"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Kembali ke Beranda
        </Link>
        
      </div>
    </div>
  )
}
