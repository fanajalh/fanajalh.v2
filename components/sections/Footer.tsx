import Link from "next/link"
import { headersConfig } from "@/components/sections/headersConfig"

interface FooterProps {
  websiteSettings?: any;
}

export default function Footer({ websiteSettings }: FooterProps) {
  const siteName = websiteSettings?.siteName || headersConfig.brand.name
  const siteSlogan = websiteSettings?.tagline || headersConfig.brand.slogan
  const email = websiteSettings?.email || "arfan.7ovo@gmail.com"
  const phone = websiteSettings?.whatsapp || "+62 851-3373-7623"
  const instagram = websiteSettings?.instagram || "@fan_ajalah"
  const cleanInstagram = instagram.replace("@", "")
  return (
    <footer className="relative bg-gradient-to-b from-orange-500 to-orange-600 dark:from-[#0B0F19] dark:to-black text-white border-t-0 mt-10 overflow-hidden">
      {/* Decorative Top Accent */}
      <div className="w-full h-1.5 bg-gradient-to-r from-amber-300 via-orange-400 to-rose-500 opacity-80 z-20 relative"></div>
      
      {/* ================= BACKGROUND DECORATION ================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Lingkaran Besar 1 */}
        <div className="absolute -top-24 -left-24 w-96 h-96 border-[40px] border-white/5 dark:border-white/5 rounded-full blur-[2px]"></div>
        {/* Lingkaran Besar 2 */}
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/5 dark:bg-orange-500/5 rounded-full blur-3xl"></div>
        {/* Lingkaran Kecil */}
        <div className="absolute top-1/4 right-1/4 w-32 h-32 border-8 border-white/10 dark:border-orange-500/10 rounded-full"></div>
        <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-white/10 dark:bg-white/5 rounded-full"></div>
        
        {/* Grid / Dots Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] opacity-50"></div>
      </div>
      {/* ========================================================= */}

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">

        <div className="py-20 grid md:grid-cols-4 gap-14">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 relative overflow-hidden rounded-2xl flex items-center justify-center bg-white dark:bg-slate-900 shadow-lg shadow-orange-900/20 dark:shadow-none shrink-0 p-1 border border-transparent dark:border-slate-800">
                <img src={headersConfig.brand.logoUrl} alt={`${siteName} Logo`} className="w-full h-full object-cover rounded-xl" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">{siteName}</span>
            </div>
            <p className="text-orange-100 dark:text-slate-400 text-base leading-relaxed font-medium">
              {siteSlogan}
            </p>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6 opacity-90">Koleksi Template</h4>
            <ul className="space-y-4">
              {["Template Poster Event", "Template Poster Promosi", "Template Instagram Feed", "Template Brosur & Spanduk"].map((item) => (
                <li key={item}>
                  <Link href="#products" className="text-base text-orange-100 dark:text-slate-400 hover:text-white dark:hover:text-orange-400 transition-colors font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-300 dark:bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigasi */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6 opacity-90">Navigasi</h4>
            <ul className="space-y-4">
              {[
                { label: "Home", href: "/" },
                { label: "Katalog", href: "#products" },
                { label: "Unduh APK", href: "#download-apk" },
                { label: "Hubungi", href: "#contact" }
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-base text-orange-100 dark:text-slate-400 hover:text-white dark:hover:text-orange-400 transition-colors font-medium flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-300 dark:bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hubungi */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-6 opacity-90">Hubungi</h4>
            <ul className="space-y-4">
              <li className="text-base text-orange-100 dark:text-slate-400 font-medium hover:text-white dark:hover:text-orange-400 transition-colors cursor-default">{email}</li>
              <li className="text-base text-orange-100 dark:text-slate-400 font-medium hover:text-white dark:hover:text-orange-400 transition-colors cursor-default">{phone.startsWith("62") ? `+62 ${phone.slice(2, 5)}-${phone.slice(5, 9)}-${phone.slice(9)}` : phone}</li>
              <li className="text-base text-orange-100 dark:text-slate-400 font-medium hover:text-white dark:hover:text-orange-400 transition-colors cursor-default">Purwokerto, Jawa Tengah</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-orange-400/30 dark:border-white/10 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-orange-200 dark:text-slate-500 font-medium tracking-wide text-center md:text-left">
            © {new Date().getFullYear()} {siteName}. Crafted with precision by <a href={`https://instagram.com/${cleanInstagram}`} target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-200 dark:hover:text-orange-400 transition-colors font-bold underline decoration-orange-400/50 dark:decoration-orange-500/30 underline-offset-4">{instagram}</a>
          </p>
          <div className="flex items-center gap-8">
            <a href={`https://instagram.com/${cleanInstagram}`} target="_blank" rel="noopener noreferrer" className="text-sm text-orange-100 dark:text-slate-400 hover:text-white dark:hover:text-orange-400 font-bold transition-colors uppercase tracking-widest">Instagram</a>
            <a href="https://lynk.id/fan_ajalah" target="_blank" rel="noopener noreferrer" className="text-sm text-orange-100 dark:text-slate-400 hover:text-white dark:hover:text-orange-400 font-bold transition-colors uppercase tracking-widest">Lynk.id</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
