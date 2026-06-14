import { neon } from "@neondatabase/serverless";

async function seedData() {
  const sql = neon(process.env.DATABASE_URL!);

  const designItems = [
    { title: "Poster Edukasi Kesehatan", category: "Edukasi", image: "/TBC Fiks.png", description: "Infografis kampanye kesehatan TBC dengan tipografi modern." },
    { title: "Poster Promosi Cafe", category: "Promosi", image: "/promosi.png", description: "Desain estetik minimalis untuk promo menu baru." },
    { title: "Poster Ucapan Nasional", category: "Poster", image: "/flyer.png", description: "Visual elegan untuk perayaan hari besar nasional." },
    { title: "Social Media Branding", category: "Social Media", image: "/ucapan.png", description: "Template Instagram premium untuk konsistensi brand." },
    { title: "Banner Event Tech", category: "Print", image: "/Poster Seminar.png", description: "Desain futuristik untuk seminar teknologi & bisnis." },
    { title: "Data Infografis", category: "Edukasi", image: "/infografis.jpg", description: "Visualisasi data kompleks menjadi sangat mudah dibaca." },
  ];

  const devItems = [
    {
      title: "E-Commerce Mobile App",
      category: "APK",
      type: "Mobile Application",
      description: "Aplikasi belanja online dengan fitur real-time tracking, payment gateway integrasi, dan push notifications.",
      tech: "React Native, Firebase, Redux, Stripe",
      image: "https://images.unsplash.com/photo-1512928500222-77732a13cc70?w=800&q=80",
      color: "from-orange-500 to-rose-500",
      link: "#",
    },
    {
      title: "Corporate Dashboard Portal",
      category: "Web",
      type: "Web Application",
      description: "Dashboard admin komprehensif untuk manajemen data karyawan, analitik penjualan, dan pelaporan otomatis.",
      tech: "Next.js, TypeScript, Tailwind CSS, PostgreSQL",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      color: "from-blue-500 to-cyan-500",
      link: "#",
    },
    {
      title: "Sistem Manajemen Kost",
      category: "Web",
      type: "Web Application",
      description: "Platform untuk pemilik kost mengelola kamar, tagihan, dan keluhan penyewa dengan sistem notifikasi WhatsApp.",
      tech: "React, Node.js, Express, MongoDB",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
      color: "from-emerald-500 to-teal-500",
      link: "#",
    },
    {
      title: "Task Management App",
      category: "APK",
      type: "Mobile Application",
      description: "Aplikasi produktivitas untuk tim dengan fitur kanban board, time tracking, dan kolaborasi real-time.",
      tech: "Flutter, Dart, Firebase, SQLite",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80",
      color: "from-purple-500 to-indigo-500",
      link: "#",
    },
    {
      title: "Landing Page SaaS",
      category: "Web",
      type: "Website",
      description: "Desain landing page modern dan responsif untuk startup SaaS dengan animasi 3D dan optimasi SEO.",
      tech: "Vue.js, Nuxt, GSAP, Framer Motion",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
      color: "from-pink-500 to-rose-400",
      link: "#",
    },
    {
      title: "Aplikasi Kasir (POS)",
      category: "APK",
      type: "Tablet Application",
      description: "Sistem Point of Sales offline-first untuk restoran dengan fitur manajemen meja, inventaris, dan cetak struk Bluetooth.",
      tech: "Kotlin, Android Studio, Room DB, Coroutines",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      color: "from-amber-500 to-orange-400",
      link: "#",
    }
  ];

  try {
    console.log("Seeding design portfolio...");
    for (const item of designItems) {
      await sql`
        INSERT INTO portfolio_designs (title, category, image, description)
        VALUES (${item.title}, ${item.category}, ${item.image}, ${item.description})
      `;
    }
    console.log("Design portfolio seeded.");

    console.log("Seeding dev portfolio...");
    for (const item of devItems) {
      await sql`
        INSERT INTO portfolio_dev (title, category, type, description, tech, image, color, link)
        VALUES (${item.title}, ${item.category}, ${item.type}, ${item.description}, ${item.tech}, ${item.image}, ${item.color}, ${item.link})
      `;
    }
    console.log("Dev portfolio seeded.");

  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

seedData();
