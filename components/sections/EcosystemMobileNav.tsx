"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Users, Mail, Key, Wrench, BarChart3, Lock, Sparkles, Globe } from "lucide-react"
import Swal from "@/lib/custom-alert"

const MOBILE_NAV_ITEMS = [
  { href: "/ecosystem/lead-finder", label: "Lead Finder", icon: Search, featureKey: "lead_finder" },
  { href: "/ecosystem/crm", label: "CRM", icon: Users, featureKey: "crm" },
  { href: "/ecosystem/blast", label: "Blast Email", icon: Mail, featureKey: "blast" },
  { href: "/ecosystem/keyword", label: "Keyword", icon: Key, featureKey: "keyword" },
  { href: "/ecosystem/seo-tools", label: "SEO Tools", icon: Wrench, featureKey: "seo" },
  { href: "/ecosystem/ai-optimization", label: "AI Opt", icon: Sparkles, featureKey: "geo" },
  { href: "/ecosystem/site-audit", label: "Audit", icon: Globe, featureKey: "site_audit" },
  { href: "/ecosystem/tracking", label: "Tracking", icon: BarChart3, featureKey: "tracking" },
]

export default function EcosystemMobileNav() {
  const pathname = usePathname()
  const activeRef = useRef<HTMLAnchorElement>(null)
  const [unlocked, setUnlocked] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      try {
        const cache = sessionStorage.getItem("ecosystem_progression")
        if (cache) {
          const parsed = JSON.parse(cache)
          if (parsed.success) {
            return parsed.status
          }
        }
      } catch {}
    }
    return {
      lead_finder: true,
      crm: false,
      blast: false,
      keyword: false,
      seo: false,
      tracking: false,
    }
  })

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/ecosystem/progression")
        const data = await res.json()
        if (data.success) {
          setUnlocked(data.status)
          sessionStorage.setItem("ecosystem_progression", JSON.stringify(data))
        }
      } catch (err) {
        console.error("Gagal mengambil status progression", err)
      }
    }
    fetchStatus()
  }, [])

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      })
    }
  }, [pathname])

  return (
    <div className="sticky top-[110px] z-40 bg-[#f4f6f9]/90 backdrop-blur-xl py-3 border-b border-slate-200/60 shadow-sm w-full">
      <div className="flex gap-2 px-4 overflow-x-auto snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full max-w-md mx-auto">
        {MOBILE_NAV_ITEMS.map((item) => {
          const isUnlocked = unlocked[item.featureKey] !== false
          const isActive = pathname === item.href
          const Icon = isUnlocked ? item.icon : Lock

          const handleClick = (e: React.MouseEvent) => {
            if (!isUnlocked) {
              e.preventDefault()
              Swal.fire({
                icon: "error",
                title: "Akses Terkunci 🔒",
                text: "Anda harus menggunakan fitur sebelumnya terlebih dahulu untuk membuka fitur ini!",
                confirmButtonColor: "#ea580c"
              })
            }
          }

          return (
            <Link
              key={item.href}
              ref={isActive ? activeRef : undefined}
              href={item.href}
              onClick={handleClick}
              className={`snap-center flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[12px] font-extrabold transition-all duration-200 whitespace-nowrap active:scale-95 outline-none border ${
                isActive
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : isUnlocked
                  ? "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  : "bg-slate-100 text-slate-350 border-slate-100 cursor-not-allowed"
              }`}
            >
              <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
