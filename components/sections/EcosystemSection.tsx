"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { 
  Search, Users, Send, Key, FileText, LineChart, 
  Sparkles, ArrowRight, CheckCircle2, Lock, HelpCircle, Globe, Mail
} from "lucide-react"

export default function EcosystemSection() {
  const { status } = useSession()
  const [activeIdx, setActiveIdx] = useState(0)

  const features = [
    {
      icon: Search,
      title: "Cari Lead Bisnis",
      description: "Temukan prospek bisnis potensial berdasarkan kategori & lokasi langsung dari Google Maps. Lengkap dengan website, alamat, dan kontak publik.",
      tag: "Serper.dev API"
    },
    {
      icon: Users,
      title: "CRM Terintegrasi",
      description: "Jantung dari ekosistem bisnis. Kelola database prospek, catat histori interaksi, dan pantau status deals (New, Contacted, Deal) dengan mudah.",
      tag: "Database Hub"
    },
    {
      icon: Send,
      title: "Email Blast Personal",
      description: "Kirim email massal terpersonalisasi langsung menggunakan server SMTP Anda sendiri (seperti Gmail App Pass). 100% kontrol & aman di tangan Anda.",
      tag: "Nodemailer SMTP"
    },
    {
      icon: Key,
      title: "Riset Kata Kunci AI",
      description: "Dapatkan puluhan saran keyword SEO relevan, metrik volume pencarian bulanan, tingkat kesulitan, serta user intent dalam hitungan detik.",
      tag: "Gemini 2.5 Flash AI"
    },
    {
      icon: FileText,
      title: "SEO Content Writer",
      description: "Generate draf artikel blog 800+ kata SEO-friendly, meta tag optimal, dan JSON-LD FAQ schema siap pakai untuk menaikkan ranking web Anda.",
      tag: "Gemini 2.5 Flash AI"
    },
    {
      icon: Sparkles,
      title: "AI SEO Optimization",
      description: "Optimalkan konten website Anda untuk pencarian AI & Generative Search Engine (GEO) agar bisnis Anda masuk rekomendasi Gemini/ChatGPT.",
      tag: "Gemini AI GEO"
    },
    {
      icon: Globe,
      title: "Website Audit Score",
      description: "Analisis kesehatan teknis SEO website Anda, perbaiki error crawl, serta tingkatkan kecepatan performa loading secara instan.",
      tag: "Technical SEO"
    },
    {
      icon: LineChart,
      title: "SERP Rank Tracking",
      description: "Pantau pergerakan peringkat keyword bisnis Anda di mesin pencari Google Indonesia secara akurat dan berkala untuk analisis kompetitor.",
      tag: "Rank Monitor"
    }
  ]

  const tiers = [
    {
      name: "Tamu (Tanpa Login)",
      description: "Sangat cocok untuk mencoba fitur & melihat kecocokan layanan.",
      features: [
        "Hanya boleh memilih 1 Fitur utama",
        "Fitur lain terkunci otomatis",
        "Email Blast: Maks 5 email total",
        "Fitur lainnya: Maks 1 kali input/eksekusi",
      ],
      ctaText: "Mulai Coba Gratis",
      ctaHref: "/lead-finder",
      highlight: false
    },
    {
      name: "Akun Gratis (Login)",
      description: "Solusi mantap untuk bisnis UMKM yang sedang mulai tumbuh.",
      features: [
        "Buka Akses ke Semua 6 Fitur",
        "Email Blast: Maks 45 email total",
        "Fitur lainnya: Maks 5 input per 5 hari",
        "Sinkronisasi database dengan CRM",
      ],
      ctaText: status === "authenticated" ? "Masuk ke Dashboard" : "Daftar Akun Gratis",
      ctaHref: status === "authenticated" ? "/lead-finder" : "/loginUser",
      highlight: true
    },
    {
      name: "Premium / Partner",
      description: "Dukungan penuh untuk automasi skala besar & agensi profesional.",
      features: [
        "Akses Unlimited Tanpa Batas",
        "Tanpa limit Email Blast",
        "Tanpa limit input AI & SERP",
        "Prioritas fitur & server dedicated",
      ],
      ctaText: "Hubungi Hubungi Admin",
      ctaHref: "https://wa.me/6285133737623?text=Halo%20Admin,%20saya%20tertarik%20untuk%20upgrade%20ke%20Premium%20Ecosystem%20Bisnis",
      highlight: false
    }
  ]

  return (
    <section id="ecosystem-section" className="relative py-24 lg:py-32 bg-white dark:bg-black overflow-hidden border-t border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-4 py-2 text-xs font-bold mb-2 uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5 text-black dark:text-white" />
            <span className="text-black dark:text-white">All-In-One Partner</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tight">
            Ecosystem Bisnis Anda
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
            Satu alur kerja utuh dari mencari prospek, promosi email blast, hingga optimasi visibilitas di Google.
          </p>
          <div className="pt-4 flex justify-center">
            <Link
              href="/tutorial"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white border border-black dark:border-white font-bold text-xs uppercase tracking-widest transition-all"
            >
              <HelpCircle className="w-4 h-4" />
              Lihat Tutorial Ekosistem
            </Link>
          </div>
        </div>

        {/* ================= INTERACTIVE WORKFLOW SELECTOR ================= */}
        <div className="flex flex-col lg:flex-row items-stretch mb-24 border-l border-t border-gray-200 dark:border-white/10 bg-white dark:bg-black">
          
          {/* Left panel: Vertical Steps List */}
          <div className="w-full lg:w-[350px] flex flex-row lg:flex-col shrink-0 border-r border-b border-gray-200 dark:border-white/10 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none">
            {features.map((f, i) => {
              const Icon = f.icon
              const isActive = activeIdx === i
              return (
                <button
                  key={i}
                  onClick={() => setActiveIdx(i)}
                  className={`flex items-center gap-4 px-6 py-5 text-left transition-all duration-300 w-full shrink-0 border-b border-gray-200 dark:border-white/10 ${
                    isActive
                      ? "bg-black dark:bg-white text-white dark:text-black"
                      : "bg-white dark:bg-black text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  <div className={`p-2 border transition-colors ${
                    isActive 
                      ? "bg-white/10 border-white/20 text-white dark:text-black" 
                      : "bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-black dark:text-white"
                  }`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <span className="block text-[8px] font-bold uppercase tracking-widest opacity-60 leading-none mb-1">Step 0{i + 1}</span>
                    <span className="text-sm font-bold tracking-tight leading-none block">{f.title}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Right panel: Active Feature Detail display */}
          <div className="flex-1 min-h-[350px] bg-white dark:bg-black border-r border-b border-gray-200 dark:border-white/10 p-8 md:p-12 flex flex-col md:flex-row justify-between gap-8 relative overflow-hidden transition-all duration-500">
            {/* Subtle background abstract decorations */}
            <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-gray-500/5 dark:bg-white/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex-1 flex flex-col justify-between relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white">
                    {(() => {
                      const ActiveIcon = features[activeIdx].icon
                      return <ActiveIcon size={24} />
                    })()}
                  </div>
                  <span className="text-[10px] font-black tracking-widest text-black dark:text-white uppercase border border-gray-200 dark:border-white/10 px-2.5 py-1 bg-gray-50 dark:bg-white/5">
                    {features[activeIdx].tag}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-4 tracking-tight uppercase">
                  {features[activeIdx].title}
                </h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl">
                  {features[activeIdx].description}
                </p>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-100 dark:border-white/10">
                <Link
                  href="/lead-finder"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-widest text-xs border border-black dark:border-white hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white transition-colors"
                >
                  Buka & Coba Modul Ini <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Fake mockup representation on the right of the detail panel */}
            <div className="w-full md:w-[260px] lg:w-[320px] aspect-[4/3] md:aspect-auto border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-4 overflow-hidden shrink-0 flex flex-col justify-between relative">
              {/* Header bars */}
              <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-white/10">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-gray-300 dark:bg-white/20" />
                  <div className="w-2 h-2 bg-gray-300 dark:bg-white/20" />
                  <div className="w-2 h-2 bg-gray-300 dark:bg-white/20" />
                </div>
                <div className="h-3 w-24 bg-gray-250 dark:bg-white/5" />
              </div>

              {/* Body Representation of active feature */}
              <div className="flex-1 py-4 flex flex-col gap-3 justify-center">
                {activeIdx === 0 && ( // Lead Finder
                  <>
                    <div className="h-8 w-full bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-1.5 flex items-center gap-2">
                      <Search size={10} className="text-black dark:text-white" />
                      <div className="h-1.5 w-2/3 bg-black dark:bg-white" />
                    </div>
                    <div className="h-12 w-full bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-2 flex flex-col gap-1.5">
                      <div className="h-2 w-1/2 bg-gray-300 dark:bg-white/20" />
                      <div className="h-1.5 w-3/4 bg-gray-255 dark:bg-white/10" />
                    </div>
                  </>
                )}
                {activeIdx === 1 && ( // CRM
                  <>
                    <div className="flex gap-2">
                      <div className="h-8 w-1/3 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-2 flex flex-col justify-between">
                        <div className="h-1.5 w-1/2 bg-black dark:bg-white" />
                        <div className="h-1 w-full bg-gray-300 dark:bg-white/20" />
                      </div>
                      <div className="h-8 w-1/3 bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-2 flex flex-col justify-between">
                        <div className="h-1.5 w-1/2 bg-gray-300 dark:bg-white/20" />
                        <div className="h-1 w-full bg-gray-200 dark:bg-white/10" />
                      </div>
                      <div className="h-8 w-1/3 bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-2 flex flex-col justify-between">
                        <div className="h-1.5 w-1/2 bg-gray-300 dark:bg-white/20" />
                        <div className="h-1 w-full bg-gray-200 dark:bg-white/10" />
                      </div>
                    </div>
                    <div className="h-8 w-full bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-2 flex items-center gap-3">
                      <div className="w-2.5 h-2.5 bg-black dark:bg-white" />
                      <div className="h-2 w-1/3 bg-gray-300 dark:bg-white/20" />
                    </div>
                  </>
                )}
                {activeIdx === 2 && ( // Blast
                  <>
                    <div className="h-12 w-full bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-2 flex flex-col justify-between">
                      <div className="flex items-center gap-2">
                        <Mail size={10} className="text-black dark:text-white" />
                        <div className="h-2 w-2/3 bg-gray-205 dark:bg-white/15" />
                      </div>
                      <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10" />
                      <div className="h-1.5 w-5/6 bg-gray-200 dark:bg-white/10" />
                    </div>
                    <div className="h-4 w-1/2 bg-black dark:bg-white text-white dark:text-black text-[8px] font-bold uppercase tracking-wider flex items-center justify-center self-end border border-black dark:border-white">
                      Email Sent ✓
                    </div>
                  </>
                )}
                {activeIdx === 3 && ( // Keyword
                  <>
                    <div className="flex gap-2 items-center">
                      <Key size={12} className="text-black dark:text-white" />
                      <div className="h-3 w-1/2 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10" />
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="h-5 bg-white dark:bg-black border border-gray-200 dark:border-white/10" />
                      <div className="h-5 bg-white dark:bg-black border border-gray-200 dark:border-white/10" />
                      <div className="h-5 bg-white dark:bg-black border border-gray-200 dark:border-white/10" />
                      <div className="h-5 bg-white dark:bg-black border border-gray-200 dark:border-white/10" />
                    </div>
                  </>
                )}
                {activeIdx === 4 && ( // SEO
                  <>
                    <div className="h-14 w-full bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-2 flex flex-col justify-between">
                      <div className="h-2.5 w-1/3 bg-black dark:bg-white" />
                      <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10" />
                      <div className="h-1.5 w-5/6 bg-gray-200 dark:bg-white/10" />
                      <div className="h-1.5 w-2/3 bg-gray-200 dark:bg-white/10" />
                    </div>
                  </>
                )}
                {activeIdx === 5 && ( // GEO (AI Opt)
                  <>
                    <div className="h-14 w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 p-2.5 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles size={10} className="text-black dark:text-white" />
                        <div className="h-2 w-1/2 bg-black dark:bg-white" />
                      </div>
                      <div className="h-1.5 w-5/6 bg-gray-200 dark:bg-white/10" />
                      <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10" />
                    </div>
                  </>
                )}
                {activeIdx === 6 && ( // Audit
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 border border-black dark:border-white flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-black dark:text-white">92%</span>
                      </div>
                      <div className="flex-grow flex flex-col gap-1.5">
                        <div className="h-2 w-3/4 bg-gray-300 dark:bg-white/20" />
                        <div className="h-1.5 w-1/2 bg-gray-200 dark:bg-white/10" />
                      </div>
                    </div>
                  </>
                )}
                {activeIdx === 7 && ( // Tracking
                  <>
                    <div className="h-14 w-full flex items-end gap-1 px-2 pb-1 bg-white dark:bg-black border border-gray-200 dark:border-white/10 overflow-hidden">
                      <div className="h-4 flex-1 bg-black/30 dark:bg-white/30" />
                      <div className="h-8 flex-1 bg-black/50 dark:bg-white/50" />
                      <div className="h-6 flex-1 bg-black/40 dark:bg-white/40" />
                      <div className="h-10 flex-1 bg-black/70 dark:bg-white/70" />
                      <div className="h-12 flex-1 bg-black dark:bg-white" />
                    </div>
                  </>
                )}
              </div>

              {/* Status bar */}
              <div className="h-4 w-full bg-gray-50 dark:bg-white/5 flex items-center justify-between px-2 text-[7px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border border-gray-200/20 dark:border-white/5">
                <span>Console active</span>
                <span className="w-1 h-1 bg-black dark:bg-white animate-pulse" />
              </div>
            </div>
          </div>

        </div>

        {/* ================= PRICING & LIMIT TIER SECTION ================= */}
        <div className="text-center mb-16 space-y-4">
          <h3 className="text-3xl md:text-4xl font-bold text-black dark:text-white tracking-tight">
            Skema Akses & Limit Penggunaan
          </h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
            Semua orang bisa langsung menggunakan ekosistem bisnis kami. Dapatkan kuota lebih banyak dengan membuat akun gratis.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-0 items-stretch max-w-6xl mx-auto border-l border-t border-gray-200 dark:border-white/10 bg-white dark:bg-black">
          {tiers.map((t, index) => (
            <div
              key={index}
              className={`relative flex flex-col bg-white dark:bg-black transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/5 p-8 md:p-10 border-r border-b border-gray-200 dark:border-white/10 ${
                t.highlight ? "z-20 shadow-2xl scale-[1.02] border border-black dark:border-white" : "z-10"
              }`}
            >
              {/* Highlight Badge */}
              {t.highlight && (
                <div className="absolute top-0 right-0">
                  <div className="bg-black dark:bg-white text-white dark:text-black px-5 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles size={12} className="fill-current" />
                    Rekomendasi
                  </div>
                </div>
              )}

              {/* Tier Header */}
              <div className="mb-8 pt-4">
                <h3 className="text-2xl font-bold text-black dark:text-white">{t.name}</h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2 min-h-[40px]">
                  {t.description}
                </p>
              </div>

              <div className="h-px w-full bg-gray-200 dark:bg-white/10 mb-8" />

              {/* Features List */}
              <div className="flex-1 space-y-4 mb-10">
                <p className="text-[10px] font-bold text-black dark:text-white uppercase tracking-widest">Aturan Penggunaan:</p>
                {t.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-gray-50 dark:bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5 border border-gray-200 dark:border-white/10">
                      <CheckCircle2 size={12} className="text-black dark:text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              {t.ctaHref.startsWith("http") ? (
                <a
                  href={t.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 py-4 font-bold transition-all duration-300 group/btn ${
                    t.highlight 
                      ? "bg-black dark:bg-white text-white dark:text-black hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white border border-black dark:border-white" 
                      : "bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10"
                  }`}
                >
                  {t.ctaText}
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </a>
              ) : (
                <Link
                  href={t.ctaHref}
                  className={`w-full flex items-center justify-center gap-2 py-4 font-bold transition-all duration-300 group/btn ${
                    t.highlight 
                      ? "bg-black dark:bg-white text-white dark:text-black hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white border border-black dark:border-white" 
                      : "bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10"
                  }`}
                >
                  {t.ctaText}
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
