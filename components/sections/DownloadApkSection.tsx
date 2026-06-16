"use client"

import { useState, useEffect } from "react"
import { Smartphone, Download, CheckCircle, ArrowRight, Loader2 } from "lucide-react"

interface ApkData {
  version: string
  file_url: string
  file_size: string
}

export default function DownloadApkSection() {
  const [apk, setApk] = useState<ApkData>({
    version: "1.0.0",
    file_url: "/AllFanajalh.apk",
    file_size: "~25 MB",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchApk() {
      try {
        const res = await fetch("/api/admin/apk-settings")
        const json = await res.json()
        if (json.success && json.data) {
          setApk({
            version: json.data.version || "1.0.0",
            file_url: json.data.file_url || "/AllFanajalh.apk",
            file_size: json.data.file_size || "~25 MB",
          })
        }
      } catch (err) {
        console.error("Gagal memuat APK settings:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchApk()
  }, [])

  return (
    <section id="download-apk" className="relative py-24 lg:py-32 bg-white dark:bg-black overflow-hidden border-t border-gray-200 dark:border-white/10 selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black">
      {/* Background Decor Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),dark:linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0"></div>
      
      {/* Decorative background blur shapes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 dark:bg-orange-500/2 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 text-xs font-bold mb-2 uppercase tracking-[0.2em]">
            <Smartphone className="w-3.5 h-3.5 text-black dark:text-white" />
            <span className="text-black dark:text-white">Mobile Application</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tight uppercase">
            Aplikasi AllFanajalh
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Dapatkan akses penuh ke studio photobooth, kelola pesanan Anda, dan jalankan SaaS Ecosystem langsung dari smartphone Android Anda.
          </p>
        </div>

        {/* Content Box - Unified Neo-Brutalist Layout */}
        <div className="bg-white dark:bg-black border-2 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 rounded-none">
          
          {/* Text Info */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h3 className="text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight uppercase">
              Bawa Studio Ke Genggaman!
            </h3>
            
            <p className="text-base text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
              Aplikasi mobile AllFanajalh dirancang untuk mempermudah Anda memesan dan melacak status pengerjaan desain poster secara real-time. Dilengkapi fitur kamera Photobooth dengan pendeteksi lambaian tangan untuk pengalaman berfoto terbaik.
            </p>

            {/* Feature Highlights List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-w-md mx-auto lg:mx-0">
              {[
                "Kamera Studio & Sensor Tangan",
                "Pesan Jasa Desain Instan",
                "Notifikasi Progres Real-time",
                "Fitur Premium & Promo Khusus",
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-2.5 justify-center lg:justify-start">
                  <CheckCircle size={16} className="text-orange-500 shrink-0 animate-pulse" strokeWidth={3} />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{feat}</span>
                </div>
              ))}
            </div>

            {/* Download Button Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <a 
                href={apk.file_url} 
                download
                className="group inline-flex items-center gap-3 px-10 py-5 bg-black dark:bg-white text-white dark:text-black hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white border-2 border-black dark:border-white font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <Download size={20} strokeWidth={3} />
                Unduh APK Android
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <div className="text-center lg:text-left">
                <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  {loading ? "Memuat..." : `Versi Terbaru v${apk.version}`}
                </p>
                <p className="text-xs font-black text-orange-500 uppercase tracking-widest mt-0.5">
                  {loading ? "" : `Ukuran File: ${apk.file_size}`}
                </p>
              </div>
            </div>
          </div>

          {/* Visual Smartphone Viewport Mockup */}
          <div className="w-full max-w-[270px] aspect-[9/18] border-4 border-black dark:border-white bg-white dark:bg-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] relative overflow-hidden flex flex-col p-4 select-none shrink-0 group">
            {/* Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black dark:bg-neutral-900 rounded-full z-20 border border-gray-800 dark:border-neutral-800" />
            
            {/* Mock Screen Header */}
            <div className="flex justify-between items-center mt-3 border-b border-gray-100 dark:border-neutral-800 pb-2">
              <div className="w-5 h-5 rounded-md bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center border border-orange-500">
                <span className="text-[8px] font-black text-orange-500">F</span>
              </div>
              <span className="text-[8px] font-extrabold text-black dark:text-white tracking-widest">ALLFANAJALH</span>
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>

            {/* Mock Screen Content */}
            <div className="flex-1 flex flex-col justify-center items-center gap-3 py-6">
              <div className="w-12 h-12 relative overflow-hidden rounded-2xl border border-gray-200 dark:border-white/10 shrink-0 shadow-sm animate-pulse">
                <img src="/feed arfan (20).png" alt="App Logo" className="w-full h-full object-cover" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-[10px] font-black text-black dark:text-white uppercase tracking-wider">AllFanajalh Mobile</p>
                <p className="text-[7px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Desain & Automasi Bisnis</p>
              </div>

              {/* Mock UI Box 1 */}
              <div className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-2.5 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[7px] font-black text-orange-500 uppercase">Studio Photobooth</span>
                  <span className="text-[6px] font-extrabold bg-orange-100 dark:bg-orange-500/20 text-orange-600 px-1 py-0.5 rounded">NEW</span>
                </div>
                <div className="h-1 w-full bg-gray-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-orange-500 rounded-full" />
                </div>
              </div>

              {/* Mock UI Box 2 */}
              <div className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-2.5 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-[7px] font-black text-black dark:text-white uppercase">Status Pesanan</p>
                  <p className="text-[6px] font-bold text-gray-400 dark:text-gray-500 uppercase">Selesai 2 Hari</p>
                </div>
                <div className="w-8 h-4 rounded bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-500">
                  <span className="text-[6px] font-black text-emerald-600">AKTIF</span>
                </div>
              </div>
            </div>

            {/* Mock Screen Home Indicator */}
            <div className="h-1 w-1/3 bg-black dark:bg-white rounded-full mx-auto mb-1 shrink-0" />
          </div>

        </div>
      </div>
    </section>
  )
}
