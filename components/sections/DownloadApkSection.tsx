"use client"

import { useState, useEffect } from "react"
import { 
  Smartphone, 
  Download, 
  CheckCircle, 
  ArrowRight, 
  Loader2,
  Layers,
  Zap,
  Activity
} from "lucide-react"
import { headersConfig } from "./headersConfig"

interface ApkData {
  version: string
  file_url: string
  file_size: string
}

export default function DownloadApkSection() {
  const [apk, setApk] = useState<ApkData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchApk() {
      try {
        const res = await fetch("/api/admin/apk-settings")
        const json = await res.json()
        if (json.success && json.data) {
          setApk(json.data)
        } else {
          setApk(null)
        }
      } catch (err) {
        console.error("Gagal memuat APK settings:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchApk()
  }, [])

  if (loading) {
    return null
  }

  if (!apk) {
    return null
  }

  return (
    <section id="download-apk" className="relative py-24 lg:py-32 overflow-hidden selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0"></div>
      
      {/* Decorative background blur shapes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 dark:bg-orange-500/2 blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-850 dark:text-white tracking-tight uppercase">
            {headersConfig.downloadApk.title}
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            {headersConfig.downloadApk.subtitle}
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 rounded-[2.5rem] shadow-sm shadow-slate-100 dark:shadow-none hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-500">
          
          {/* Text Info */}
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <h3 className="text-3xl sm:text-4xl font-bold text-slate-850 dark:text-white tracking-tight uppercase">
              {headersConfig.downloadApk.contentTitle}
            </h3>
            
            <p className="text-base text-slate-550 dark:text-slate-400 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
              {headersConfig.downloadApk.contentDesc}
            </p>

            {/* Feature Highlights List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 max-w-md mx-auto lg:mx-0">
              {headersConfig.downloadApk.features.map((feat) => (
                <div key={feat} className="flex items-center gap-2.5 justify-center lg:justify-start">
                  <CheckCircle size={16} className="text-orange-500 shrink-0" strokeWidth={3} />
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-330">{feat}</span>
                </div>
              ))}
            </div>

            {/* Download Button Actions */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <a 
                href={apk.file_url} 
                download
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/15 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl hover:shadow-orange-500/25"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} strokeWidth={2.5} />}
                {headersConfig.downloadApk.btnText}
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
          <div className="relative group shrink-0">
            {/* Outer Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-b from-orange-500/20 to-amber-500/0 rounded-[3.2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
            
            {/* Smartphone Body */}
            <div className="w-full max-w-[270px] aspect-[9/19] border-[6px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-black/50 relative flex flex-col select-none ring-1 ring-slate-900/5 dark:ring-white/10 z-10">
              
              {/* Hardware Buttons */}
              <div className="absolute -left-[9px] top-24 w-1 h-12 bg-slate-300 dark:bg-slate-700 rounded-l-md" />
              <div className="absolute -left-[9px] top-40 w-1 h-12 bg-slate-300 dark:bg-slate-700 rounded-l-md" />
              <div className="absolute -right-[9px] top-32 w-1 h-16 bg-slate-300 dark:bg-slate-700 rounded-r-md" />

              {/* Screen Inner Shadow / Bezel effect */}
              <div className="flex-1 flex flex-col w-full h-full relative overflow-hidden rounded-[2.5rem] p-4 pt-6 bg-slate-50 dark:bg-[#0B0F19] shadow-[inset_0_0_20px_rgba(0,0,0,0.03)] dark:shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]">
                
                {/* Dynamic Island / Notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-[1.125rem] bg-slate-900 dark:bg-black rounded-full z-20 flex items-center justify-end px-2 shadow-sm border border-slate-800/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-900/80 border border-indigo-700/50 mr-1.5" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 blur-[0.5px]" />
                </div>
                
                {/* Mock Screen Header */}
                <div className="flex justify-between items-center mt-4 border-b border-gray-200/60 dark:border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-sm">
                      <span className="text-[10px] font-black text-white">F</span>
                    </div>
                    <span className="text-[9px] font-extrabold text-slate-800 dark:text-white tracking-widest">ALLFANAJALH</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>

                {/* Mock Screen Content */}
                <div className="flex-1 flex flex-col justify-center items-center gap-4 py-4">
                  
                  {/* Modern Icon / Graphic Replacement */}
                  <div className="w-16 h-16 relative rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/30 mb-2">
                    <div className="absolute inset-0 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30" />
                    <Layers className="text-white w-8 h-8 relative z-10" />
                  </div>

                  <div className="text-center space-y-1.5">
                    <p className="text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-wider">AllFanajalh Mobile</p>
                    <p className="text-[8px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-full inline-block">
                      Desain & Automasi
                    </p>
                  </div>

                  <div className="w-full space-y-2.5 mt-2">
                    {/* Mock UI Box 1 */}
                    <div className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-3 rounded-2xl space-y-2 shadow-sm">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-1.5">
                          <Zap size={10} className="text-orange-500" />
                          <span className="text-[8px] font-black text-slate-700 dark:text-slate-200 uppercase">Studio Photobooth</span>
                        </div>
                        <span className="text-[7px] font-extrabold bg-orange-100 dark:bg-orange-500/20 text-orange-600 px-1.5 py-0.5 rounded-md">NEW</span>
                      </div>
                      <div className="h-1.5 w-full bg-gray-100 dark:bg-black/40 rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-gradient-to-r from-orange-400 to-orange-500 rounded-full" />
                      </div>
                    </div>

                    {/* Mock UI Box 2 */}
                    <div className="w-full bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 p-3 rounded-2xl flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                          <Activity size={10} className="text-blue-500" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-800 dark:text-white uppercase">Status Pesanan</p>
                          <p className="text-[7px] font-bold text-gray-400 dark:text-gray-500 mt-0.5">Selesai 2 Hari</p>
                        </div>
                      </div>
                      <div className="px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20">
                        <span className="text-[7px] font-black text-emerald-600 dark:text-emerald-400">AKTIF</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mock Screen Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 h-1 w-20 bg-slate-300 dark:bg-slate-600 rounded-full" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}