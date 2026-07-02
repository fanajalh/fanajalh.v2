import type React from "react"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { Providers } from "@/components/Providers"
import CustomCursor from "@/components/ui/CustomCursor"
import NavigationLoader from "@/components/sections/NavigationLoader"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap"
})

export const metadata: Metadata = {
  metadataBase: new URL("https://fanajah.my.id"),
  title: {
    default: "Fanajalah — Template Desain Poster & Grafis Premium",
    template: "%s | Fanajalah"
  },
  description:
    "Fanajalah adalah platform penyedia Template Desain Poster profesional oleh Muhammad Fachri Arfan. Menyediakan template poster event, poster promosi, infografis, print design, dan postingan media sosial premium.",
  keywords: [
    "fanajalah",
    "template desain poster",
    "template poster premium",
    "template poster murah",
    "template poster event",
    "template desain grafis",
    "Muhammad Fachri Arfan",
    "template feed instagram",
    "template spanduk",
    "template brosur"
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
  authors: [{ name: "Muhammad Fachri Arfan", url: "https://allfanajalh.my.id" }],
  creator: "Muhammad Fachri Arfan",
  publisher: "Fanajalah",
  alternates: {
    canonical: "https://fanajah.my.id",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://fanajah.my.id",
    title: "Fanajalah — Template Desain Poster & Grafis Premium",
    description: "Template Desain Poster profesional oleh Muhammad Fachri Arfan. Menyediakan template poster event, promosi, infografis, feed instagram, dan print design.",
    siteName: "Fanajalah",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fanajalah — Template Desain Poster & Grafis Premium oleh Muhammad Fachri Arfan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fanajalah — Template Desain Poster & Grafis Premium",
    description: "Template Desain Poster profesional oleh Muhammad Fachri Arfan. Poster Event, Promosi, Infografis, Feed Instagram.",
    images: ["/og-image.png"],
    creator: "@fanajalah",
  },
  verification: {
    // Tambahkan verification code dari Google Search Console di sini setelah mendaftar:
    // google: "kode-verifikasi-google-search-console",
  },
  category: "design",
}

export const viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://allfanajalh.my.id/#organization",
      "name": "Fanajalah",
      "url": "https://fanajah.my.id",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fanajah.my.id/feed arfan (20).png"
      },
      "founder": {
        "@type": "Person",
        "name": "Muhammad Fachri Arfan",
        "jobTitle": "Founder & Lead Designer",
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
      "description": "Fanajalah adalah platform penyedia Template Desain Poster profesional yang didirikan oleh Muhammad Fachri Arfan."
    },
    {
      "@type": "WebSite",
      "@id": "https://allfanajalh.my.id/#website",
      "url": "https://fanajah.my.id",
      "name": "Fanajalah",
      "description": "Template Desain Poster & Grafis Premium",
      "publisher": { "@id": "https://allfanajalh.my.id/#organization" },
      "inLanguage": "id-ID"
    },
    {
      "@type": "WebPage",
      "@id": "https://allfanajalh.my.id/#webpage",
      "url": "https://fanajah.my.id",
      "name": "Fanajalah — Template Desain Poster & Grafis Premium",
      "isPartOf": { "@id": "https://allfanajalh.my.id/#website" },
      "about": { "@id": "https://allfanajalh.my.id/#organization" },
      "description": "Template desain poster profesional. Menyediakan template poster event, promosi, infografis, dan digital marketing design.",
      "inLanguage": "id-ID"
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://allfanajalh.my.id/#localbusiness",
      "name": "Fanajalah — Template Poster Premium",
      "image": "https://allfanajalh.my.id/feed arfan (20).png",
      "url": "https://fanajah.my.id",
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
      "priceRange": "Rp10.000 - Rp250.000",
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
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Apa itu Fanajalah?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Fanajalah adalah platform penyedia template desain poster profesional yang didirikan oleh Muhammad Fachri Arfan. Menyediakan template poster event, poster promosi, infografis, media sosial, dan digital design."
          }
        },
        {
          "@type": "Question",
          "name": "Siapa pendiri Fanajalah?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Fanajalah didirikan oleh Muhammad Fachri Arfan, seorang desainer grafis berbasis di Purwokerto, Jawa Tengah, Indonesia."
          }
        },
        {
          "@type": "Question",
          "name": "Berapa harga template desain poster di Fanajalah?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Harga template desain poster di Fanajalah mulai dari Rp15.000 untuk paket template dasar. Tersedia berbagai paket template untuk poster event, poster promosi, infografis, dan desain grafis lainnya."
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
    <html lang="id" suppressHydrationWarning>
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
          <NavigationLoader />
          <div className="w-full min-h-screen bg-white dark:bg-black relative overflow-x-hidden flex flex-col mx-auto">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}
