"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, X } from "lucide-react"
import { headersConfig } from "@/components/sections/headersConfig"

interface CountdownBannerProps {
  websiteSettings?: any
}

export default function CountdownBanner({ websiteSettings }: CountdownBannerProps) {
  const defaultSeconds = headersConfig.countdownPromo.countdownSeconds
  const [timeLeft, setTimeLeft] = useState<number>(-1)
  const [hasChecked, setHasChecked] = useState(false)
  
  useEffect(() => {
    const calculateTime = () => {
      const config = websiteSettings?.countdownPromo || {}
      if (config.countdownTarget) {
        const targetTime = new Date(config.countdownTarget).getTime()
        const diff = Math.max(0, Math.floor((targetTime - Date.now()) / 1000))
        setTimeLeft(diff)
      } else if (config.countdownSeconds !== undefined) {
        setTimeLeft(Number(config.countdownSeconds))
      } else {
        setTimeLeft(defaultSeconds)
      }
      setHasChecked(true)
    }

    calculateTime()

    const timer = setInterval(() => {
      const config = websiteSettings?.countdownPromo || {}
      if (config.countdownTarget) {
        const targetTime = new Date(config.countdownTarget).getTime()
        const diff = Math.max(0, Math.floor((targetTime - Date.now()) / 1000))
        setTimeLeft(diff)
      } else {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [websiteSettings, defaultSeconds])

  const formatCountdown = () => {
    const days = Math.floor(timeLeft / (24 * 3600))
    const hours = Math.floor((timeLeft % (24 * 3600)) / 3600)
    const minutes = Math.floor((timeLeft % 3600) / 60)
    const seconds = timeLeft % 60
    return {
      days: days.toString().padStart(2, "0"),
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0")
    }
  }

  const countdownVal = formatCountdown()

  const config = websiteSettings?.countdownPromo || {}
  const badge = config.badge || headersConfig.countdownPromo.badge
  const title = config.title || headersConfig.countdownPromo.title
  const subtitle = config.subtitle || headersConfig.countdownPromo.subtitle
  const buttonText = config.buttonText || headersConfig.countdownPromo.buttonText
  const image = config.image || headersConfig.countdownPromo.image

  const images = (image || "/ucapan.png").split("|").filter(Boolean)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  useEffect(() => {
    if (images.length <= 1) return
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [images.length])

  if (hasChecked && timeLeft <= 0) {
    return null
  }

  return (
    <section id="promo" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-[2rem] md:rounded-[2.5rem] bg-slate-900 text-white p-6 sm:p-10 md:p-14 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />

        <div className="lg:col-span-7 space-y-5 xs:space-y-7 z-10 text-left">
          <span className="inline-block bg-orange-500 text-white text-xs xs:text-sm font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-lg">
            {badge}
          </span>
          <h2 className="text-2xl xs:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] xs:leading-none">
            {title}
          </h2>
          <p className="text-sm xs:text-base text-slate-400 font-semibold">
            {subtitle}
          </p>

          {/* Countdown clock grids */}
          <div className="flex items-center gap-2 xs:gap-4 md:gap-6 py-2 select-none overflow-x-auto no-scrollbar">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 xs:w-16 xs:h-16 md:w-20 md:h-20 rounded-xl xs:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl xs:text-2xl md:text-3xl font-black text-orange-500">
                {countdownVal.days}
              </div>
              <span className="text-[10px] xs:text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Days</span>
            </div>
            <span className="text-lg xs:text-2xl md:text-3xl font-bold text-slate-600">:</span>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 xs:w-16 xs:h-16 md:w-20 md:h-20 rounded-xl xs:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl xs:text-2xl md:text-3xl font-black text-orange-500">
                {countdownVal.hours}
              </div>
              <span className="text-[10px] xs:text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Hours</span>
            </div>
            <span className="text-lg xs:text-2xl md:text-3xl font-bold text-slate-600">:</span>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 xs:w-16 xs:h-16 md:w-20 md:h-20 rounded-xl xs:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl xs:text-2xl md:text-3xl font-black text-orange-500">
                {countdownVal.minutes}
              </div>
              <span className="text-[10px] xs:text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Mins</span>
            </div>
            <span className="text-lg xs:text-2xl md:text-3xl font-bold text-slate-600">:</span>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 xs:w-16 xs:h-16 md:w-20 md:h-20 rounded-xl xs:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl xs:text-2xl md:text-3xl font-black text-orange-500">
                {countdownVal.seconds}
              </div>
              <span className="text-[10px] xs:text-xs text-slate-400 font-bold uppercase tracking-wider mt-2">Secs</span>
            </div>
          </div>

          {/* Action Button */}
          <Link 
            href={config.buttonLink || "#products"}
            className="inline-flex items-center gap-2.5 px-8 xs:px-10 py-4 xs:py-5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm xs:text-base uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95 duration-300"
          >
            {buttonText}
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Right Illustration Cover */}
        <div 
          onClick={() => setIsLightboxOpen(true)}
          className="lg:col-span-5 relative w-full aspect-square rounded-[2rem] overflow-hidden border border-white/10 select-none cursor-zoom-in group/img active:scale-95 transition-all duration-300"
          title="Klik untuk memperbesar"
        >
          <Image 
            src={images[currentImageIndex] || "/ucapan.png"} 
            alt="Promo Cover Bundle" 
            fill 
            className="object-cover transition-transform duration-500 group-hover/img:scale-105"
          />
          {/* Zoom icon overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity duration-300">
            <span className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white border border-white/25">
              Lihat Foto
            </span>
          </div>
        </div>
      </div>
      {/* Lightbox / Image Preview Modal */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[200] bg-slate-955/90 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-300"
          onClick={() => setIsLightboxOpen(false)}
        >
          <div className="relative max-w-3xl max-h-[85vh] w-full aspect-square rounded-3xl overflow-hidden border border-white/10" onClick={(e) => e.stopPropagation()}>
            <Image 
              src={images[currentImageIndex] || "/ucapan.png"} 
              alt="Preview full size" 
              fill
              className="object-contain"
            />
            {/* Close button */}
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white hover:bg-black/85 flex items-center justify-center transition-colors active:scale-90"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
