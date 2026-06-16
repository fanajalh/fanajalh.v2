"use client"

import { useState, useEffect, useRef } from "react"
import { Server, Database, Shield, CheckCircle, AlertCircle, HardDrive, Zap, Smartphone, Upload, Loader2, Package, FileText } from "lucide-react"
import Swal from "sweetalert2"

interface Props {
  connectionStatus: "connected" | "mock" | "error"
}

interface ApkData {
  version: string
  file_url: string
  file_size: string
}

export function TabSettings({ connectionStatus }: Props) {
  // APK State
  const [apkVersion, setApkVersion] = useState("")
  const [apkFile, setApkFile] = useState<File | null>(null)
  const [apkLoading, setApkLoading] = useState(false)
  const [apkFetching, setApkFetching] = useState(true)
  const [currentApk, setCurrentApk] = useState<ApkData | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch current APK settings
  useEffect(() => {
    fetchApkSettings()
  }, [])

  const fetchApkSettings = async () => {
    try {
      setApkFetching(true)
      const res = await fetch("/api/admin/apk-settings")
      const json = await res.json()
      if (json.success && json.data) {
        setCurrentApk(json.data)
        setApkVersion(json.data.version || "")
      }
    } catch (err) {
      console.error("Gagal mengambil APK settings:", err)
    } finally {
      setApkFetching(false)
    }
  }

  const handleApkUpload = async () => {
    if (!apkVersion.trim()) {
      Swal.fire({ icon: "warning", title: "Perhatian", text: "Versi APK wajib diisi!" })
      return
    }

    setApkLoading(true)
    try {
      const formData = new FormData()
      formData.append("version", apkVersion.trim())
      if (apkFile) {
        formData.append("file", apkFile)
      }

      const res = await fetch("/api/admin/apk-settings", {
        method: "POST",
        body: formData,
      })
      const json = await res.json()

      if (json.success) {
        Swal.fire({ icon: "success", title: "Berhasil!", text: json.message, timer: 2000, showConfirmButton: false })
        setCurrentApk(json.data)
        setApkFile(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
        fetchApkSettings()
      } else {
        Swal.fire({ icon: "error", title: "Gagal", text: json.message })
      }
    } catch (err: any) {
      Swal.fire({ icon: "error", text: err.message || "Gagal mengunggah APK" })
    } finally {
      setApkLoading(false)
    }
  }

  const systemInfo = [
    { label: "Platform", value: "Next.js 14 App Router", icon: Server, color: "blue" },
    { label: "Database", value: "Neon PostgreSQL", icon: Database, color: "emerald" },
    { label: "Auth Provider", value: "NextAuth.js v4", icon: Shield, color: "indigo" },
    { label: "Connection", value: connectionStatus === "connected" ? "Terhubung (Live)" : connectionStatus === "mock" ? "Mode Demo" : "Terputus", icon: connectionStatus === "error" ? AlertCircle : CheckCircle, color: connectionStatus === "connected" ? "emerald" : connectionStatus === "mock" ? "amber" : "red" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Bento System Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {systemInfo.map((info, idx) => {
          const Icon = info.icon
          const isActive = info.label === "Connection" && connectionStatus === "connected"
          const isError = info.label === "Connection" && connectionStatus === "error"
          const isMock = info.label === "Connection" && connectionStatus === "mock"

          let bgColor = "bg-white"
          if (isActive) bgColor = "bg-green-400"
          if (isError) bgColor = "bg-red-500 text-white"
          if (isMock) bgColor = "bg-yellow-400"

          return (
            <div key={idx} className={`${bgColor} p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-5 hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none`}>
              <div className="w-14 h-14 bg-black text-white rounded-none flex items-center justify-center shrink-0 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Icon size={28} strokeWidth={3} />
              </div>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isError ? 'text-gray-200' : 'text-gray-600'}`}>{info.label}</p>
                <p className="text-lg font-black uppercase tracking-widest">{info.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* ==================== APK MANAGER ==================== */}
      <div className="bg-white p-6 md:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden rounded-none mt-8">
        <div className="absolute top-0 right-0 w-full h-2 bg-orange-500" />

        <div className="flex flex-col gap-6 relative z-10 mt-2">
          {/* Header */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-orange-500 border-4 border-black flex items-center justify-center text-white shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Smartphone size={32} strokeWidth={3} />
            </div>
            <div>
              <h3 className="text-xl font-black text-black uppercase tracking-widest mb-1">KELOLA APK MOBILE</h3>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-relaxed max-w-lg">
                UPLOAD FILE APK DAN ATUR VERSI APLIKASI MOBILE. DATA AKAN DITAMPILKAN DI HALAMAN DOWNLOAD LANDING PAGE.
              </p>
            </div>
          </div>

          {/* Current APK Info */}
          {apkFetching ? (
            <div className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-200">
              <Loader2 size={18} className="animate-spin text-gray-400" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Memuat data APK...</span>
            </div>
          ) : currentApk && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-orange-50 border-2 border-orange-400 flex items-center gap-3">
                <Package size={20} strokeWidth={3} className="text-orange-500 shrink-0" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Versi Saat Ini</p>
                  <p className="text-lg font-black text-black uppercase tracking-widest">v{currentApk.version}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 border-2 border-gray-300 flex items-center gap-3">
                <FileText size={20} strokeWidth={3} className="text-gray-500 shrink-0" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Ukuran File</p>
                  <p className="text-lg font-black text-black uppercase tracking-widest">{currentApk.file_size}</p>
                </div>
              </div>
              <div className="p-4 bg-emerald-50 border-2 border-emerald-400 flex items-center gap-3">
                <CheckCircle size={20} strokeWidth={3} className="text-emerald-500 shrink-0" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Status</p>
                  <p className="text-lg font-black text-emerald-600 uppercase tracking-widest">AKTIF</p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Form */}
          <div className="bg-gray-50 p-6 border-2 border-black space-y-5">
            <h4 className="text-sm font-black uppercase tracking-widest text-black border-b-2 border-black pb-3">
              Upload / Update APK
            </h4>

            {/* Version Input */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2">
                Versi Aplikasi *
              </label>
              <input
                type="text"
                value={apkVersion}
                onChange={(e) => setApkVersion(e.target.value)}
                placeholder="Contoh: 1.0.1"
                className="w-full max-w-sm px-4 py-3 bg-white text-black border-2 border-black text-sm font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow placeholder:text-gray-400"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2">
                File APK (opsional, ganti jika ingin update file)
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-start">
                <label className="cursor-pointer flex items-center gap-3 px-6 py-3.5 bg-white text-black font-black uppercase tracking-widest text-xs border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:scale-95">
                  <Upload size={16} strokeWidth={3} />
                  PILIH FILE APK
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".apk"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) setApkFile(f)
                    }}
                  />
                </label>
                {apkFile && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 border-2 border-emerald-500 text-emerald-700">
                    <CheckCircle size={14} strokeWidth={3} />
                    <span className="text-xs font-black uppercase tracking-widest">
                      {apkFile.name} ({(apkFile.size / (1024 * 1024)).toFixed(1)} MB)
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleApkUpload}
              disabled={apkLoading}
              className="flex items-center gap-3 px-10 py-5 bg-orange-500 text-white font-black uppercase tracking-widest rounded-none text-sm hover:bg-black border-2 border-black active:translate-y-1 active:shadow-none transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {apkLoading ? (
                <><Loader2 size={20} strokeWidth={3} className="animate-spin" /> MENGUNGGAH...</>
              ) : (
                <><Upload size={20} strokeWidth={3} /> SIMPAN & UPLOAD APK</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Critical Actions */}
      <div className="bg-white p-6 md:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden rounded-none mt-8">
        <div className="absolute top-0 right-0 w-full h-2 bg-red-500" />
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10 mt-2">
          <div className="w-16 h-16 bg-red-500 border-4 border-black flex items-center justify-center text-white shrink-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <HardDrive size={32} strokeWidth={3} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black text-black uppercase tracking-widest mb-2">DATABASE INITIALIZATION</h3>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 leading-relaxed max-w-lg">
              JALANKAN SETUP INI HANYA JIKA ANDA BARU PERTAMA KALI MENGHUBUNGKAN DATABASE ATAU INGIN MEMBUAT ULANG TABEL YANG HILANG (MIGRATION).
            </p>
            
            <button
              onClick={async () => {
                const result = await Swal.fire({ title: 'Jalankan Setup DB?', text: "Peringatan: Menjalankan setup database bisa menimpa struktur tabel yang ada. Lanjutkan?", icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Ya, Jalankan!' })
                if(!result.isConfirmed) return;
                try {
                  const res = await fetch("/api/setup-db")
                  const data = await res.json()
                  Swal.fire({ icon: data.success ? 'success' : 'error', title: data.success ? 'Berhasil' : 'Gagal', text: data.success ? data.message : data.error })
                } catch { Swal.fire({ icon: 'error', text: 'Failed to setup database' }) }
              }}
              className="flex items-center gap-3 px-8 py-4 bg-red-500 text-white font-black uppercase tracking-widest rounded-none text-sm hover:bg-black border-2 border-black active:translate-y-1 active:shadow-none transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] outline-none"
            >
              <Zap size={20} strokeWidth={3} /> JALANKAN SETUP DB
            </button>
          </div>
        </div>
      </div>
      
    </div>
  )
}