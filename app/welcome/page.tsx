"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Palette, Camera, UserPlus, LogIn, ArrowRight } from "lucide-react"

export default function WelcomePage() {
  const [showSplash, setShowSplash] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const [progress, setProgress] = useState(0)

  // Logika Loading Bar seperti aplikasi sungguhan
  useEffect(() => {
    let interval;
    if (progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          // Menambah kecepatan progress secara acak agar terasa natural
          const step = Math.floor(Math.random() * 5) + 2; 
          return prev + step > 100 ? 100 : prev + step;
        })
      }, 50) // Update setiap 50ms (Total sekitar ~2 detik)
    } else {
      // Saat progress 100%, mulai fade out
      setFadeOut(true)
      // Hapus splash screen dari DOM setelah transisi memudar selesai
      setTimeout(() => setShowSplash(false), 600) 
    }
    return () => clearInterval(interval)
  }, [progress])

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans select-none">
      
      {/* ---------------------------------------------------- */}
      {/* 1. SPLASH SCREEN (OVERLAY LOADING) */}
      {/* ---------------------------------------------------- */}
      {showSplash && (
        <div 
          className={`absolute inset-0 z-50 flex flex-col justify-between bg-slate-950 transition-opacity duration-700 ease-in-out ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Spacer Atas */}
          <div className="flex-1" />

          {/* Konten Tengah (Logo & Progress Bar) */}
          <div className="flex flex-col items-center justify-center flex-none">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-orange-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl ring-1 ring-white/20 overflow-hidden">
                <img src="/feed arfan (20).png" alt="AllFanajalh Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Fanajah</h1>
            
            {/* Progress Bar */}
            <div className="w-32 h-1 bg-slate-800/80 rounded-full mt-10 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-orange-300 rounded-full transition-all duration-75 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Footer Khas Aplikasi (From Brand) */}
          <div className="flex-1 flex flex-col justify-end items-center pb-12">
            <span className="text-[10px] text-slate-500 font-semibold tracking-widest uppercase mb-1">
              Dari
            </span>
            <span className="text-sm font-black tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300">
              Fanajah ID
            </span>
          </div>
        </div>
      )}


      {/* ---------------------------------------------------- */}
      {/* 2. HALAMAN UTAMA (Berada di balik Splash Screen) */}
      {/* ---------------------------------------------------- */}
      
      {/* Background Glowing Orbs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-orange-500/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] delay-1000 animate-pulse" />

      {/* Main Content Area */}
      <div className="z-10 flex flex-col items-center justify-center w-full max-w-[340px] px-4">
        
        {/* App Icon & Text */}
        <div className="flex flex-col items-center mb-10 mt-6">
          <div className="relative group cursor-pointer mb-6">
            <div className="absolute inset-0 bg-orange-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center shadow-xl transform -rotate-3 group-hover:rotate-0 transition-all duration-300 ring-1 ring-white/20 overflow-hidden">
              <img src="/feed arfan (20).png" alt="AllFanajalh Logo" className="w-full h-full object-cover" />
            </div>
          </div>
          
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Fanajah</h1>
          <p className="text-slate-400 text-center text-sm leading-relaxed px-2">
            Platform desain cerdas untuk mewujudkan ide kreatifmu.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3.5 w-full">
          
          <Link href="/loginUser" className="w-full flex items-center p-3.5 bg-orange-500 hover:bg-orange-400 text-white rounded-2xl font-semibold shadow-lg shadow-orange-500/25 transition-all active:scale-[0.98] group">
            <div className="bg-white/20 p-2 rounded-xl mr-3">
              <LogIn size={18} className="text-white" />
            </div>
            <span className="flex-1 text-left text-sm">Masuk</span>
            <ArrowRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Link>

          <Link href="/register" className="w-full flex items-center p-3.5 bg-slate-800/40 hover:bg-slate-800 backdrop-blur-md text-slate-200 border border-slate-700/50 rounded-2xl font-semibold transition-all active:scale-[0.98] group">
            <div className="bg-slate-700/50 p-2 rounded-xl mr-3 group-hover:bg-slate-600 transition-colors">
              <UserPlus size={18} className="text-slate-300" />
            </div>
            <span className="flex-1 text-left text-sm">Daftar Akun</span>
            <ArrowRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Link>

          <div className="flex items-center my-2 opacity-60">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="mx-4 text-slate-500 text-[10px] font-bold uppercase tracking-wider">Atau</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <Link href="/frames" className="w-full flex items-center justify-center p-3.5 bg-transparent hover:bg-slate-800/40 border border-dashed border-slate-700 text-slate-400 hover:text-slate-200 rounded-2xl font-medium transition-all active:scale-[0.98] group">
            <Camera size={18} className="mr-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm">Studio Tanpa Login</span>
          </Link>

        </div>
      </div>

    </div>
  )
}