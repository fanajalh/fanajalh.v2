"use client"

import { useState } from "react"
import { Search, Users, Mail, Key, Wrench, BarChart3, HelpCircle, Loader2, Sparkles, ArrowLeft, Globe, ChevronDown, ChevronUp, Check } from "lucide-react"
import Swal from "sweetalert2"
import { useRouter } from "next/navigation"
import Link from "next/link"

const GUEST_FEATURES = [
  {
    key: "lead_finder",
    title: "Lead Finder",
    icon: Search,
    description: "Cari data prospek lokal di Google Maps secara real-time berdasarkan kategori & kota, lalu simpan ke CRM.",
    limit: "Maksimal 1 kali pencarian & simpan massal.",
    color: "bg-amber-100 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-400",
    path: "/lead-finder"
  },
  {
    key: "crm",
    title: "CRM Contacts",
    icon: Users,
    description: "Kelola data kontak prospek, ubah status prospek, catatan khusus, dan lakukan import massal via CSV secara instan.",
    limit: "Maksimal 1 kali input / import data.",
    color: "bg-blue-100 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-400",
    path: "/crm"
  },
  {
    key: "blast",
    title: "Blast Email",
    icon: Mail,
    description: "Hubungkan SMTP Anda sendiri, buat template personalisasi tag {{name}}, lalu kirim email massal ke prospek CRM Anda.",
    limit: "Maksimal pengiriman hingga 5 email.",
    color: "bg-emerald-100 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-400",
    path: "/blast"
  },
  {
    key: "keyword",
    title: "Keyword Planner",
    icon: Key,
    description: "Cari ide kata kunci tertarget lengkap dengan volume pencarian, kesulitan kata kunci, dan Search Intent via Gemini AI.",
    limit: "Maksimal 1 kali pencarian kata kunci.",
    color: "bg-purple-100 dark:bg-purple-950/40 border-purple-500 text-purple-700 dark:text-purple-400",
    path: "/keyword"
  },
  {
    key: "seo",
    title: "SEO Writer",
    icon: Wrench,
    description: "Tulis artikel blog HTML otomatis, buat Meta Title & Description menarik, serta JSON-LD FAQ Schema menggunakan Gemini AI.",
    limit: "Maksimal 1 kali pembuatan konten SEO.",
    color: "bg-rose-100 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-400",
    path: "/seo-tools"
  },
  {
    key: "geo",
    title: "AI Optimization",
    icon: Sparkles,
    description: "Optimalkan website Anda untuk pencarian AI & Generative Search Engine (GEO) agar bisnis Anda direkomendasikan AI.",
    limit: "Maksimal 1 kali optimasi konten AI.",
    color: "bg-orange-100 dark:bg-orange-950/40 border-orange-500 text-orange-700 dark:text-orange-400",
    path: "/ai-optimization"
  },
  {
    key: "site_audit",
    title: "Website Audit",
    icon: Globe,
    description: "Cek skor SEO kesehatan teknis website Anda, perbaiki error crawl, dan tingkatkan performa kecepatan loading.",
    limit: "Maksimal 1 kali cek audit website.",
    color: "bg-indigo-100 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-indigo-400",
    path: "/site-audit"
  },
  {
    key: "tracking",
    title: "SERP Tracker",
    icon: BarChart3,
    description: "Pantau ranking website Anda di mesin pencari Google Indonesia secara real-time dan analisis diagram konversi prospek.",
    limit: "Maksimal 1 kali cek ranking SERP.",
    color: "bg-cyan-100 dark:bg-cyan-950/40 border-cyan-500 text-cyan-700 dark:text-cyan-400",
    path: "/tracking"
  }
]

export default function EcosystemGuestSelector() {
  const router = useRouter()
  const [selectedKey, setSelectedKey] = useState<string>("")
  const [selectingKey, setSelectingKey] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const selectedFeature = GUEST_FEATURES.find(f => f.key === selectedKey)

  const handleSelectFeature = (key: string, title: string, path: string) => {
    Swal.fire({
      title: "Konfirmasi Pilihan 🔒",
      html: `Anda memilih untuk menguji coba fitur <b>"${title}"</b>.<br/><br/>
             <p class="text-sm text-red-500 font-bold">⚠️ Perhatian: Setelah memilih fitur ini, Anda HANYA bisa menggunakan fitur ini. Fitur lainnya akan terkunci untuk akun tamu Anda.</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Coba Fitur Ini",
      cancelButtonText: "Batal",
      confirmButtonColor: "#000",
      cancelButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setSelectingKey(key)
        try {
          const res = await fetch("/api/ecosystem/progression", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ feature: key })
          })
          const data = await res.json()
          if (data.success) {
            Swal.fire({
              icon: "success",
              title: "Fitur Diaktifkan!",
              text: `Anda sekarang memiliki akses uji coba ke modul ${title}.`,
              confirmButtonColor: "#000",
              timer: 2000,
              showConfirmButton: false
            })
            setTimeout(() => {
              try {
                sessionStorage.removeItem("ecosystem_progression")
              } catch {}
              window.location.href = path
            }, 1000)
          } else {
            Swal.fire({ icon: "error", text: data.message || "Gagal mengaktifkan fitur" })
            setSelectingKey(null)
          }
        } catch (err) {
          Swal.fire({ icon: "error", text: "Terjadi kesalahan koneksi" })
          setSelectingKey(null)
        }
      }
    })
  }

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-black border-4 border-black dark:border-white p-8 font-sans select-none relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)]">
      <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-4 mb-6">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-gray-500 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Kembali
        </button>
        <div className="inline-flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em]">
          <Sparkles size={12} /> Ecosystem Guest Trial
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-wider mb-2">
          Pilih Fitur Uji Coba Anda 🎯
        </h2>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm mx-auto">
          Silakan pilih salah satu dari 8 fitur ekosistem di bawah untuk dicoba secara gratis. Setelah memilih, fitur lainnya akan otomatis terkunci.
        </p>
      </div>

      {/* Custom Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-4 bg-white dark:bg-black text-black dark:text-white border-4 border-black dark:border-white text-xs font-black uppercase tracking-widest focus:outline-none transition-all active:translate-x-[2px] active:translate-y-[2px]"
        >
          <div className="flex items-center gap-2">
            {selectedFeature ? (
              <>
                <div className="p-1 border border-black dark:border-white bg-gray-50 dark:bg-white/5">
                  {(() => {
                    const Icon = selectedFeature.icon
                    return <Icon size={14} />
                  })()}
                </div>
                <span>{selectedFeature.title}</span>
              </>
            ) : (
              <span>-- Pilih Fitur Uji Coba --</span>
            )}
          </div>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {isOpen && (
          <div className="absolute left-0 right-0 mt-2 z-50 bg-white dark:bg-black border-4 border-black dark:border-white max-h-[300px] overflow-y-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]">
            {GUEST_FEATURES.map((item) => {
              const Icon = item.icon
              const isSelected = item.key === selectedKey
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setSelectedKey(item.key)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between text-xs font-black uppercase tracking-wider border-b-2 border-black dark:border-white/10 last:border-b-0 transition-colors ${
                    isSelected 
                      ? "bg-yellow-400 text-black" 
                      : "bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 border border-black dark:border-white ${isSelected ? "bg-white text-black" : "bg-gray-50 dark:bg-white/5"}`}>
                      <Icon size={14} />
                    </div>
                    <span>{item.title}</span>
                  </div>
                  {isSelected && <Check size={16} className="text-black shrink-0" />}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Feature Details */}
      {selectedFeature && (
        <div className="mt-6 border-4 border-black dark:border-white p-5 text-left space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3">
            <div className="p-2 border-2 border-black dark:border-white bg-gray-50 dark:bg-white/5 text-black dark:text-white">
              {(() => {
                const Icon = selectedFeature.icon
                return <Icon size={16} />
              })()}
            </div>
            <h4 className="text-sm font-black text-black dark:text-white uppercase tracking-wider">
              {selectedFeature.title}
            </h4>
          </div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-relaxed">
            {selectedFeature.description}
          </p>
          <div className="pt-3 border-t-2 border-dashed border-gray-250 dark:border-white/20">
            <span className="block text-[9px] font-bold uppercase tracking-wider text-gray-400">Batas Tamu:</span>
            <span className="text-xs font-black text-black dark:text-white">{selectedFeature.limit}</span>
          </div>
          <button
            onClick={() => handleSelectFeature(selectedFeature.key, selectedFeature.title, selectedFeature.path)}
            disabled={selectingKey !== null}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs border-2 border-black dark:border-white hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white transition-all disabled:opacity-50 active:translate-x-[2px] active:translate-y-[2px]"
          >
            {selectingKey === selectedFeature.key ? (
              <>
                <Loader2 size={12} className="animate-spin" /> Mengaktifkan...
              </>
            ) : (
              "Aktifkan Uji Coba Ini 🎯"
            )}
          </button>
        </div>
      )}

      {/* Footer / Tutorial */}
      <div 
        className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black text-gray-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer" 
        onClick={() => router.push("/tutorial")}
      >
        <HelpCircle size={14} />
        <span>Butuh bantuan? <span className="underline">Lihat Tutorial</span></span>
      </div>
    </div>
  )
}

