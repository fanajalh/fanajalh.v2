import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Kotak Saran Desain",
  description: "Bantu kami menjadi lebih baik melalui masukan Anda",
}

export default function SaranLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
