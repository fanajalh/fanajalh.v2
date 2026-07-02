import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles, Layout, Layers, CheckCircle } from "lucide-react"
import MagneticButton from "@/components/ui/MagneticButton"
import { motion } from "framer-motion"

import { headersConfig } from "./headersConfig"

interface HeroProps {
  orderPageOpen?: boolean
  websiteSettings?: any
}

export default function Hero({ orderPageOpen = true, websiteSettings }: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0, filter: "blur(10px)" },
    visible: {
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { type: "spring" as const, stiffness: 80, damping: 15 },
    },
  }

  const primaryLink = "#products"
  const primaryText = headersConfig.hero.primaryBtnText
  
  const siteSubtitle = websiteSettings?.tagline || headersConfig.hero.subtitle

  return (
    <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden min-h-screen flex items-center selection:bg-orange-500/30 selection:text-orange-900 dark:selection:text-orange-100">
      
      {/* ================= AMBIENT BACKGROUND ================= */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]"></div>
      
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-orange-500/10 to-transparent dark:from-orange-500/20 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-tl from-amber-500/10 to-rose-500/5 dark:from-orange-600/20 dark:to-rose-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* ================= LEFT CONTENT (Copywriting) ================= */}
          <motion.div 
            className="flex-1 space-y-8 text-center lg:text-left relative z-20"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Cinematic Heading */}
            {/* Cinematic Heading */}
            <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-[5rem] font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter">
              {headersConfig.hero.titleLine1} <br className="hidden lg:block" />
              <span className="bg-gradient-to-r from-[#ff7a00] via-[#f97316] to-[#fbbf24] bg-clip-text text-transparent drop-shadow-sm">
                {headersConfig.hero.titleLine2Gradient}
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              {siteSubtitle}
            </motion.p>

            {/* CTA Group */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start pt-6">
              <MagneticButton>
                <Link 
                  href={primaryLink} 
                  className="group relative flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#ff7a00] to-[#ea580c] text-white font-bold text-base rounded-2xl shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:shadow-[0_0_60px_rgba(249,115,22,0.4)] hover:-translate-y-1 active:scale-95 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                  <span className="relative z-10 flex items-center gap-2">
                    {primaryText}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </span>
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link 
                  href="#portfolio" 
                  className="group flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-white dark:bg-white/5 backdrop-blur-md text-slate-800 dark:text-white font-bold text-base rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300"
                >
                  <Layout className="w-5 h-5 text-slate-400 group-hover:text-orange-500 transition-colors" />
                  {headersConfig.hero.secondaryBtnText}
                </Link>
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* ================= RIGHT CONTENT: 3 STACKED CARDS ================= */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="flex-1 w-full relative max-w-[280px] sm:max-w-sm lg:max-w-md mx-auto mt-20 lg:mt-0 aspect-[4/5] perspective-[1200px] group cursor-pointer"
          >
            {/* Ambient Glow for Cards */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/30 via-amber-400/20 to-purple-500/20 blur-[80px] -z-10 rounded-full animate-pulse duration-[7000ms]" />

            {/* CARD 3 (Paling Belakang / Bawah) */}
            <motion.div 
              animate={{ y: [0, -8, 0], rotateZ: [-6, -5, -6] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 0.4 }}
              className="absolute inset-0 z-10 opacity-50 dark:opacity-40 transition-all duration-700 ease-out group-hover:translate-x-12 group-hover:-translate-y-6 group-hover:rotate-[-10deg] scale-[0.85] translate-y-12 translate-x-6 origin-bottom"
            >
              {/* Ditambahin 'relative' di sini biar gambarnya nggak bocor */}
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-slate-200/50 dark:border-white/10 bg-white dark:bg-slate-900 shadow-lg">
                <Image src="/feed arfan (20).png" alt="Desain 3" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent dark:from-black/60 dark:to-black/20 mix-blend-overlay pointer-events-none"></div>
              </div>
            </motion.div>

            {/* CARD 2 (Tengah) */}
            <motion.div 
              animate={{ y: [0, -10, 0], rotateZ: [4, 5, 4] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.2 }}
              className="absolute inset-0 z-20 opacity-80 dark:opacity-70 transition-all duration-700 ease-out group-hover:-translate-x-10 group-hover:-translate-y-2 group-hover:rotate-[8deg] scale-[0.92] translate-y-6 -translate-x-4 origin-bottom"
            >
              {/* Ditambahin 'relative' di sini */}
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-slate-200/60 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl shadow-black/5 dark:shadow-black/20">
                <Image src="/feed arfan (20).png" alt="Desain 2" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent dark:from-black/40 dark:to-black/10 mix-blend-overlay pointer-events-none"></div>
              </div>
            </motion.div>

            {/* CARD 1 (Paling Depan / Utama) */}
            <motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
              className="absolute inset-0 z-30 transition-all duration-700 ease-out group-hover:translate-y-2 group-hover:scale-[1.02]"
            >
              <div className="relative w-full h-full p-[3px] rounded-[2rem] bg-gradient-to-br from-white/90 via-white/40 to-white/10 dark:from-white/20 dark:via-white/5 dark:to-white/0 shadow-[0_20px_50px_-10px_rgba(249,115,22,0.2)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.6)] backdrop-blur-sm">
                <div className="relative w-full h-full rounded-[1.85rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-100/50 dark:border-white/5">
                  <Image 
                    src="/feed arfan (20).png" 
                    alt="Desain Utama" 
                    fill 
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover" 
                  />
                  {/* Subtle Glass Reflection Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 dark:via-white/5 dark:to-white/10 pointer-events-none"></div>
                </div>
              </div>
            </motion.div>

            {/* Floating Element: Badge (Attached to Front Card) */}
            <motion.div 
              animate={{ y: [-6, 6, -6], rotateZ: [-2, 2, -2] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
              className="absolute -right-6 lg:-right-10 top-16 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-3.5 border border-white dark:border-slate-700/50 rounded-2xl shadow-2xl flex items-center gap-3 transition-transform duration-700 ease-out group-hover:translate-x-4 group-hover:-translate-y-2"
            >
              <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center rounded-[0.85rem] shadow-inner">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <div className="pr-2">
                <p className="text-[10px] font-extrabold text-orange-500 uppercase tracking-widest mb-0.5">Kualitas</p>
                <p className="text-sm font-black text-slate-800 dark:text-white">Premium</p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  )
}