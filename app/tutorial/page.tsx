"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  Search, 
  Users, 
  Mail, 
  Key, 
  Wrench, 
  BarChart3, 
  ArrowLeft, 
  Palette, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  HelpCircle, 
  GitFork, 
  KeyRound, 
  Sparkles, 
  TrendingUp 
} from "lucide-react"

const TUTORIAL_TABS = [
  {
    id: "business_funnel",
    title: "1. Alur Bisnis (Funneling)",
    icon: GitFork,
    color: "bg-indigo-100 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-indigo-400",
    subtitle: "Cara Mendatangkan Klien & Omset Menggunakan Ekosistem Ini",
    intro: "Untuk menyukseskan pemasaran bisnis digital, modul-modul di dalam ekosistem ini harus digunakan secara berurutan sebagai sebuah funnel (corong pemasaran) terintegrasi.",
    workflow: [
      { title: "Lead Finder (Scrape Google Maps)", desc: "Mulai dengan mencari kontak bisnis lokal secara real-time dari Google Maps berdasarkan lokasi & kategori." },
      { title: "Simpan ke Database (CRM)", desc: "Simpan calon prospek ke Database Pelanggan (CRM) untuk mengelola data & melacak status penawaran." },
      { title: "Kirim Penawaran Massal (Blast Email)", desc: "Hubungkan SMTP Gmail Anda untuk mengirim penawaran email massal secara otomatis kepada daftar prospek." },
      { title: "Riset Kata Kunci (Keyword Planner)", desc: "Saat klien tertarik, lakukan riset kata kunci potensial yang banyak dicari konsumen di Google." },
      { title: "Buat Konten & Schema (SEO Writer)", desc: "Generate artikel blog yang ramah SEO lengkap dengan kode Schema Markup agar mudah dibaca Google." },
      { title: "Pantau Posisi Google (SERP Tracker)", desc: "Masukkan URL website dan kata kunci di Tracker untuk memonitor kenaikan peringkat web di hasil pencarian." }
    ],
    tips: [
      "Mengikuti urutan funnel ini membantu Anda mengubah data mentah dari internet menjadi deal penjualan yang nyata secara terstruktur.",
      "Gunakan data CRM secara berkala untuk mengevaluasi jenis bisnis/niche mana yang memiliki tingkat respon email tertinggi."
    ],
    limits: {
      guest: "Mencakup panduan dasar alur bisnis.",
      free: "Akses panduan langkah implementasi lengkap.",
      premium: "Strategi pertumbuhan & blueprint premium."
    }
  },
  {
    id: "google_smtp",
    title: "2. Setup SMTP Gmail",
    icon: KeyRound,
    color: "bg-orange-100 dark:bg-orange-950/40 border-orange-500 text-orange-700 dark:text-orange-400",
    subtitle: "Langkah Mendapatkan Google App Password untuk Blast Email",
    intro: "Demi keamanan akun Google, Anda wajib menggunakan Google App Password (Sandi Aplikasi 16-digit) sebagai SMTP Password, bukan password utama Gmail Anda.",
    workflow: [
      { title: "Aktifkan Verifikasi 2 Langkah", desc: "Masuk ke Akun Google Anda -> pilih tab Keamanan -> scroll ke bagian Cara Anda Masuk ke Google -> aktifkan 'Verifikasi 2 Langkah' (2-Step Verification) jika belum aktif." },
      { title: "Masuk ke Menu Sandi Aplikasi", desc: "Ketik 'Sandi Aplikasi' (App Passwords) di kolom pencarian teratas halaman Akun Google Anda atau cari di bagian Keamanan." },
      { title: "Buat Sandi Aplikasi Baru", desc: "Masukkan nama aplikasi penanda (contoh: 'Ecosystem Email Blast') lalu klik tombol 'Buat' (Create)." },
      { title: "Salin Kode 16 Karakter", desc: "Google akan memunculkan kode 16 karakter unik (contoh: 'abcd efgh ijkl mnop'). Salin kode tersebut ke catatan Anda tanpa spasi." },
      { title: "Hubungkan ke SMTP Blast Email", desc: "Buka halaman Blast Email di ekosistem ini. Masukkan Host: 'smtp.gmail.com', Port: '465' (SSL), Email: Gmail Anda, dan Password: Tempel kode 16 karakter tadi." }
    ],
    tips: [
      "App Password adalah metode resmi dari Google untuk aplikasi pihak ketiga agar bisa mengirim email (SMTP) dengan aman tanpa membocorkan sandi utama Anda.",
      "Jika Anda menonaktifkan Verifikasi 2 Langkah di masa mendatang, semua App Password yang telah Anda buat otomatis akan hangus."
    ],
    limits: {
      guest: "Panduan setup dasar SMTP Gmail.",
      free: "Mendukung koneksi 1 akun SMTP.",
      premium: "Panduan rotasi multi-SMTP untuk inboxing tinggi."
    }
  },
  {
    id: "ai_optimization",
    title: "3. Optimasi AI Google (GEO)",
    icon: Sparkles,
    color: "bg-violet-100 dark:bg-violet-950/40 border-violet-500 text-violet-700 dark:text-violet-400",
    subtitle: "GEO (Generative Engine Optimization) Agar Brand Terbaca AI Google",
    intro: "GEO/AIO adalah teknik agar bot AI Google (Gemini Search & SGE) merangkum profil brand Anda ketika seseorang mencarinya di Google (contoh: mencari nama brand seperti 'fanajalh').",
    workflow: [
      { title: "Buka Halaman AI Optimization", desc: "Pilih menu 'AI Optimization' di navigasi atas untuk memuat asisten GEO pintar." },
      { title: "Input Informasi Entitas Bisnis", desc: "Masukkan nama brand, URL website, nama founder (pendiri), kategori, lokasi, serta layanan/keyword utama bisnis." },
      { title: "Generate & Ambil Kode Schema JSON-LD", desc: "Klik generate agar AI Gemini menyusun Organization Schema & FAQ Schema JSON-LD. Salin dan tempel di dalam tag <head> HTML website Anda." },
      { title: "Gunakan Struktur HTML Semantik", desc: "Susun teks website Anda dengan tag <h1> untuk nama brand, <h2> untuk layanan utama, dan tag <ul>/<ol> agar bot AI mudah memparsing isi web." },
      { title: "Bangun Sitasi Brand di Internet", desc: "Buat profil brand Anda di LinkedIn Company, Google Business Profile, Crunchbase, dan direktori bisnis dengan nama, alamat, dan website yang konsisten." }
    ],
    tips: [
      "AI Google Gemini bekerja dengan mencocokkan entitas (Brand + Founder + Layanan). Schema JSON-LD membantu bot AI memetakan hubungan entitas tersebut secara akurat.",
      "Tulis halaman FAQ atau Tentang Kami (About Us) di website yang secara eksplisit menjelaskan siapa pendiri dan apa fokus bisnis Anda."
    ],
    limits: {
      guest: "Maksimal 1 kali generate schema & checklist audit.",
      free: "5 kali input per 5 hari (gabungan non-blast).",
      premium: "Unlimited (Tidak terbatas) dengan skema GEO premium."
    }
  },
  {
    id: "lead_finder",
    title: "4. Lead Finder",
    icon: Search,
    color: "bg-amber-100 dark:bg-amber-950/40 border-amber-500 text-amber-700 dark:text-amber-400",
    subtitle: "Menemukan Data Calon Prospek Bisnis",
    intro: "Lead Finder membantu Anda melakukan pencarian bisnis lokal (seperti Cafe, Restoran, Bengkel, dll) di kota tertentu secara real-time langsung dari database Google Maps.",
    workflow: [
      { title: "Input Kategori & Lokasi", desc: "Ketik atau pilih kategori bisnis (contoh: 'Salon') dan lokasi pencarian (contoh: 'Bandung')." },
      { title: "Ambil Data Real-time", desc: "Sistem menghubungi Google Maps Places API untuk mengumpulkan nama bisnis, nomor telepon, alamat, website, rating, dan review." },
      { title: "Pilih Prospek", desc: "Centang bisnis yang sesuai kriteria prospek potensial Anda." },
      { title: "Simpan ke CRM", desc: "Klik tombol 'Save ke CRM'. Kontak terpilih akan langsung didaftarkan ke modul Database Pelanggan secara instan." }
    ],
    tips: [
      "Gunakan kombinasi kategori unik untuk mempersempit pencarian.",
      "Selalu prioritaskan prospek yang memiliki rating di bawah 4.0 atau yang belum memiliki website, karena mereka adalah target penjualan jasa terbaik!"
    ],
    limits: {
      guest: "Maksimal 1 kali pencarian & simpan massal.",
      free: "5 kali input per 5 hari (gabungan seluruh fitur non-blast).",
      premium: "Unlimited (Tidak terbatas)."
    }
  },
  {
    id: "crm",
    title: "5. Database Prospek (CRM)",
    icon: Users,
    color: "bg-blue-100 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-400",
    subtitle: "Pusat Pengelolaan Data Prospek & Pelanggan",
    intro: "CRM (Customer Relationship Management) bertindak sebagai database pusat bisnis Anda. Di sini Anda mengelola daftar prospek yang didapat dari Google Maps dan melacak status penjualannya.",
    workflow: [
      { title: "Database Pelanggan Terpusat", desc: "Melihat daftar calon klien lengkap dengan informasi email, website, kategori, dan status konversinya (NEW, CONTACTED, OPENED, REPLIED, DEAL)." },
      { title: "Ubah Status Deal", desc: "Perbarui status setelah Anda mengirimkan penawaran atau mendapat balasan (contoh: ubah dari CONTACTED menjadi DEAL jika mereka setuju membeli)." },
      { title: "Import CSV Massal", desc: "Anda bisa mengunggah daftar kontak milik sendiri dalam format CSV teks terpisah koma secara instan." },
      { title: "Catatan Aktivitas", desc: "Tambahkan catatan penting pada setiap kontak untuk mencatat detail negosiasi Anda dengan calon pelanggan." }
    ],
    tips: [
      "Perbarui status kontak secara berkala agar grafik conversion rate di modul Analytics tetap akurat.",
      "Gunakan fitur impor CSV jika Anda ingin memindahkan database prospek lama Anda ke ekosistem ini."
    ],
    limits: {
      guest: "Maksimal 1 kali tambah/import data.",
      free: "5 kali input per 5 hari (gabungan seluruh fitur non-blast).",
      premium: "Unlimited (Tidak terbatas)."
    }
  },
  {
    id: "blast",
    title: "6. Blast Email",
    icon: Mail,
    color: "bg-emerald-100 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-400",
    subtitle: "Promosi Massal Tertarget & Otomatis",
    intro: "Kirim email penawaran massal ke prospek yang ada di CRM menggunakan server SMTP Anda sendiri untuk memaksimalkan inbox delivery rate.",
    workflow: [
      { title: "Hubungkan SMTP", desc: "Masukkan kredensial SMTP Anda (Host, Port, Email, Password). Password disimpan dengan enkripsi aman." },
      { title: "Pilih Penerima", desc: "Filter prospek berdasarkan Kategori atau Status CRM tertentu (contoh: kirim hanya ke kategori 'Cafe' dengan status 'NEW')." },
      { title: "Tulis Template Dinamis", desc: "Tulis subject dan isi email. Gunakan tag {{name}} untuk menyisipkan nama penerima secara otomatis (personalisasi)." },
      { title: "Kirim & Lacak Open Rate", desc: "Kirim email sekaligus. Sistem menyisipkan tracking pixel tak kasat mata untuk melacak kapan email tersebut dibuka oleh prospek." }
    ],
    tips: [
      "Untuk menjaga reputasi pengirim SMTP Anda, hindari mengirim email spam kasar. Buat penawaran yang sopan dan memberikan solusi.",
      "Gunakan port 465 dengan SSL atau port 587 dengan STARTTLS untuk konfigurasi SMTP yang aman."
    ],
    limits: {
      guest: "Maksimal mengirim 5 email.",
      free: "Maksimal 45 email total.",
      premium: "Unlimited (Tidak terbatas)."
    }
  },
  {
    id: "keyword",
    title: "7. Keyword Planner",
    icon: Key,
    color: "bg-purple-100 dark:bg-purple-950/40 border-purple-500 text-purple-700 dark:text-purple-400",
    subtitle: "Analisis Target Kata Kunci AI",
    intro: "Gunakan kecerdasan AI untuk menemukan kata kunci potensial berdasarkan niche bisnis Anda. AI akan menampilkan tingkat persaingan (Difficulty) dan jumlah pencarian bulanan (Search Volume).",
    workflow: [
      { title: "Pilih Profil Bisnis dari CRM", desc: "Ambil profil bisnis yang tersimpan di CRM Anda atau ketik secara kustom." },
      { title: "Analisis Volume Pencarian (Volume)", desc: "AI mendeteksi volume pencarian bulanan (misal: '1.200 / bln' artinya kata kunci tersebut diketik sebanyak 1.200 kali per bulan oleh pengguna Google Indonesia)." },
      { title: "Identifikasi Search Intent", desc: "Sistem menandai intent pencarian (Informational, Commercial, atau Transactional) untuk memudahkan segmentasi konten." },
      { title: "Simpan Target Kata Kunci", desc: "Simpan kata kunci terpilih ke database untuk dilacak peringkatnya atau dijadikan bahan artikel blog." }
    ],
    tips: [
      "Volume pencarian (Search Volume) yang tinggi (misal > 1.000 / bln) menandakan minat pasar yang besar. Targetkan kata kunci dengan tingkat kesulitan 'EASY' untuk peringkat cepat.",
      "Gunakan tombol 'Buat SEO Konten' langsung dari kata kunci terpilih untuk mempercepat proses penulisan artikel blog."
    ],
    limits: {
      guest: "Maksimal 1 kali generate keyword.",
      free: "5 kali input per 5 hari (gabungan seluruh fitur non-blast).",
      premium: "Unlimited (Tidak terbatas)."
    }
  },
  {
    id: "seo",
    title: "8. SEO Writer",
    icon: Wrench,
    color: "bg-rose-100 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-400",
    subtitle: "Pembuat Konten SEO Otomatis",
    intro: "Tulis konten penunjang website Anda secara otomatis menggunakan Gemini AI yang sudah dioptimasi untuk menduduki halaman pertama Google.",
    workflow: [
      { title: "Pilih Kata Kunci", desc: "Tentukan kata kunci target yang ingin Anda kuasai peringkatnya." },
      { title: "Buat Struktur Konten", desc: "Gemini AI menulis artikel blog lengkap dengan tag HTML semantik (h1, h2, p), Meta Title menarik, Meta Description informatif, serta FAQ Schema JSON-LD." },
      { title: "Pratinjau SERP Google", desc: "Lihat simulasi visual bagaimana hasil pencarian website Anda akan terlihat langsung di Google Search." },
      { title: "Salin Kode & Publikasi", desc: "Salin artikel blog HTML atau FAQ Schema JSON-LD dengan satu klik, lalu tempel di website WordPress/HTML Anda." }
    ],
    tips: [
      "Salin kode FAQ Schema JSON-LD dan letakkan di bagian head website Anda agar Google menampilkan rich snippets bintang/FAQ.",
      "Meskipun ditulis oleh AI berkualitas, luangkan waktu 2-3 menit untuk mengedit artikel agar sesuai dengan gaya bahasa brand Anda."
    ],
    limits: {
      guest: "Maksimal 1 kali pembuatan konten SEO.",
      free: "5 kali input per 5 hari (gabungan seluruh fitur non-blast).",
      premium: "Unlimited (Tidak terbatas)."
    }
  },
  {
    id: "tracking",
    title: "9. SERP Tracker & Analytics",
    icon: BarChart3,
    color: "bg-cyan-100 dark:bg-cyan-950/40 border-cyan-500 text-cyan-700 dark:text-cyan-400",
    subtitle: "Pelacakan Posisi Google & Potensi Trafik",
    intro: "Ukur pertumbuhan peringkat kata kunci website Anda di Google Indonesia, perhatikan grafik konversi prospek CRM, serta analisis potensi lalu lintas pengunjung (trafik).",
    workflow: [
      { title: "Pantau Pergerakan Peringkat (Rank Change)", desc: "Masukkan URL website dan kata kunci. Sistem akan melacak posisinya di database Google Indonesia secara real-time. Perhatikan indikator naik/turun (misal: '+3' berarti peringkat naik 3 posisi)." },
      { title: "Analisis Potensi Klik (CTR)", desc: "Halaman pertama Google (peringkat 1-3) menguasai lebih dari 60% klik. Peringkat yang naik mendekati peringkat 1 memiliki potensi trafik organic yang sangat tinggi." },
      { title: "Funnel Konversi CRM", desc: "Analisis grafik batang yang menunjukkan persentase prospek dari tahap awal hingga deal sukses." },
      { title: "Riwayat & Evaluasi", desc: "Pantau tren kenaikan peringkat secara berkala seminggu sekali untuk mengukur keefektifan artikel SEO yang dipublikasikan." }
    ],
    tips: [
      "Jalankan pengecekan SERP secara berkala seminggu sekali untuk memantau efek optimasi artikel yang sudah Anda publikasikan.",
      "Gunakan data konversi untuk mengidentifikasi kategori bisnis mana yang paling cepat menghasilkan DEAL."
    ],
    limits: {
      guest: "Maksimal 1 kali cek peringkat SERP.",
      free: "5 kali input per 5 hari (gabungan seluruh fitur non-blast).",
      premium: "Unlimited (Tidak terbatas)."
    }
  }
]

export default function TutorialPage() {
  const [activeTab, setActiveTab] = useState("business_funnel")
  const currentTutorial = TUTORIAL_TABS.find(t => t.id === activeTab) || TUTORIAL_TABS[0]
  const TabIcon = currentTutorial.icon

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black font-sans select-none">
      {/* Navbar Minimalist */}
      <nav className="sticky top-0 z-[40] bg-white dark:bg-black border-b-4 border-black dark:border-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 relative overflow-hidden flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] border-2 border-black dark:border-white transform -rotate-3 group-hover:rotate-0 transition-transform shrink-0">
                  <img src="/feed arfan (20).png" alt="AllFanajalh Logo" className="w-full h-full object-cover" />
                </div>
              </Link>
              <div>
                <h1 className="text-sm font-black tracking-widest uppercase text-black dark:text-white leading-none">
                  Ecosystem <span className="text-emerald-500">Tutorial</span>
                </h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  Panduan & Dokumentasi Implementasi Fitur
                </p>
              </div>
            </div>
            <Link
              href="/lead-finder"
              className="flex items-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white border-2 border-transparent hover:border-black dark:hover:border-white transition-all"
            >
              <ArrowLeft size={14} strokeWidth={3} />
              <span>Kembali</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Title */}
        <div className="mb-10 text-center md:text-left border-l-8 border-black dark:border-white pl-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-emerald-500 mb-2">
            <BookOpen size={14} /> Panduan & Dokumentasi
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white uppercase tracking-wider">
            Dokumentasi Implementasi Fitur Ke Bisnis
          </h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
            Pelajari cara kerja alur penawaran bisnis, setup SMTP email blast, serta cara menaikkan brand ke AI Google.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid md:grid-cols-12 gap-8 items-start">
          {/* Left / Sidebar Tabs Selector */}
          <div className="md:col-span-4 space-y-3">
            <div className="bg-white dark:bg-white/5 border-4 border-black dark:border-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
              <h4 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Daftar Modul Fitur</h4>
              <div className="space-y-2">
                {TUTORIAL_TABS.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between p-3 border-2 font-black text-[10px] uppercase tracking-widest transition-all ${
                        isActive
                          ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white translate-x-1"
                          : "bg-white dark:bg-white/5 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={14} />
                        <span>{tab.title.substring(3)}</span>
                      </div>
                      <ChevronRight size={12} className={isActive ? "translate-x-1 transition-transform" : ""} />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Quick Helper Alert */}
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-500 p-4 text-emerald-700 dark:text-emerald-400">
              <div className="flex gap-2.5 items-start">
                <HelpCircle size={20} className="flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-black text-xs uppercase tracking-wider mb-1">Penting: Alur Data CRM</h5>
                  <p className="text-[11px] leading-relaxed font-semibold">
                    Semua fitur di ekosistem terhubung ke <b>CRM (Database Prospek)</b>. Cari prospek di Lead Finder, simpan ke CRM, lalu hubungkan SMTP Google untuk mengirim email promosi otomatis. Lacak peringkat web Anda untuk melihat perkembangannya!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right / Main Content Panel */}
          <div className="md:col-span-8 bg-white dark:bg-white/5 border-4 border-black dark:border-white p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">
            {/* Header Content */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-dashed border-gray-200 dark:border-gray-800 pb-6 mb-6 gap-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 border-2 border-black dark:border-white ${currentTutorial.color.split(' ')[0]}`}>
                  <TabIcon size={24} className="text-black dark:text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-tight">
                    {currentTutorial.title}
                  </h3>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                    {currentTutorial.subtitle}
                  </p>
                </div>
              </div>

              {/* Ecosystem Nav Direct Link */}
              <Link
                href={
                  currentTutorial.id === "lead_finder" ? "/lead-finder" :
                  currentTutorial.id === "seo" ? "/seo-tools" : 
                  currentTutorial.id === "ai_optimization" ? "/ai-optimization" :
                  currentTutorial.id === "business_funnel" ? "/lead-finder" :
                  currentTutorial.id === "google_smtp" ? "/blast" : `/${currentTutorial.id}`
                }
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-[11px] border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                Coba Fitur
              </Link>
            </div>

            {/* Intro */}
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
              {currentTutorial.intro}
            </p>

            {/* Workflow / How it works */}
            <h4 className="text-sm font-black uppercase tracking-widest text-black dark:text-white mb-4">
              🚀 Cara Kerja / Langkah Penggunaan:
            </h4>
            <div className="relative border-l-2 border-black dark:border-white pl-4 ml-2 space-y-6 mb-8">
              {currentTutorial.workflow.map((flow, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-[23px] top-0.5 w-3 h-3 rounded-none bg-black dark:bg-white border border-white dark:border-black" />
                  <h5 className="font-black text-xs uppercase tracking-wider text-black dark:text-white">
                    {index + 1}. {flow.title}
                  </h5>
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {flow.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Pro Tips */}
            <h4 className="text-sm font-black uppercase tracking-widest text-black dark:text-white mb-4">
              💡 Tips & Trik Eksklusif:
            </h4>
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-500 p-4 space-y-2 mb-8">
              {currentTutorial.tips.map((tip, index) => (
                <div key={index} className="flex gap-2.5 items-start text-xs font-semibold text-yellow-800 dark:text-yellow-400">
                  <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
                  <p>{tip}</p>
                </div>
              ))}
            </div>

            {/* Limit Rules */}
            <h4 className="text-sm font-black uppercase tracking-widest text-black dark:text-white mb-4">
              🔒 Batas Hak Akses & Limitasi:
            </h4>
            <div className="grid sm:grid-cols-3 gap-4 border-2 border-black dark:border-white p-4 bg-gray-50 dark:bg-white/5">
              <div className="p-3 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black/40">
                <span className="block text-[9px] font-black uppercase tracking-wider text-gray-400">Akun Tamu (Guest):</span>
                <span className="text-xs font-bold text-rose-500">{currentTutorial.limits.guest}</span>
              </div>
              <div className="p-3 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black/40">
                <span className="block text-[9px] font-black uppercase tracking-wider text-gray-400">Akun Gratis (Free):</span>
                <span className="text-xs font-bold text-orange-500">{currentTutorial.limits.free}</span>
              </div>
              <div className="p-3 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black/40">
                <span className="block text-[9px] font-black uppercase tracking-wider text-gray-400">Paket Premium:</span>
                <span className="text-xs font-bold text-emerald-500">{currentTutorial.limits.premium}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
