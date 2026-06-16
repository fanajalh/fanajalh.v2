"use client"

import Link from "next/link"
import { 
  ArrowLeft, Search, Users, Send, Key, FileText, Sparkles, Globe, LineChart,
  ArrowRight, CheckCircle2, MessageCircle
} from "lucide-react"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function EcosystemPage() {
  const steps = [
    {
      icon: Search,
      stepNum: "01",
      title: "Cari Lead Bisnis",
      tag: "Serper.dev API",
      href: "/lead-finder",
      description: "Temukan prospek bisnis potensial berdasarkan kategori & lokasi langsung dari Google Maps. Dapatkan data lengkap berupa website, alamat, nomor telepon, dan kontak publik.",
      howItWorks: "Masukkan kata kunci (misal: 'cafe') dan lokasi (misal: 'purwokerto'). Sistem akan mengambil data langsung dari Google Maps dan menyusunnya dalam tabel prospek yang rapi."
    },
    {
      icon: Users,
      stepNum: "02",
      title: "CRM Terintegrasi",
      tag: "Database Hub",
      href: "/crm",
      description: "Kelola database prospek hasil pencarian Anda, catat histori interaksi, dan pantau status kesepakatan (deals) dari prospek baru hingga sukses.",
      howItWorks: "Simpan prospek dari Lead Finder ke CRM dengan sekali klik. Ubah status prospek (New, Contacted, Deal), dan tambahkan catatan khusus untuk mempermudah follow-up."
    },
    {
      icon: Send,
      stepNum: "03",
      title: "Email Blast Personal",
      tag: "Nodemailer SMTP",
      href: "/blast",
      description: "Kirim email promosi massal terpersonalisasi langsung menggunakan server SMTP Anda sendiri. Aman, memiliki kontrol 100%, dan bebas biaya langganan bulanan.",
      howItWorks: "Tulis email template menggunakan tag personalisasi (seperti nama bisnis atau pemilik). Hubungkan dengan SMTP Gmail atau server Anda sendiri, lalu sebar ke database CRM secara otomatis."
    },
    {
      icon: Key,
      stepNum: "04",
      title: "Riset Kata Kunci AI",
      tag: "Gemini 2.5 Flash AI",
      href: "/keyword",
      description: "Temukan saran kata kunci (keywords) SEO relevan, lengkap dengan metrik perkiraan volume pencarian bulanan, tingkat kesulitan, serta user intent dalam sekejap.",
      howItWorks: "Ketik kata kunci utama bisnis Anda. AI akan menganalisis tren pencarian, memberikan daftar long-tail keywords potensial, dan merekomendasikan kata kunci yang paling mudah dimenangkan."
    },
    {
      icon: FileText,
      stepNum: "05",
      title: "SEO Content Writer",
      tag: "Gemini 2.5 Flash AI",
      href: "/seo-tools",
      description: "Buat draf artikel blog dengan panjang 800+ kata yang sudah teroptimasi SEO, lengkap dengan meta title, meta description, dan JSON-LD FAQ schema siap pakai.",
      howItWorks: "Pilih kata kunci yang ingin ditargetkan. AI akan menulis artikel yang informatif, mengalir alami, terstruktur dengan tag heading H2/H3, dan siap dipublikasikan ke blog Anda."
    },
    {
      icon: Sparkles,
      stepNum: "06",
      title: "AI SEO Optimization",
      tag: "Gemini AI GEO",
      href: "/ai-optimization",
      description: "Optimalkan konten website Anda agar ramah terhadap mesin pencari berbasis AI (Generative Engine Optimization / GEO) agar masuk ke rekomendasi ChatGPT & Gemini.",
      howItWorks: "Tempel draf artikel Anda. AI akan menganalisis dan menambahkan elemen optimasi kutipan, statistik, dan struktur argumen agar mesin pencari AI lebih mudah merekomendasikan artikel Anda."
    },
    {
      icon: Globe,
      stepNum: "07",
      title: "Website Audit Score",
      tag: "Technical SEO",
      href: "/site-audit",
      description: "Analisis kesehatan teknis SEO website Anda untuk menemukan error crawl, tautan rusak, masalah kecepatan performa loading, dan isu indeks halaman.",
      howItWorks: "Masukkan URL website Anda. Sistem akan melakukan audit komprehensif, memberikan skor kesehatan teknis, serta petunjuk perbaikan langkah demi langkah."
    },
    {
      icon: LineChart,
      stepNum: "08",
      title: "SERP Rank Tracking",
      tag: "Rank Monitor",
      href: "/tracking",
      description: "Pantau pergerakan peringkat kata kunci bisnis Anda di mesin pencari Google Indonesia secara akurat dan berkala guna memantau efektivitas strategi SEO Anda.",
      howItWorks: "Daftarkan domain dan daftar kata kunci target Anda. Sistem akan melacak posisi artikel Anda di halaman hasil pencarian Google (SERP) secara otomatis setiap periode tertentu."
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
      ctaText: "Daftar Akun Gratis",
      ctaHref: "/loginUser",
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
      ctaText: "Hubungi Admin via WA",
      ctaHref: "https://wa.me/6285133737623?text=Halo%20Admin,%20saya%20tertarik%20untuk%20upgrade%2520ke%2520Premium%2520Ecosystem%2520Bisnis",
      highlight: false
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pb-24 selection:bg-orange-500 selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors font-bold text-sm"
          >
            <ArrowLeft size={18} />
            Kembali ke Beranda
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2 border-l border-gray-200 dark:border-white/10 pl-3">
              <span className="font-black tracking-tight text-sm uppercase">
                AllFanajalh <span className="text-emerald-500">Ecosystem</span>
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pt-16 relative">
        {/* Intro */}
        <div className="text-center mb-24 space-y-4">
          <div className="inline-flex items-center gap-2 bg-gray-50 dark:bg-white/5 border-2 border-black dark:border-white px-4 py-2 text-xs font-black uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Alur Automasi Bisnis</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-black dark:text-white uppercase tracking-tight">
            Ecosystem Bisnis Anda
          </h1>
          <p className="text-lg text-gray-500 dark:text-gray-400 font-semibold max-w-2xl mx-auto leading-relaxed">
            Satu alur kerja utuh dan lengkap dari mencari data prospek tertarget, penawaran otomatis via email, hingga optimalisasi serta pelacakan ranking di hasil pencarian Google.
          </p>
        </div>

        {/* Timeline Flow of Steps */}
        <div className="space-y-16 mb-32">
          <div className="border-l-4 border-black dark:border-white pl-6 sm:pl-10 ml-4 sm:ml-6 space-y-20 relative">
            {steps.map((s, idx) => {
              const Icon = s.icon
              return (
                <div key={idx} className="relative">
                  {/* Step Dot & Icon Indicator */}
                  <div className="absolute -left-[46px] sm:-left-[62px] top-1.5 w-10 h-10 sm:w-12 sm:h-12 bg-black dark:bg-white text-white dark:text-black border-4 border-black dark:border-white flex items-center justify-center font-black text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.15)] rounded-none">
                    <Icon size={18} />
                  </div>

                  {/* Step Card Content */}
                  <div className="bg-white dark:bg-black border-4 border-black dark:border-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)] rounded-none hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-500 dark:text-emerald-450 font-black tracking-widest text-sm uppercase">Step {s.stepNum}</span>
                        <h3 className="text-xl sm:text-2xl font-black text-black dark:text-white uppercase tracking-wide">{s.title}</h3>
                      </div>
                      <span className="text-[10px] font-black tracking-widest text-black dark:text-white uppercase border-2 border-black dark:border-white px-3 py-1 bg-gray-50 dark:bg-white/5">
                        {s.tag}
                      </span>
                    </div>

                    <p className="text-base font-semibold text-black dark:text-white mb-4 leading-relaxed">
                      {s.description}
                    </p>

                    <div className="bg-gray-50 dark:bg-white/5 border-2 border-black dark:border-white/20 p-4 mb-6">
                      <h4 className="text-xs font-black text-black dark:text-white uppercase tracking-widest mb-1.5">Cara Kerja:</h4>
                      <p className="text-xs text-gray-505 dark:text-gray-400 font-semibold leading-relaxed">{s.howItWorks}</p>
                    </div>

                    <div className="flex justify-end">
                      <Link
                        href={s.href}
                        className="group inline-flex items-center gap-2 px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white border-2 border-black dark:border-white font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                      >
                        Coba Modul Ini <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ================= PRICING & LIMIT TIER SECTION ================= */}
        <div className="text-center mb-16 space-y-4">
          <h3 className="text-3xl md:text-4xl font-black text-black dark:text-white tracking-tight uppercase">
            Skema Akses & Limit Penggunaan
          </h3>
          <p className="text-gray-500 dark:text-gray-400 font-semibold max-w-2xl mx-auto leading-relaxed">
            Semua orang bisa langsung menggunakan ekosistem bisnis kami. Dapatkan kuota lebih banyak dengan membuat akun gratis secara instan.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {tiers.map((t, index) => (
            <div
              key={index}
              className={`relative flex flex-col bg-white dark:bg-black transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/5 p-8 md:p-10 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)] rounded-none ${
                t.highlight ? "z-20 bg-yellow-500/5 dark:bg-yellow-500/5" : "z-10"
              }`}
            >
              {/* Highlight Badge */}
              {t.highlight && (
                <div className="absolute top-0 right-0">
                  <div className="bg-black dark:bg-white text-white dark:text-black px-5 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border-b-2 border-l-2 border-black dark:border-white">
                    <Sparkles size={12} className="fill-current text-yellow-500" />
                    Rekomendasi
                  </div>
                </div>
              )}

              {/* Tier Header */}
              <div className="mb-8 pt-4">
                <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-wide">{t.name}</h3>
                <p className="text-xs font-semibold text-gray-505 dark:text-gray-400 mt-2 min-h-[40px] leading-relaxed">
                  {t.description}
                </p>
              </div>

              <div className="h-1 w-full bg-black dark:bg-white mb-8" />

              {/* Features List */}
              <div className="flex-1 space-y-4 mb-10">
                <p className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest">Aturan Penggunaan:</p>
                {t.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-gray-50 dark:bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5 border-2 border-black dark:border-white">
                      <CheckCircle2 size={12} className="text-black dark:text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 leading-normal">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              {t.ctaHref.startsWith("http") ? (
                <a
                  href={t.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full flex items-center justify-center gap-2 py-4 font-black transition-all duration-300 group/btn border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                    t.highlight 
                      ? "bg-black dark:bg-white text-white dark:text-black hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white" 
                      : "bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                  }`}
                >
                  {t.ctaText}
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </a>
              ) : (
                <Link
                  href={t.ctaHref}
                  className={`w-full flex items-center justify-center gap-2 py-4 font-black transition-all duration-300 group/btn border-4 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${
                    t.highlight 
                      ? "bg-black dark:bg-white text-white dark:text-black hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white" 
                      : "bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                  }`}
                >
                  {t.ctaText}
                  <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
