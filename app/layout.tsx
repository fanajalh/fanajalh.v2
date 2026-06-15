import type React from "react"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { Providers } from "@/components/Providers"
import CustomCursor from "@/components/ui/CustomCursor"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap"
})

export const metadata: Metadata = {
  title: {
    default: "AllFanajalh — Jasa Desain Poster & SaaS Business Ecosystem Purwokerto",
    template: "%s | AllFanajalh"
  },
  description:
    "AllFanajalh adalah platform SaaS Business Ecosystem & Jasa Joki Desain Poster profesional di Purwokerto oleh Muhammad Fachri Arfan. Fitur lengkap: Lead Finder, CRM, Email Blast, Keyword Planner AI, SEO Writer, SERP Tracker, AI Google Optimization, dan Website Audit Score.",
  keywords: [
    "allfanajalh",
    "fanajalh",
    "jasa desain poster purwokerto",
    "joki poster purwokerto",
    "desain poster murah purwokerto",
    "jasa poster event purwokerto",
    "SaaS business ecosystem",
    "lead finder google maps",
    "CRM gratis",
    "email blast massal",
    "keyword planner AI",
    "SEO writer AI",
    "SERP tracker Indonesia",
    "AI optimization GEO",
    "website audit score",
    "Muhammad Fachri Arfan",
    "jasa desain grafis purwokerto",
    "pembuatan website purwokerto",
    "digital marketing purwokerto"
  ],
  icons: {
    icon: [
      { url: "/feed arfan (20).png", sizes: "any" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [{ rel: "mask-icon", url: "/safari-pinned-tab.png", color: "#f97316" }],
  },
  manifest: "/site.webmanifest",
  themeColor: "#f97316",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  authors: [{ name: "Muhammad Fachri Arfan", url: "https://allfanajalh.tech" }],
  creator: "Muhammad Fachri Arfan",
  publisher: "AllFanajalh",
  alternates: {
    canonical: "https://allfanajalh.tech",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://allfanajalh.tech",
    title: "AllFanajalh — Jasa Desain Poster & SaaS Business Ecosystem Purwokerto",
    description: "Platform SaaS Business Ecosystem & Jasa Joki Desain Poster profesional di area Purwokerto. Dibuat oleh Muhammad Fachri Arfan. Fitur: Lead Finder, CRM, Email Blast, Keyword AI, SEO Writer, SERP Tracker, AI Optimization, Website Audit.",
    siteName: "AllFanajalh",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AllFanajalh — Jasa Desain Poster & SaaS Business Ecosystem Purwokerto oleh Muhammad Fachri Arfan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AllFanajalh — Jasa Desain Poster & SaaS Business Ecosystem Purwokerto",
    description: "Platform SaaS Business Ecosystem & Jasa Joki Desain Poster di Purwokerto oleh Muhammad Fachri Arfan. Lead Finder, CRM, Email Blast, SEO AI, Website Audit Score.",
    images: ["/og-image.png"],
    creator: "@allfanajalh",
  },
  verification: {
    // Tambahkan verification code dari Google Search Console di sini setelah mendaftar:
    // google: "kode-verifikasi-google-search-console",
  },
  category: "technology",
}

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://allfanajalh.tech/#organization",
      "name": "AllFanajalh",
      "url": "https://allfanajalh.tech",
      "logo": {
        "@type": "ImageObject",
        "url": "https://allfanajalh.tech/feed arfan (20).png"
      },
      "founder": {
        "@type": "Person",
        "name": "Muhammad Fachri Arfan",
        "jobTitle": "Founder & Developer",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Purwokerto",
          "addressRegion": "Jawa Tengah",
          "addressCountry": "ID"
        }
      },
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Purwokerto",
        "addressRegion": "Jawa Tengah",
        "addressCountry": "ID"
      },
      "sameAs": [],
      "description": "AllFanajalh adalah platform SaaS Business Ecosystem dan layanan Joki Desain Poster profesional di area Purwokerto yang didirikan oleh Muhammad Fachri Arfan."
    },
    {
      "@type": "WebSite",
      "@id": "https://allfanajalh.tech/#website",
      "url": "https://allfanajalh.tech",
      "name": "AllFanajalh",
      "description": "Jasa Desain Poster Purwokerto & SaaS Business Ecosystem",
      "publisher": { "@id": "https://allfanajalh.tech/#organization" },
      "inLanguage": "id-ID"
    },
    {
      "@type": "WebPage",
      "@id": "https://allfanajalh.tech/#webpage",
      "url": "https://allfanajalh.tech",
      "name": "AllFanajalh — Jasa Desain Poster & SaaS Business Ecosystem Purwokerto",
      "isPartOf": { "@id": "https://allfanajalh.tech/#website" },
      "about": { "@id": "https://allfanajalh.tech/#organization" },
      "description": "Platform SaaS Business Ecosystem lengkap dengan Lead Finder, CRM, Email Blast, Keyword Planner AI, SEO Writer, SERP Tracker, AI Google Optimization, dan Website Audit Score. Juga menyediakan jasa joki desain poster profesional di Purwokerto.",
      "inLanguage": "id-ID"
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://allfanajalh.tech/#localbusiness",
      "name": "AllFanajalh — Joki Poster Purwokerto",
      "image": "https://allfanajalh.tech/feed arfan (20).png",
      "url": "https://allfanajalh.tech",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Purwokerto",
        "addressRegion": "Jawa Tengah",
        "addressCountry": "ID"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -7.4214,
        "longitude": 109.2342
      },
      "priceRange": "Rp15.000 - Rp500.000",
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "08:00",
        "closes": "22:00"
      },
      "areaServed": {
        "@type": "City",
        "name": "Purwokerto"
      },
      "founder": {
        "@type": "Person",
        "name": "Muhammad Fachri Arfan"
      }
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://allfanajalh.tech/#saas",
      "name": "AllFanajalh Business Ecosystem",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "IDR",
        "description": "Gratis dengan limitasi. Upgrade ke Premium untuk akses unlimited."
      },
      "featureList": [
        "Lead Finder (Google Maps Scraper)",
        "CRM (Database Prospek & Pelanggan)",
        "Email Blast Massal dengan SMTP",
        "Keyword Planner AI (Gemini)",
        "SEO Content Writer AI",
        "SERP Tracker & Analytics",
        "AI Google Optimization (GEO)",
        "Website Audit & Score"
      ],
      "creator": {
        "@type": "Person",
        "name": "Muhammad Fachri Arfan"
      }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Apa itu AllFanajalh?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AllFanajalh adalah platform SaaS Business Ecosystem dan layanan joki desain poster profesional di Purwokerto yang didirikan oleh Muhammad Fachri Arfan. Platform ini menyediakan fitur lengkap mulai dari Lead Finder, CRM, Email Blast, Keyword Planner AI, SEO Writer, SERP Tracker, AI Google Optimization, hingga Website Audit Score."
          }
        },
        {
          "@type": "Question",
          "name": "Siapa pendiri AllFanajalh?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "AllFanajalh didirikan oleh Muhammad Fachri Arfan, seorang developer dan desainer grafis berbasis di Purwokerto, Jawa Tengah, Indonesia."
          }
        },
        {
          "@type": "Question",
          "name": "Apa saja fitur SaaS Ecosystem AllFanajalh?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Fitur utama meliputi: Lead Finder untuk scraping data bisnis dari Google Maps, CRM untuk mengelola prospek, Email Blast untuk promosi massal, Keyword Planner AI untuk riset kata kunci, SEO Writer untuk membuat artikel otomatis, SERP Tracker untuk memantau peringkat Google, AI Optimization (GEO) untuk optimasi mesin pencari generatif, dan Website Audit untuk mengecek skor SEO website."
          }
        },
        {
          "@type": "Question",
          "name": "Berapa harga jasa desain poster di AllFanajalh Purwokerto?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Harga jasa desain poster di AllFanajalh mulai dari Rp15.000 untuk desain poster standar. Tersedia berbagai paket untuk poster event, poster promosi, infografis, dan desain grafis lainnya di area Purwokerto dan sekitarnya."
          }
        },
        {
          "@type": "Question",
          "name": "Bagaimana cara menggunakan Business Ecosystem AllFanajalh?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Anda cukup mendaftar atau masuk sebagai tamu, lalu ikuti alur bisnis: cari prospek di Lead Finder, simpan ke CRM, kirim email penawaran massal, riset kata kunci dengan AI, buat artikel SEO otomatis, dan pantau peringkat website Anda di Google."
          }
        }
      ]
    }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <meta name="msapplication-TileColor" content="#f97316" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="geo.region" content="ID-JT" />
        <meta name="geo.placename" content="Purwokerto" />
        <meta name="geo.position" content="-7.4214;109.2342" />
        <meta name="ICBM" content="-7.4214, 109.2342" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${jakarta.className}`}>
        <Providers>
          <CustomCursor />
          <div className="w-full min-h-screen bg-white dark:bg-black relative overflow-x-hidden flex flex-col mx-auto">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
