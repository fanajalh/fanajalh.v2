import { Sparkles, Layers, Smartphone, MessageCircle } from "lucide-react"

export const headersConfig = {
  // Global brand details
  brand: {
    name: "Fanajalah",
    logoUrl: "/feed arfan (20).png",
    slogan: "Template Desain Poster & Grafis Premium",
  },

  // Navbar section config
  navbar: {
    navLinks: [
      { label: "Home", href: "/" },
      { label: "Katalog Template", href: "#products" },
      { label: "Frames Foto", href: "/frames" },
      { label: "Promo Spesial", href: "#promo" },
      { label: "Unduh APK", href: "#download-apk" },
      { label: "Kontak", href: "#contact" },
    ]
  },

  // Hero Section Config
  hero: {
    badge: "Template Poster & Grafis Premium",
    titleLine1: "Template Poster &",
    titleLine2Gradient: "Visual Grafis.",
    subtitle: "Koleksi template desain poster profesional untuk mempercepat dan meningkatkan daya tarik visual bisnis, event, dan brand Anda dengan standar industri.",
    primaryBtnText: "Beli Template",
    secondaryBtnText: "Lihat Portfolio",
    searchPlaceholder: "Cari template poster, Instagram feed, atau website source code..."
  },

  // Categories Section Config
  categories: {
    badge: "Kategori Pilihan",
    title: "Featured Categories",
    subtitle: "Pilih kategori template desain atau source code web yang sesuai dengan kebutuhan Anda.",
    list: [
      { id: "poster", label: "Template Poster", icon: "FileImage", count: "12+ Item" },
      { id: "social", label: "Media Sosial", icon: "Smartphone", count: "8+ Item" },
      { id: "webcode", label: "Web Source Code", icon: "Code", count: "15+ Item" },
      { id: "print", label: "Template Cetak", icon: "Printer", count: "6+ Item" },
      { id: "custom", label: "Custom Design", icon: "Palette", count: "Promo" }
    ]
  },

  // Highlights Section Config (2 Banners side-by-side)
  highlights: {
    left: {
      badge: "Flat 20% Discount",
      title: "Purely Fresh Templates",
      subtitle: "Koleksi template poster event, promosi, dan spanduk siap edit.",
      buttonText: "Shop Now",
      image: "/promosi.png"
    },
    right: {
      badge: "Flat 25% Discount",
      title: "Fresh Web Code, Pure Quality",
      subtitle: "Source code website, portofolio dev, dan landing page modern.",
      buttonText: "Shop Now",
      image: "/flyer.png"
    }
  },

  // Featured Products Section Config
  featuredProducts: {
    badge: "Products",
    title: "Featured Products",
    subtitle: "Koleksi template desain & source code web terbaik untuk proyek digital Anda."
  },

  // Countdown Promo Banner Config
  countdownPromo: {
    badge: "Limited Offer",
    title: "Summer Discount",
    subtitle: "Get 50% Off - Limited Time Offer",
    buttonText: "Shop Now",
    image: "/ucapan.png",
    // 4 Days countdown represented in seconds (4 days * 24h * 60m * 60s)
    countdownSeconds: 345600 
  },

  // Deals of the Day Config
  dealsOfDay: {
    badge: "Today's Deals",
    title: "Deals of the Day",
    subtitle: "Penawaran eksklusif hari ini dengan potongan harga paling hemat."
  },

  // Portfolio Section Config (Galeri Karya)
  portfolio: {
    badge: "My Portfolio",
    title: "Galeri Karya",
    subtitle: "Eksplorasi kumpulan desain visual, poster kreatif, dan tata letak grafis yang telah saya buat.",
    emptyMessageTitle: "Belum Ada Karya",
    emptyMessageDesc: "Daftar portofolio desain akan segera diunggah di sini.",
    btnText: "Lihat Seluruh Portofolio"
  },

  // Services/Catalog Section Config (Featured Categories / Template Catalog)
  services: {
    badge: "Fan Design Catalog",
    title: "Koleksi Template Desain",
    subtitle: "Koleksi template premium siap edit untuk tugas sekolah dan promosi bisnis Anda.",
    footerText: "made with LYNK"
  },

  // Download APK Section Config
  downloadApk: {
    badge: "Mobile Application",
    title: "Aplikasi AllFanajalh",
    subtitle: "Dapatkan akses penuh ke studio photobooth, kelola pesanan Anda, dan jalankan SaaS Ecosystem langsung dari smartphone Android Anda.",
    contentTitle: "Bawa Studio Ke Genggaman!",
    contentDesc: "Aplikasi mobile AllFanajalh dirancang untuk mempermudah Anda membeli template dan melacak progres download desain secara real-time. Dilengkapi fitur kamera Photobooth dengan pendeteksi lambaian tangan untuk pengalaman berfoto terbaik.",
    features: [
      "Kamera Studio & Sensor Tangan",
      "Beli Template Desain Instan",
      "Notifikasi Progres Real-time",
      "Fitur Premium & Promo Khusus"
    ],
    btnText: "Unduh APK Android"
  },

  // Contact Section Config
  contact: {
    badge: "Mari Berkolaborasi",
    title: "Hubungi Kami",
    subtitle: "Punya pertanyaan, ide brilian, atau siap memulai project desain Anda? Sapa kami sekarang juga.",
    infoTitle: "Informasi Kontak",
    formTitleOpen: "Kirim Pesan Langsung",
    formTitleClosed: "Tinggalkan Pesan",
    formDescOpen: "Kami akan membalas pesan Anda ke email yang tertera di bawah.",
    formDescClosed: "Tinggalkan pertanyaan atau daftar notifikasi ketika layanan aktif kembali.",
    quickActionTitleOpen: "Butuh Respon Kilat?",
    quickActionTitleClosed: "Layanan Sedang Tutup",
    quickActionDescOpen: "Tim kami siap melayani konsultasi desain Anda langsung via WhatsApp.",
    quickActionDescClosed: "Layanan kami sedang libur/tutup sementara. Kami akan membalas pesan Anda sesegera mungkin (slow response)."
  },

  // FAQ Section Config
  faq: {
    title: "Tanya Jawab",
    subtitle: "Masih ragu? Temukan jawabannya di sini."
  }
}
