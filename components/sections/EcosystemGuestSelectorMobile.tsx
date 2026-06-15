"use client"

import { useState } from "react"
import { Search, Users, Mail, Key, Wrench, BarChart3, HelpCircle, Loader2, Sparkles, ArrowLeft, Globe, ChevronDown, ChevronUp, Check } from "lucide-react"
import Swal from "@/lib/custom-alert"
import { useRouter } from "next/navigation"
import Link from "next/link"

const GUEST_FEATURES = [
  {
    key: "lead_finder",
    title: "Lead Finder",
    icon: Search,
    description: "Cari data prospek lokal di Google Maps secara real-time berdasarkan kategori & kota, lalu simpan ke CRM.",
    limit: "Maksimal 1 kali pencarian & simpan massal.",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    path: "/ecosystem/lead-finder"
  },
  {
    key: "crm",
    title: "CRM Contacts",
    icon: Users,
    description: "Kelola data kontak prospek, ubah status prospek, catatan khusus, dan lakukan import massal via CSV secara instan.",
    limit: "Maksimal 1 kali input / import data.",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    path: "/ecosystem/crm"
  },
  {
    key: "blast",
    title: "Blast Email",
    icon: Mail,
    description: "Hubungkan SMTP Anda sendiri, buat template personalisasi tag {{name}}, lalu kirim email massal ke prospek CRM Anda.",
    limit: "Maksimal pengiriman hingga 5 email.",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    path: "/ecosystem/blast"
  },
  {
    key: "keyword",
    title: "Keyword Planner",
    icon: Key,
    description: "Cari ide kata kunci tertarget lengkap dengan volume pencarian, kesulitan kata kunci, dan Search Intent via Gemini AI.",
    limit: "Maksimal 1 kali pencarian kata kunci.",
    color: "bg-purple-50 text-purple-600 border-purple-100",
    path: "/ecosystem/keyword"
  },
  {
    key: "seo",
    title: "SEO Writer",
    icon: Wrench,
    description: "Tulis artikel blog HTML otomatis, buat Meta Title & Description menarik, serta JSON-LD FAQ Schema menggunakan Gemini AI.",
    limit: "Maksimal 1 kali pembuatan konten SEO.",
    color: "bg-rose-50 text-rose-600 border-rose-100",
    path: "/ecosystem/seo-tools"
  },
  {
    key: "geo",
    title: "AI Optimization",
    icon: Sparkles,
    description: "Optimalkan website Anda untuk pencarian AI & Generative Search Engine (GEO) agar bisnis Anda direkomendasikan AI.",
    limit: "Maksimal 1 kali optimasi konten AI.",
    color: "bg-orange-50 text-orange-600 border-orange-100",
    path: "/ecosystem/ai-optimization"
  },
  {
    key: "site_audit",
    title: "Website Audit",
    icon: Globe,
    description: "Cek skor SEO kesehatan teknis website Anda, perbaiki error crawl, dan tingkatkan performa kecepatan loading.",
    limit: "Maksimal 1 kali cek audit website.",
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    path: "/ecosystem/site-audit"
  },
  {
    key: "tracking",
    title: "SERP Tracker",
    icon: BarChart3,
    description: "Pantau ranking website Anda di mesin pencari Google Indonesia secara real-time dan analisis diagram konversi prospek.",
    limit: "Maksimal 1 kali cek ranking SERP.",
    color: "bg-cyan-50 text-cyan-600 border-cyan-100",
    path: "/ecosystem/tracking"
  }
]

export default function EcosystemGuestSelectorMobile() {
  const router = useRouter()
  const [selectedKey, setSelectedKey] = useState<string>("")
  const [selectingKey, setSelectingKey] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const selectedFeature = GUEST_FEATURES.find(f => f.key === selectedKey)

  const handleSelectFeature = (key: string, title: string, path: string) => {
    Swal.fire({
      title: "Konfirmasi Pilihan 🔒",
      html: `Anda memilih untuk menguji coba fitur <b>"${title}"</b>.<br/><br/>
             <p class="text-xs text-red-500 font-bold">⚠️ Perhatian: Setelah memilih fitur ini, Anda HANYA bisa menggunakan fitur ini. Fitur lainnya akan terkunci untuk akun tamu Anda.</p>`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, Coba Fitur",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ea580c", // super-app orange
      cancelButtonColor: "#64748b",
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
              confirmButtonColor: "#ea580c",
              timer: 1500,
              showConfirmButton: false
            })
            setTimeout(() => {
              try {
                sessionStorage.removeItem("ecosystem_progression")
              } catch {}
              window.location.href = path
            }, 800)
          } else {
            Swal.fire({ icon: "error", text: data.message || "Gagal mengaktifkan fitur", confirmButtonColor: "#ea580c" })
            setSelectingKey(null)
          }
        } catch (err) {
          Swal.fire({ icon: "error", text: "Terjadi kesalahan koneksi", confirmButtonColor: "#ea580c" })
          setSelectingKey(null)
        }
      }
    })
  }

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 max-w-md w-full mx-auto font-sans select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1 text-xs font-black uppercase text-slate-500 hover:text-orange-600 transition-colors"
        >
          <ArrowLeft size={14} /> Kembali
        </button>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full font-bold tracking-wide text-[10px] uppercase shadow-sm">
          <Sparkles size={12} /> Ecosystem Guest Mode
        </div>
      </div>

      <div className="text-center mb-6">
        <h1 className="text-xl font-black text-slate-800 tracking-tight mb-2">
          PILIH FITUR UJI COBA 🎯
        </h1>
        <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto leading-relaxed">
          Silakan pilih salah satu dari 8 fitur ekosistem bisnis untuk dicoba secara gratis. Setelah memilih, fitur lainnya akan terkunci.
        </p>
      </div>

      {/* Custom Dropdown Selection */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 text-slate-850 border border-slate-200 rounded-2xl text-xs font-extrabold outline-none focus:border-orange-500 transition-colors uppercase tracking-wide cursor-pointer"
        >
          <div className="flex items-center gap-2">
            {selectedFeature ? (
              <>
                <div className={`p-1.5 rounded-lg border ${selectedFeature.color} shrink-0`}>
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
          <div className="absolute left-0 right-0 mt-2 z-50 bg-white border border-slate-200 rounded-2xl max-h-[280px] overflow-y-auto shadow-lg p-2 space-y-1">
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
                  className={`w-full text-left px-3 py-2.5 flex items-center justify-between rounded-xl text-xs font-bold transition-colors ${
                    isSelected 
                      ? "bg-orange-50 text-orange-600" 
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg border ${item.color}`}>
                      <Icon size={14} />
                    </div>
                    <span>{item.title}</span>
                  </div>
                  {isSelected && <Check size={16} className="text-orange-600 shrink-0" />}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Feature Details */}
      {selectedFeature && (
        <div className="mt-6 border border-dashed border-slate-200 p-5 rounded-[1.8rem] space-y-4">
          <div className="flex gap-3">
            <div className={`p-3 rounded-2xl border ${selectedFeature.color} shrink-0 flex items-center justify-center w-11 h-11`}>
              {(() => {
                const Icon = selectedFeature.icon
                return <Icon size={20} />
              })()}
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-850">
                {selectedFeature.title}
              </h3>
              <p className="text-[11px] font-semibold text-slate-400 leading-relaxed mt-1">
                {selectedFeature.description}
              </p>
            </div>
          </div>

          <div className="border-t border-dashed border-slate-200/80 pt-4 flex items-center justify-between mt-1">
            <div className="max-w-[55%]">
              <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-400">Batas Tamu:</span>
              <span className="text-[10px] font-bold text-slate-650 leading-snug">{selectedFeature.limit}</span>
            </div>

            <button
              onClick={() => handleSelectFeature(selectedFeature.key, selectedFeature.title, selectedFeature.path)}
              disabled={selectingKey !== null}
              className="bg-orange-650 hover:bg-orange-700 text-white px-5 py-2.5 rounded-full text-xs font-extrabold transition-colors active:scale-95 outline-none flex items-center gap-1.5 shadow-sm shadow-orange-600/20 disabled:opacity-50"
            >
              {selectingKey === selectedFeature.key ? (
                <>
                  <Loader2 size={12} className="animate-spin" /> Proses...
                </>
              ) : (
                "Coba Fitur"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Help Link */}
      <div 
        className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-orange-600 transition-colors mt-6 cursor-pointer bg-slate-50 px-4 py-2.5 rounded-full border border-slate-150 shadow-sm" 
        onClick={() => router.push("/ecosystem/tutorial")}
      >
        <HelpCircle size={14} />
        <span>Butuh bantuan? <span className="underline font-black text-orange-600">Lihat Tutorial</span></span>
      </div>
    </div>
  )
}

