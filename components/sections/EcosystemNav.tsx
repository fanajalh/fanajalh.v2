"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Users, Mail, Key, Wrench, BarChart3, ArrowLeft, Palette, Lock, HelpCircle, Sparkles, Globe } from "lucide-react"
import Swal from "sweetalert2"

const NAV_ITEMS = [
  { href: "/lead-finder", label: "Lead Finder", icon: Search, shortLabel: "Lead" },
  { href: "/crm", label: "CRM", icon: Users, shortLabel: "CRM" },
  { href: "/blast", label: "Blast Email", icon: Mail, shortLabel: "Blast" },
  { href: "/keyword", label: "Keyword", icon: Key, shortLabel: "Keyword" },
  { href: "/seo-tools", label: "SEO Tools", icon: Wrench, shortLabel: "SEO" },
  { href: "/ai-optimization", label: "AI Optimization", icon: Sparkles, shortLabel: "AI Opt" },
  { href: "/site-audit", label: "Site Audit", icon: Globe, shortLabel: "Audit" },
  { href: "/tracking", label: "Tracking", icon: BarChart3, shortLabel: "Track" },
]

const FEATURE_KEYS: Record<string, string> = {
  "/lead-finder": "lead_finder",
  "/crm": "crm",
  "/blast": "blast",
  "/keyword": "keyword",
  "/seo-tools": "seo",
  "/ai-optimization": "geo",
  "/site-audit": "site_audit",
  "/tracking": "tracking",
}

export default function EcosystemNav() {
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
    <nav className="sticky top-0 z-[40] bg-white dark:bg-black border-b-4 border-black dark:border-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 relative overflow-hidden rounded-none flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] border-2 border-black dark:border-white transform -rotate-3 group-hover:rotate-0 transition-transform shrink-0">
                <img src="/feed arfan (20).png" alt="AllFanajalh Logo" className="w-full h-full object-cover" />
              </div>
            </Link>
            <div>
              <h1 className="text-sm font-black tracking-widest uppercase text-black dark:text-white leading-none">
                Business <span className="text-emerald-500">Ecosystem</span>
              </h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                AllFanajalh
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/tutorial"
              className="flex items-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-widest text-emerald-500 hover:text-emerald-600 border-2 border-transparent hover:border-emerald-500 transition-all"
            >
              <HelpCircle size={14} strokeWidth={3} />
              <span className="hidden sm:inline">Tutorial</span>
            </Link>
            <Link
              href={(() => {
                if (typeof window !== "undefined") {
                  try {
                    const cache = sessionStorage.getItem("ecosystem_progression")
                    if (cache) {
                      const parsed = JSON.parse(cache)
                      if (parsed.role && parsed.role !== "guest") return "/dashboard"
                    }
                  } catch {}
                }
                return "/"
              })()}
              className="flex items-center gap-2 px-3 py-2 text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white border-2 border-transparent hover:border-black dark:hover:border-white transition-all"
            >
              <ArrowLeft size={14} strokeWidth={3} />
              <span className="hidden sm:inline">Beranda</span>
            </Link>
          </div>
        </div>

        {/* Tab nav */}
        <div className="flex overflow-x-auto no-scrollbar -mb-[4px]">
          {NAV_ITEMS.map((item) => {
            const featureKey = FEATURE_KEYS[item.href] || ""
            const isUnlocked = unlocked[featureKey] !== false // Default true if not explicitly restricted
            const isActive = pathname === item.href
            const Icon = isUnlocked ? item.icon : Lock

            const handleClick = (e: React.MouseEvent) => {
              if (!isUnlocked) {
                e.preventDefault()
                Swal.fire({
                  icon: "error",
                  title: "Akses Terkunci 🔒",
                  text: "Anda harus menggunakan fitur sebelumnya terlebih dahulu untuk membuka fitur ini!",
                  confirmButtonColor: "#000"
                })
              }
            }

            return (
              <Link
                key={item.href}
                ref={isActive ? activeRef : undefined}
                href={item.href}
                onClick={handleClick}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest whitespace-nowrap border-b-4 transition-all ${
                  isActive
                    ? "text-black dark:text-white border-black dark:border-white bg-gray-50 dark:bg-white/5"
                    : isUnlocked
                    ? "text-gray-600 dark:text-gray-400 border-transparent hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600"
                    : "text-gray-300 dark:text-gray-600 border-transparent cursor-not-allowed"
                }`}
              >
                <Icon size={16} strokeWidth={isActive ? 3 : 2} />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.shortLabel}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
