"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Search, LogOut } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { headersConfig } from "@/components/sections/headersConfig"

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  websiteSettings?: any;
}

export default function Navbar({ searchQuery, setSearchQuery, websiteSettings }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { data: session, status } = useSession()

  const siteName = websiteSettings?.siteName || headersConfig.brand.name

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [menuOpen])

  return (
    <nav className={`fixed left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] lg:w-[calc(100%-4rem)] max-w-[1400px] transition-all duration-300 ${
      scrolled ? "top-4" : "top-6"
    }`}>
      
      {/* ================= NAVBAR UTAMA (MENGAMBANG) ================= */}
      <div className={`transition-all duration-300 rounded-[1.5rem] px-5 lg:px-8 ${
        scrolled || searchOpen || menuOpen
          ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl"
          : "bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 shadow-sm"
      }`}>
        <div className="flex items-center justify-between h-[72px] gap-8">
          
          {/* KIRI: LOGO */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3" onClick={() => { setMenuOpen(false); setSearchOpen(false); }}>
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
                <img 
                  src={headersConfig.brand.logoUrl} 
                  alt="Logo" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {siteName}
              </span>
            </Link>
          </div>

          {/* TENGAH: MENU NAVIGASI */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-8">
            {headersConfig.navbar.navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[15px] font-semibold text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* KANAN: ACTIONS */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Search Toggle Button */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className={`hidden lg:flex p-2.5 rounded-xl transition-colors ${
                searchOpen 
                  ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600" 
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            <div className="hidden lg:block w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />
            
            {/* Auth Buttons */}
            {status === "authenticated" ? (
              <div className="hidden lg:flex items-center gap-4 ml-2">
                <span className="text-[15px] font-semibold text-slate-700 dark:text-slate-200">
                  {session?.user?.name?.split(' ')[0] || "User"}
                </span>
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link 
                href="/loginUser?mode=login"
                className="hidden lg:flex ml-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[15px] font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                Login / Daftar
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}
              className="lg:hidden ml-1 p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP SEARCH (TERPISAH MENGAMBANG) ================= */}
      {searchOpen && (
        <div className="hidden lg:block absolute top-[calc(100%+16px)] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl rounded-2xl p-2 animate-in fade-in zoom-in-95 duration-300">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              autoFocus
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik untuk mencari template poster, dll..." 
              className="w-full h-14 pl-12 pr-12 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 text-[15px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all outline-none"
            />
            <button 
              onClick={() => setSearchQuery("")} 
              className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-opacity ${searchQuery ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ================= MOBILE MENU (TERPISAH MENGAMBANG) ================= */}
      {menuOpen && (
        <div className="lg:hidden absolute top-[calc(100%+12px)] left-0 w-full border border-slate-200/80 dark:border-slate-800 rounded-[1.5rem] bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-5 py-6 space-y-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 max-h-[80vh] overflow-y-auto">
          
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari template..." 
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-orange-500 text-[15px] outline-none"
            />
          </div>

          <div className="flex flex-col space-y-2">
            {headersConfig.navbar.navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-[15px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            {status === "authenticated" ? (
              <div className="flex items-center justify-between px-4">
                <span className="text-[15px] font-semibold text-slate-900 dark:text-white">
                  {session?.user?.name || "User"}
                </span>
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 text-[15px] font-semibold text-rose-600"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/loginUser?mode=login" 
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center px-4 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[15px] font-bold rounded-xl"
              >
                Login / Daftar
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}