"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Menu, X, Palette, MessageCircle
} from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { ThemeToggle } from "@/components/ThemeToggle"

// ─────────────────────────── NAVBAR ───────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { label: "Poster Design", href: "#portfolio" },
    { label: "Ecosystem", href: "#ecosystem" },
    { label: "Layanan", href: "#services" },
    { label: "Harga", href: "#pricing" },
    { label: "Unduh APK", href: "#download-apk" },
    { label: "Web/APK", href: "/dev-portfolio" },
    { label: "Kontak", href: "#contact" },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      scrolled 
        ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-sm border-b border-gray-200 dark:border-white/10" 
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-[72px]">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 relative overflow-hidden rounded-xl flex items-center justify-center border border-gray-200 dark:border-white/10 shrink-0">
              <img src="/feed arfan (20).png" alt="AllFanajalh Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-lg font-bold tracking-tight text-black dark:text-white">
              AllFanajalh
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-300"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {status === "authenticated" ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Hai, {session?.user?.name?.split(' ')[0] || "User"}
                </span>
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-95 shadow-sm"
                  title="Keluar dari Akun"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link 
                  href="/loginUser?mode=register"
                  className="px-5 py-2.5 bg-transparent border border-gray-300 dark:border-white/20 hover:border-black dark:hover:border-white text-gray-700 dark:text-gray-350 hover:text-black dark:hover:text-white text-sm font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                >
                  Daftar
                </Link>
                <Link 
                  href="/loginUser?mode=login"
                  className="px-6 py-2.5 bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black text-sm font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              aria-label="Toggle mobile menu"
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-6 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl font-semibold text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-gray-100 dark:border-white/10 space-y-2">
              {status === "authenticated" ? (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-center text-gray-500 dark:text-gray-400">
                    Masuk sebagai: {session?.user?.name || "User"}
                  </p>
                  <button 
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full block px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm text-center rounded-xl active:scale-95 transition-all"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    href="/loginUser?mode=register" 
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 bg-transparent border border-gray-300 dark:border-white/20 text-gray-700 dark:text-gray-300 text-center font-bold text-sm rounded-xl active:scale-95 transition-all"
                  >
                    Daftar
                  </Link>
                  <Link 
                    href="/loginUser?mode=login" 
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 bg-black dark:bg-white text-white dark:text-black text-center font-bold text-sm rounded-xl active:scale-95 transition-all"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

// ─────────────────────────── FOOTER ───────────────────────────
function Footer() {
  return (
    <footer className="bg-white dark:bg-black text-gray-900 dark:text-white border-t border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="py-16 grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 relative overflow-hidden rounded-xl flex items-center justify-center border border-gray-200 dark:border-white/10 shrink-0">
                <img src="/feed arfan (20).png" alt="AllFanajalh Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-lg font-bold tracking-tight text-black dark:text-white">AllFanajalh</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed font-medium">
              Jasa desain premium dan solusi teknologi untuk bisnis skala menengah hingga enterprise. Kualitas berstandar industri.
            </p>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-5">Layanan</h4>
            <ul className="space-y-3">
              {["Poster Event", "Poster Promosi", "Social Media", "Solusi Web"].map((item) => (
                <li key={item}>
                  <Link href="/order" className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-medium">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-5">Navigasi</h4>
            <ul className="space-y-3">
              {[
                { label: "Portfolio", href: "#portfolio" },
                { label: "Harga", href: "#pricing" },
                { label: "Kontak", href: "#contact" },
                { label: "Kotak Saran", href: "/saran" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-medium">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hubungi */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-5">Hubungi</h4>
            <ul className="space-y-3">
              <li className="text-sm text-gray-500 dark:text-gray-400 font-medium">arfan.7ovo@gmail.com</li>
              <li className="text-sm text-gray-500 dark:text-gray-400 font-medium">+62 851-3373-7623</li>
              <li className="text-sm text-gray-500 dark:text-gray-400 font-medium">Purwokerto, Jawa Tengah</li>
            </ul>
            <a 
              href="https://wa.me/6285133737623?text=Halo,%20saya%20tertarik%20dengan%20layanan%20Fanz%20Tech"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-black dark:text-white rounded-xl text-xs font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <MessageCircle size={14} /> Chat WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-white/10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 font-medium tracking-wide">
            © {new Date().getFullYear()} AllFanajalh. Crafted with precision by <a href="https://instagram.com/fan_ajalah" target="_blank" rel="noopener noreferrer" className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors font-bold">@fan_ajalah</a>
          </p>
          <div className="flex items-center gap-6">
            <a href="https://instagram.com/fan_ajalah" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-black dark:hover:text-white font-bold transition-colors uppercase tracking-widest">Instagram</a>
            <a href="https://lynk.id/fan_ajalah" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-black dark:hover:text-white font-bold transition-colors uppercase tracking-widest">Lynk.id</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────── FLOATING WHATSAPP ───────────────────────────
function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!visible) return null

  return (
    <a
      href="https://wa.me/6285133737623?text=Halo,%20saya%20tertarik%20dengan%20layanan%20desain%20poster%20Anda"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 hover:scale-110 active:scale-95 transition-all duration-300 animate-in zoom-in-50 group"
      aria-label="Chat WhatsApp"
    >
      <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
    </a>
  )
}

// ─────────────────────────── MAIN LANDING PAGE ───────────────────────────
import Hero from "@/components/sections/Hero"
import ServicesAndPricing from "@/components/sections/ServicesAndPricing"
import PortfolioSection from "@/components/sections/PortfolioSection"
import EcosystemPreview from "@/components/sections/EcosystemPreview"
import DownloadApkSection from "@/components/sections/DownloadApkSection"
import Lynk from "@/components/sections/Lynk"
import Contact from "@/components/sections/Contact"
import Marquee from "@/components/ui/Marquee"
import FadeIn from "@/components/ui/FadeIn"

function ValuePropositionBanner() {
  return (
    <section className="bg-white dark:bg-black text-black dark:text-white border-y-4 border-black dark:border-white py-16 px-6 relative z-10 selection:bg-orange-500 selection:text-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="max-w-md text-center lg:text-left space-y-3">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 block">Value Integration</span>
          <h3 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-[1.1] text-black dark:text-white">
            Dari Visual Kreatif <br className="hidden lg:block"/> Hingga Automasi Bisnis
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            Alur pemasaran modern terlengkap dari hulu ke hilir untuk mendongkrak omzet UMKM hingga Korporasi.
          </p>
        </div>
        <div className="flex-1 grid md:grid-cols-2 gap-8 w-full">
          <div className="bg-gray-50 dark:bg-white/5 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)] p-8 flex flex-col justify-between rounded-none hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-350">
            <div>
              <span className="w-9 h-9 bg-orange-500 text-white flex items-center justify-center font-black text-sm mb-6 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] rounded-none">01</span>
              <h4 className="font-black text-sm uppercase tracking-widest mb-3 text-orange-500">Joki Poster (Visual)</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                Pengerjaan desain grafis premium (poster, feed IG, banner) berdaya konversi tinggi untuk membangun identitas brand Anda.
              </p>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-white/5 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.15)] p-8 flex flex-col justify-between rounded-none hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-350">
            <div>
              <span className="w-9 h-9 bg-emerald-500 text-white flex items-center justify-center font-black text-sm mb-6 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.1)] rounded-none">02</span>
              <h4 className="font-black text-sm uppercase tracking-widest mb-3 text-emerald-500">SaaS Ecosystem (Outreach)</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                Temukan data prospek tertarget (Lead Finder), kelola interaksi (CRM), dan sebar materi desain Anda via Email Blast secara instan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function LandingPage() {
  const [orderPageOpen, setOrderPageOpen] = useState(true)

  useEffect(() => {
    fetch("/api/website-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setOrderPageOpen(data.data.orderPageOpen !== false)
        }
      })
      .catch((err) => console.error("Error fetching settings in page.tsx:", err))
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <FadeIn delay={0.1}>
          <Hero orderPageOpen={orderPageOpen} />
        </FadeIn>
        <FadeIn delay={0.2}>
          <Marquee />
        </FadeIn>
        <ValuePropositionBanner />
        <FadeIn delay={0.1}>
          <PortfolioSection />
        </FadeIn>
        <FadeIn delay={0.1}>
          <EcosystemPreview />
        </FadeIn>
        <FadeIn delay={0.1}>
          <ServicesAndPricing />
        </FadeIn>
        <FadeIn delay={0.1}>
          <DownloadApkSection />
        </FadeIn>
        <FadeIn delay={0.1}>
          <Lynk />
        </FadeIn>
        <FadeIn delay={0.1}>
          <Contact orderPageOpen={orderPageOpen} />
        </FadeIn>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
