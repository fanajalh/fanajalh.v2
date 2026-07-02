"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"

function NavigationLoaderInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Show loader on page transition (whenever pathname or query params change)
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 450) // Show loader for 450ms during transitions for smooth visual feedback
    
    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
        <div className="space-y-0.5">
          <span className="text-slate-900 font-extrabold text-xs uppercase tracking-widest animate-pulse block">Memproses Halaman</span>
          <span className="text-slate-500 font-bold text-[9px] uppercase tracking-wider block">Harap tunggu...</span>
        </div>
      </div>
    </div>
  )
}

export default function NavigationLoader() {
  return (
    <Suspense fallback={null}>
      <NavigationLoaderInner />
    </Suspense>
  )
}
