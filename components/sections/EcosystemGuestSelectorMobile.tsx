"use client"

import { useState } from "react"
import { Search, Users, Mail, Key, Wrench, BarChart3, HelpCircle, Loader2, Sparkles, ArrowLeft } from "lucide-react"
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
  const [selectingKey, setSelectingKey] = useState<string | null>(null)

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
    <div className="min-h-screen bg-[#f4f6f9] py-10 px-4 flex flex-col items-center justify-start font-sans select-none relative pb-28">
      {/* Back button */}
      <div className="w-full max-w-md flex justify-start mb-6 mt-2">
        <Link
          href="/home"
          className="flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-50 text-xs font-extrabold text-slate-700 border border-slate-200 rounded-full shadow-sm active:scale-95 transition-all"
        >
          <ArrowLeft size={14} strokeWidth={3} />
          Kembali ke Dashboard
        </Link>
      </div>

      <div className="max-w-md w-full text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full font-bold tracking-wide text-[10px] uppercase mb-4 shadow-sm">
          <Sparkles size={12} /> Ecosystem Guest Mode
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
          PILIH 1 FITUR UJI COBA 🎯
        </h1>
        <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto leading-relaxed">
          Sebagai tamu, silakan pilih salah satu dari 6 fitur ekosistem bisnis untuk dicoba. Setelah dipilih, fitur lainnya akan otomatis terkunci.
        </p>
      </div>

      {/* Grid Features */}
      <div className="max-w-md w-full flex flex-col gap-4">
        {GUEST_FEATURES.map((item) => {
          const Icon = item.icon
          const isSelecting = selectingKey === item.key

          return (
            <div
              key={item.key}
              className="bg-white rounded-[1.8rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all duration-200"
            >
              <div className="flex gap-3 mb-4">
                <div className={`p-3 rounded-2xl border ${item.color} shrink-0 flex items-center justify-center w-12 h-12`}>
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800">
                    {item.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-400 leading-relaxed mt-1">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200/80 pt-4 flex items-center justify-between mt-1">
                <div className="max-w-[55%]">
                  <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-400">Batas Tamu:</span>
                  <span className="text-[10px] font-bold text-slate-600 leading-snug">{item.limit}</span>
                </div>

                <button
                  onClick={() => handleSelectFeature(item.key, item.title, item.path)}
                  disabled={selectingKey !== null}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-full text-[11px] font-extrabold transition-colors active:scale-95 outline-none flex items-center gap-1.5 shadow-sm shadow-orange-600/20 disabled:opacity-50"
                >
                  {isSelecting ? (
                    <>
                      <Loader2 size={12} className="animate-spin" /> Proses...
                    </>
                  ) : (
                    "Coba Fitur"
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Help Link */}
      <div 
        className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-orange-600 transition-colors mt-8 cursor-pointer bg-white px-5 py-3 rounded-full border border-slate-200/60 shadow-sm" 
        onClick={() => router.push("/ecosystem/tutorial")}
      >
        <HelpCircle size={15} />
        <span>Butuh bantuan? <span className="underline font-black text-orange-600">Lihat Tutorial</span></span>
      </div>
    </div>
  )
}
