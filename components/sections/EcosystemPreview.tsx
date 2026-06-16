"use client"

import Link from "next/link"
import { 
  Search, Users, Send, Key, FileText, Sparkles, Globe, LineChart, 
  ArrowRight, HelpCircle
} from "lucide-react"

export default function EcosystemPreview() {
  const steps = [
    {
      icon: Search,
      stepNum: "01",
      title: "Cari Lead Bisnis",
      description: "Temukan prospek bisnis potensial berdasarkan kategori & lokasi dari Google Maps. Lengkap dengan website, alamat, dan kontak."
    },
    {
      icon: Users,
      stepNum: "02",
      title: "CRM Terintegrasi",
      description: "Kelola database prospek, catat histori interaksi, dan pantau status deals dengan mudah dalam satu tempat."
    },
    {
      icon: Send,
      stepNum: "03",
      title: "Email Blast Personal",
      description: "Kirim email massal terpersonalisasi langsung menggunakan SMTP server Anda sendiri. 100% aman dan terkontrol."
    },
    {
      icon: Key,
      stepNum: "04",
      title: "Riset Kata Kunci AI",
      description: "Dapatkan saran keyword SEO relevan, metrik volume pencarian bulanan, dan user intent dalam hitungan detik."
    },
    {
      icon: FileText,
      stepNum: "05",
      title: "SEO Content Writer",
      description: "Buat draf artikel blog 800+ kata SEO-friendly, meta tag optimal, dan JSON-LD FAQ schema siap pakai."
    },
    {
      icon: Sparkles,
      stepNum: "06",
      title: "AI SEO Optimization",
      description: "Optimalkan konten website Anda untuk pencarian AI & Generative Engine agar bisnis Anda masuk rekomendasi."
    },
    {
      icon: Globe,
      stepNum: "07",
      title: "Website Audit Score",
      description: "Analisis kesehatan teknis SEO website Anda, perbaiki error crawl, serta tingkatkan kecepatan loading."
    },
    {
      icon: LineChart,
      stepNum: "08",
      title: "SERP Rank Tracking",
      description: "Pantau pergerakan peringkat keyword bisnis Anda di mesin pencari Google Indonesia secara akurat."
    }
  ]

  return (
    <section id="ecosystem" className="relative py-24 lg:py-32 bg-white dark:bg-black overflow-hidden border-t border-gray-200 dark:border-white/10 selection:bg-orange-500 selection:text-white">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),dark:linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 text-xs font-bold mb-2 uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5 text-black dark:text-white" />
            <span className="text-black dark:text-white">All-In-One Partner</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight">
            Ecosystem Bisnis Anda
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-semibold max-w-2xl mx-auto leading-relaxed">
            Satu alur kerja utuh dari mencari prospek, promosi email blast, hingga optimasi visibilitas di Google.
          </p>
          <div className="pt-4 flex flex-wrap gap-4 justify-center">
            <Link
              href="/lead-finder"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white border-4 border-black dark:border-white font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] hover:translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-none"
            >
              Coba Sekarang
              <Sparkles className="w-4 h-4 animate-pulse text-white" />
            </Link>
            <Link
              href="/ecosystem"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white border-4 border-black dark:border-white font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] hover:translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-none"
            >
              Buka Modul Ekosistem
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/tutorial"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-black text-black dark:text-white hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white border-4 border-black dark:border-white font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] hover:translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-none"
            >
              <HelpCircle className="w-4 h-4" />
              Lihat Tutorial Ekosistem
            </Link>
          </div>
        </div>

        {/* ================= 8 STEPS GRID ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((s, index) => {
            const Icon = s.icon
            return (
              <div 
                key={index}
                className="group relative bg-gray-50 dark:bg-white/5 p-6 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.2)] transition-all duration-300 flex flex-col justify-between rounded-none"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-emerald-500 dark:text-emerald-400 tracking-widest uppercase">
                      Step {s.stepNum}
                    </span>
                    <div className="p-2 bg-white dark:bg-black border-2 border-black dark:border-white text-black dark:text-white">
                      <Icon size={16} />
                    </div>
                  </div>
                  <h3 className="text-base font-black text-black dark:text-white mb-2 uppercase tracking-wide">
                    {s.title}
                  </h3>
                  <p className="text-xs text-gray-550 dark:text-gray-400 font-semibold leading-relaxed">
                    {s.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t-2 border-black/10 dark:border-white/10">
                  <Link 
                    href={`/ecosystem?step=${index}`}
                    className="inline-flex items-center gap-1.5 text-[10px] font-black text-black dark:text-white hover:text-emerald-500 dark:hover:text-emerald-400 uppercase tracking-widest transition-colors"
                  >
                    Buka Modul <ArrowRight size={10} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
