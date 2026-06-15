"use client"

import { useState } from "react"
import { Search, Users, Mail, Key, Wrench, BarChart3, HelpCircle, Loader2, Sparkles, ArrowLeft } from "lucide-react"
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
  const [selectingKey, setSelectingKey] = useState<string | null>(null)

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
            // Force reload and redirect to feature path
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
    <div className="min-h-screen bg-gray-50 dark:bg-black py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans select-none relative">
      {/* Back to landing page button */}
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-white/5 border-2 border-black dark:border-white text-xs font-black uppercase tracking-widest text-black dark:text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.25)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
        >
          <ArrowLeft size={14} strokeWidth={3} />
          Kembali ke Beranda
        </Link>
      </div>
      <div className="max-w-4xl w-full text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black tracking-widest text-xs uppercase mb-6 shadow-[3px_3px_0px_0px_rgba(16,185,129,0.3)]">
          <Sparkles size={14} /> Ecosystem Trial Guest Mode
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-black dark:text-white uppercase tracking-tight mb-4">
          Pilih 1 Fitur Uji Coba Anda 🎯
        </h1>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Sebagai tamu, Anda dipersilakan memilih salah satu dari 6 fitur ekosistem bisnis kami untuk dicoba secara gratis. Setelah memilih salah satu, fitur lainnya akan otomatis terkunci untuk kunjungan Anda.
        </p>
      </div>

      {/* Grid Features */}
      <div className="max-w-5xl w-full grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {GUEST_FEATURES.map((item) => {
          const Icon = item.icon
          const isSelecting = selectingKey === item.key

          return (
            <div
              key={item.key}
              className="bg-white dark:bg-white/5 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] flex flex-col justify-between hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.3)] transition-all duration-200"
            >
              <div>
                {/* Header Card */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 border-2 border-black dark:border-white ${item.color.split(' ')[0]}`}>
                    <Icon size={20} className="text-black dark:text-white" />
                  </div>
                  <h3 className="text-lg font-black text-black dark:text-white uppercase tracking-wider">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                  {item.description}
                </p>
              </div>

              <div>
                <div className="border-t-2 border-dashed border-gray-200 dark:border-gray-800 pt-4 mb-4">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-gray-400">Batas Tamu:</span>
                  <span className="text-xs font-bold text-black dark:text-white">{item.limit}</span>
                </div>

                <button
                  onClick={() => handleSelectFeature(item.key, item.title, item.path)}
                  disabled={selectingKey !== null}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-xs border-2 border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[1px_1px_0px_0px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50"
                >
                  {isSelecting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Mengaktifkan...
                    </>
                  ) : (
                    "Pilih & Coba Fitur Ini"
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer / Tutorial Link */}
      <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer" onClick={() => router.push("/tutorial")}>
        <HelpCircle size={16} />
        <span>Butuh bantuan memahami fitur? <span className="underline font-black">Lihat Halaman Tutorial Ekosistem Bisnis</span></span>
      </div>
    </div>
  )
}
