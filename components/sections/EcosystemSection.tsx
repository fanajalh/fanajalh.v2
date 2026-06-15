"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { 
  Search, Users, Send, Key, FileText, LineChart, 
  Sparkles, ArrowRight, CheckCircle2, Lock, HelpCircle 
} from "lucide-react"

export default function EcosystemSection() {
  const { status } = useSession()

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
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-black dark:text-white" />
            <span className="text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.2em]">
              All-In-One Partner
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white tracking-tight">
            Ecosystem Bisnis Anda
          </h2>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
            Satu alur kerja utuh dari mencari prospek, promosi email blast, hingga optimasi visibilitas di Google.
          </p>
          <div className="pt-2 flex justify-center">
            <Link
              href="/tutorial"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-xs font-bold transition-all uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(16,185,129,0.3)]"
            >
              <HelpCircle className="w-4 h-4" />
              Lihat Tutorial Ekosistem
            </Link>
          </div>
        </div>

        {/* ================= FEATURES GRID ================= */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-gray-200 dark:border-white/10 bg-white dark:bg-black mb-24">
          {features.map((f, i) => (
            <div key={i} className="p-8 bg-white dark:bg-black border-r border-b border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-black dark:text-white">
                    <f.icon size={20} />
                  </div>
                  <span className="text-[9px] font-black tracking-widest text-gray-400 uppercase border border-gray-200 dark:border-white/10 px-2 py-0.5 bg-gray-50 dark:bg-white/5">
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-3 tracking-tight">
                  {f.title}
                </h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                  {f.description}
                </p>
              </div>
              <div className="mt-8 pt-4 flex items-center gap-1.5 text-xs font-bold text-black dark:text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                Buka Fitur <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
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
