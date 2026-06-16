import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, Sparkles, Layout, MonitorSmartphone, Layers } from "lucide-react"
import MagneticButton from "@/components/ui/MagneticButton"
import { motion } from "framer-motion"

interface HeroProps {
  orderPageOpen?: boolean
}

export default function Hero({ orderPageOpen = true }: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 100, damping: 10 },
    },
  }

  const primaryLink = orderPageOpen ? "/order" : "/ecosystem"
  const primaryText = orderPageOpen ? "Mulai Project" : "Coba SaaS Ecosystem"

  return (
    <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 bg-white dark:bg-black overflow-hidden selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black min-h-screen flex items-center">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),dark:linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          
          {/* ================= LEFT CONTENT (Copywriting) ================= */}
          <motion.div 
            className="flex-1 space-y-8 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            
            {/* Sleek Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5 px-4 py-2 bg-black text-white dark:bg-white dark:text-black border-2 border-black dark:border-white rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
              <Sparkles size={14} />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                Joki Poster & SaaS Ecosystem
              </span>
            </motion.div>

            {/* Editorial Heading */}
            <motion.h1 variants={itemVariants} className="text-5xl sm:text-6xl lg:text-7xl font-black text-black dark:text-white leading-[1.05] tracking-tighter uppercase">
              Joki Poster & <br className="hidden sm:block" />
              <span className="text-gray-400 dark:text-gray-500">
                SaaS Ecosystem.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-black dark:text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-bold uppercase tracking-wider">
              Jasa joki desain poster profesional di Purwokerto dan platform SaaS Business Ecosystem lengkap untuk mempercepat pertumbuhan bisnis Anda.
            </motion.p>

            {/* CTA Group */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <MagneticButton>
                <Link 
                  href={primaryLink} 
                  className="group flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest rounded-none border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all duration-300"
                >
                  {primaryText}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </MagneticButton>

              <MagneticButton>
                <Link 
                  href="#portfolio" 
                  className="group flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 bg-white dark:bg-black text-black dark:text-white font-black uppercase tracking-widest rounded-none border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
                >
                  <Layout className="w-5 h-5 transition-colors" />
                  Lihat Portfolio
                </Link>
              </MagneticButton>
            </motion.div>


          </motion.div>

          {/* ================= RIGHT CONTENT (Visual Presentation) ================= */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex-1 w-full relative max-w-lg lg:max-w-none mx-auto mt-12 lg:mt-0"
          >
            
            {/* The Main "Canvas" Box */}
            <div className="relative z-10 bg-white dark:bg-black p-4 border-4 border-black dark:border-white shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] dark:shadow-[20px_20px_0px_0px_rgba(255,255,255,1)] rounded-none transition-transform hover:-translate-y-2 duration-500">
              <div className="relative overflow-hidden bg-gray-100 dark:bg-white/5 aspect-[4/5] w-full border-4 border-black dark:border-white rounded-none">
                {/* Abstract placeholder for the design mockup */}
                <div className="absolute inset-0 flex flex-col justify-between p-8 bg-white dark:bg-black">
                   <div className="flex justify-between items-start">
                      <div className="w-12 h-12 border-2 border-black dark:border-white bg-black dark:bg-white flex items-center justify-center rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                         <MonitorSmartphone className="text-white dark:text-black w-6 h-6" />
                      </div>
                      <div className="flex gap-2">
                         <div className="w-3 h-3 bg-black dark:bg-white rounded-none" />
                         <div className="w-3 h-3 bg-black dark:bg-white rounded-none" />
                         <div className="w-3 h-3 bg-black dark:bg-white rounded-none" />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="h-6 w-1/3 bg-gray-200 dark:bg-white/10 rounded-none border-2 border-black dark:border-white" />
                      <div className="h-12 w-3/4 bg-black dark:bg-white rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" />
                      <div className="h-4 w-full bg-gray-100 dark:bg-white/5 rounded-none border-2 border-black dark:border-white" />
                      <div className="h-4 w-5/6 bg-gray-100 dark:bg-white/5 rounded-none border-2 border-black dark:border-white" />
                   </div>
                   <div className="mt-8 flex gap-3">
                      <div className="h-14 w-full bg-black dark:bg-white rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] border-2 border-black dark:border-white" />
                      <div className="h-14 w-14 bg-white dark:bg-black flex-shrink-0 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] border-2 border-black dark:border-white" />
                   </div>
                </div>
                <Image
                  src="/feed arfan (20).png"
                  alt="Desain Poster Premium"
                  fill
                  priority
                  className="object-cover mix-blend-multiply dark:mix-blend-normal opacity-90 hover:opacity-100 transition-all duration-700 cursor-pointer grayscale hover:grayscale-0"
                />
              </div>
            </div>

            {/* Floating Card 1: Layers (Top Right) */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-6 top-16 z-20 bg-white dark:bg-black p-4 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hidden md:flex items-center gap-3 rounded-none"
            >
              <div className="w-10 h-10 bg-black dark:bg-white border-2 border-black dark:border-white flex items-center justify-center rounded-none">
                <Layers className="w-5 h-5 text-white dark:text-black" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Kualitas</p>
                <p className="text-sm font-black text-black dark:text-white uppercase tracking-wider">Pixel Perfect</p>
              </div>
            </motion.div>

            {/* Floating Card 2: Satisfaction Guarantee (Bottom Left) */}
            <motion.div 
              animate={{ y: [0, 10, 0], rotate: [-3, -1, -3] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute -left-8 bottom-20 z-20 bg-black dark:bg-white p-4 border-4 border-black dark:border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] hidden md:flex items-center gap-3 rounded-none text-white dark:text-black hover:rotate-0 transition-transform cursor-pointer"
            >
              <div className="w-10 h-10 bg-white dark:bg-black border-2 border-black dark:border-white flex items-center justify-center rounded-none">
                <Sparkles className="w-5 h-5 text-black dark:text-white" />
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-wider">AllFanajalh</p>
                <p className="text-[10px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest mt-0.5">Joki Poster & SaaS</p>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  )
}