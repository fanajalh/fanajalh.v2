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
  title: "Fanz Tech - Jasa Desain & Solusi Digital Profesional",
  description:
    "Layanan desain poster berkualitas tinggi untuk kebutuhan bisnis dan personal. Harga terjangkau, hasil memuaskan.",
  keywords: "jasa desain poster, desain grafis, poster event, poster promosi, logo design",
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
  robots: "index, follow",
  authors: [{ name: "Fanz Tech Team" }],
  creator: "Fanz Tech",
  publisher: "Fanz Tech",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://fanztech.com",
    title: "Fanz Tech - Jasa Desain & Solusi Digital Profesional",
    description: "Kami menyediakan layanan desain poster eksklusif dan solusi digital dengan kualitas premium untuk personal, UMKM, dan Corporate.",
    siteName: "Fanz Tech",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fanz Tech - Jasa Desain & Solusi Digital Profesional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fanz Tech - Jasa Desain & Solusi Digital Profesional",
    description: "Layanan desain poster berkualitas tinggi untuk kebutuhan bisnis dan personal.",
    images: ["/og-image.png"],
  },
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
