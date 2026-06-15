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
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight,
  GitFork,
  KeyRound,
  Sparkles
} from "lucide-react"

const TUTORIAL_TABS = [
  {
    id: "business_funnel",
    title: "1. Alur Bisnis (Funneling)",
    icon: GitFork,
    color: "bg-indigo-50 text-indigo-600 border-indigo-200",
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
    color: "bg-orange-50 text-orange-600 border-orange-200",
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
      "Jika Anda mengganti password utama Gmail Anda, App Password lama mungkin akan hangus."
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
    color: "bg-violet-50 text-violet-600 border-violet-200",
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
    color: "bg-amber-50 text-amber-600 border-amber-200",
    subtitle: "Menemukan Data Calon Prospek Bisnis",
    intro: "Lead Finder membantu Anda melakukan pencarian bisnis lokal (seperti Cafe, Restoran, Bengkel, dll) di kota tertentu secara real-time langsung dari database Google Maps.",
    workflow: [
      { title: "Input Kategori & Lokasi", desc: "Ketik atau pilih kategori bisnis (contoh: 'Salon') dan lokasi pencarian (contoh: 'Bandung')." },
      { title: "Ambil Data Real-time", desc: "Sistem menghubungi Google Maps Places API untuk mengumpulkan nama bisnis, nomor telepon, alamat, website, rating, dan review." },
      { title: "Pilih Prospek", desc: "Centang bisnis yang sesuai kriteria prospek potensial Anda." },
      { title: "Simpan ke CRM", desc: "Klik tombol 'Save ke CRM'. Kontak terpilih akan langsung didaftarkan ke modul CRM secara instan." }
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
    color: "bg-blue-50 text-blue-600 border-blue-200",
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
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    subtitle: "Promosi Massal & Otomatis",
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
    color: "bg-purple-50 text-purple-600 border-purple-200",
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
    color: "bg-rose-50 text-rose-600 border-rose-200",
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
    color: "bg-cyan-50 text-cyan-600 border-cyan-200",
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

export default function MobileTutorialPage() {
  const [activeTab, setActiveTab] = useState("business_funnel")
  const currentTutorial = TUTORIAL_TABS.find(t => t.id === activeTab) || TUTORIAL_TABS[0]
  const TabIcon = currentTutorial.icon

  return (
    <div className="bg-[#f4f6f9] min-h-screen pb-24 font-sans select-none w-full flex flex-col items-center">
      <div className="w-full max-w-md bg-[#f4f6f9] min-h-screen flex flex-col">
        
        {/* 1. SUPER APP HEADER */}
        <div className="bg-orange-600 pt-12 pb-6 px-4 rounded-b-[2rem] shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Link href="/home" className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors active:scale-95">
              <ChevronLeft size={24} strokeWidth={2.5} />
            </Link>
            <div className="flex-1">
              <h1 className="text-white text-lg font-extrabold tracking-tight">Dokumentasi Fitur</h1>
              <p className="text-orange-100 text-xs font-medium">Panduan Implementasi Bisnis</p>
            </div>
          </div>
        </div>

        {/* 2. HORIZONTAL TAB SELECTOR */}
        <div className="sticky top-[110px] z-40 bg-[#f4f6f9]/90 backdrop-blur-xl py-3 border-b border-slate-200/60 shadow-sm w-full">
          <div className="flex gap-2 px-4 overflow-x-auto snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full">
            {TUTORIAL_TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`snap-center flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[11px] font-extrabold transition-all duration-200 whitespace-nowrap active:scale-95 outline-none border ${
                    isActive
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={12} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{tab.title.substring(3)}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 3. QUICK HELPER ALERT */}
        <div className="px-4 mt-6">
          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100/80 flex gap-3 items-start text-emerald-800">
            <HelpCircle size={20} className="shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <h5 className="font-extrabold text-xs uppercase tracking-wider mb-1">Penting: Alur Data CRM</h5>
              <p className="text-[11px] leading-relaxed font-semibold opacity-90">
                Semua fitur terhubung ke <b>CRM (Database Prospek)</b>. Cari prospek di Lead Finder, simpan ke CRM, kirim email promosi dengan SMTP Google, lalu lacak peringkat web Anda.
              </p>
            </div>
          </div>
        </div>

        {/* 4. MAIN TUTORIAL CARD */}
        <div className="px-4 mt-4 flex-1">
          <div className="bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col gap-6">
            
            {/* Header Content */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${currentTutorial.color}`}>
                  <TabIcon size={20} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-black text-xs text-slate-800 tracking-tight leading-snug">
                    {currentTutorial.title}
                  </h3>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {currentTutorial.subtitle}
                  </p>
                </div>
              </div>

              {/* Try Feature Link */}
              <Link
                href={
                  currentTutorial.id === "lead_finder" ? "/ecosystem/lead-finder" :
                  currentTutorial.id === "seo" ? "/ecosystem/seo-tools" : 
                  currentTutorial.id === "ai_optimization" ? "/ecosystem/ai-optimization" :
                  currentTutorial.id === "business_funnel" ? "/ecosystem/lead-finder" :
                  currentTutorial.id === "google_smtp" ? "/ecosystem/blast" : `/ecosystem/${currentTutorial.id}`
                }
                className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-full text-[9px] font-extrabold transition-colors active:scale-95 outline-none flex items-center gap-1 shadow-sm shadow-orange-600/10 shrink-0"
              >
                Coba
              </Link>
            </div>

            {/* Intro */}
            <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
              {currentTutorial.intro}
            </p>

            {/* Workflow List */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 mb-4 flex items-center gap-2">
                <BookOpen size={14} className="text-orange-500" /> Cara Kerja / Langkah:
              </h4>
              
              <div className="relative border-l border-slate-200 pl-4 ml-2.5 space-y-5">
                {currentTutorial.workflow.map((flow, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[21.5px] top-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-orange-500" />
                    <h5 className="font-extrabold text-[10px] uppercase tracking-wider text-slate-700">
                      {index + 1}. {flow.title}
                    </h5>
                    <p className="text-[10px] font-semibold text-slate-450 mt-1 leading-relaxed">
                      {flow.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips & Trik */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 mb-3">
                💡 Tips & Trik Eksklusif:
              </h4>
              <div className="bg-amber-55 rounded-2xl p-4 border border-amber-100 space-y-2.5">
                {currentTutorial.tips.map((tip, index) => (
                  <div key={index} className="flex gap-2 items-start text-[10px] font-bold text-amber-800 leading-relaxed">
                    <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-amber-600" />
                    <p>{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Access Limits */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-800 mb-3">
                🔒 Batas Hak Akses & Limitasi:
              </h4>
              <div className="flex flex-col gap-2 bg-slate-50 rounded-2xl p-3 border border-slate-100">
                <div className="flex justify-between items-start gap-4 p-2 bg-white rounded-xl border border-slate-100">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 shrink-0">Tamu:</span>
                  <span className="text-[10px] font-bold text-rose-500 text-right leading-tight">{currentTutorial.limits.guest}</span>
                </div>
                <div className="flex justify-between items-start gap-4 p-2 bg-white rounded-xl border border-slate-100">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 shrink-0">Free:</span>
                  <span className="text-[10px] font-bold text-orange-500 text-right leading-tight">{currentTutorial.limits.free}</span>
                </div>
                <div className="flex justify-between items-start gap-4 p-2 bg-white rounded-xl border border-slate-100">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 shrink-0">Premium:</span>
                  <span className="text-[10px] font-bold text-emerald-500 text-right leading-tight">{currentTutorial.limits.premium}</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
