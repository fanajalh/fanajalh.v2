"use client"

import { Server, Database, Shield, CheckCircle, AlertCircle, HardDrive, Zap } from "lucide-react"
import Swal from "sweetalert2"

interface Props {
  connectionStatus: "connected" | "mock" | "error"
}

export function TabSettings({ connectionStatus }: Props) {
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