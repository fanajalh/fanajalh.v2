"use client"

import { useState, useEffect } from "react"
import { Palette, Smartphone, Printer, Sparkles, ChevronLeft, Search, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"
import { PackagePopup } from "@/components/cart"

interface ServiceInfo {
  id: string
  title: string
  basePrice: number
}

export default function LayananPage() {
  const [activeCategory, setActiveCategory] = useState("poster")
  const [popupOpen, setPopupOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<ServiceInfo | null>(null)
  
  const [dbServices, setDbServices] = useState<any[]>([])
  const [emptyMessage, setEmptyMessage] = useState("Maaf, layanan untuk kategori ini sedang tidak tersedia atau libur sementara.")

  useEffect(() => {
    try {
      const saved = localStorage.getItem("websiteSettings")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.services) setDbServices(parsed.services)
        if (parsed.emptyStateMessage) setEmptyMessage(parsed.emptyStateMessage)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  const categories = [
    { id: "poster", label: "Poster & Banner", icon: Palette },
    { id: "social", label: "Social Media", icon: Smartphone },
    { id: "print", label: "Cetak Digital", icon: Printer },
  ]

  const services = {
    poster: [
      {
        title: "Poster Promosi Bisnis",
        description: "Visual persuasif untuk promosi produk atau event bisnis Anda.",
        price: "15.000",
        basePrice: 15000,
        popular: true,
        serviceId: "poster-event",
      },
      {
        title: "Infografis & Edukasi",
        description: "Informasi akurat disajikan dengan desain menarik & mudah dipahami.",
        price: "20.000",
        basePrice: 20000,
        popular: false,
        serviceId: "poster-edukasi",
      },
      {
        title: "Poster Event / Konser",
        description: "Desain poster siap cetak & posting untuk konser, seminar, dll.",
        price: "15.000",
        basePrice: 15000,
        popular: false,
        serviceId: "poster-event",
      },
    ],
    social: [
      {
        title: "Instagram Post (Feed)",
        description: "Desain feed Instagram konsisten dengan brand guidelines.",
        price: "25.000",
        basePrice: 25000,
        popular: true,
        serviceId: "social-media",
      },
      {
        title: "Social Media Story",
        description: "Template story kekinian siap upload untuk IG, FB, WA.",
        price: "10.000",
        basePrice: 10000,
        popular: false,
        serviceId: "social-media",
      },
      {
        title: "Cover / Banner Web",
        description: "Banner optimalisasi untuk Youtube Channel, Facebook Page.",
        price: "20.000",
        basePrice: 20000,
        popular: false,
        serviceId: "social-media",
      },
    ],
    print: [
      {
        title: "Spanduk (Outdoor)",
        description: "Desain format besar skala jernih untuk cetak outdoor/indoor.",
        price: "20.000",
        basePrice: 20000,
        popular: true,
        serviceId: "lainnya",
      },
      {
        title: "Flyer & Brosur",
        description: "Desain flyer CMYK siap cetak untuk optimasi persebaran info.",
        price: "15.000",
        basePrice: 15000,
        popular: false,
        serviceId: "print-flyer",
      },
    ],
  }

  const handlePesan = (service: typeof services.poster[0]) => {
    setSelectedService({
      id: service.serviceId,
      title: service.title,
      basePrice: service.basePrice,
    })
    setPopupOpen(true)
  }

  return (
    <div className="bg-[#f4f6f9] min-h-screen font-sans select-none pb-24 top-0 w-full">
      <div className="max-w-5xl mx-auto w-full md:px-6"> 
      {/* 1. SUPER APP HEADER */}
      <div className="bg-orange-600 pt-12 pb-6 px-4 rounded-b-[2rem] shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3 mb-5">
          <Link href="/" className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors active:scale-95">
            <ChevronLeft size={24} strokeWidth={2.5} />
          </Link>
          <div className="flex-1">
            <h1 className="text-white text-lg font-extrabold tracking-tight">Layanan Desain</h1>
            <p className="text-orange-100 text-xs font-medium">Cepat, Murah, Berkualitas</p>
          </div>
        </div>

        <div className="bg-white rounded-full flex items-center px-4 py-3.5 shadow-inner">
          <Search size={18} className="text-slate-400 mr-3" />
          <input 
            type="text" 
            placeholder="Cari layanan (mis: Logo, Spanduk)..." 
            className="bg-transparent border-none outline-none w-full text-sm font-medium text-slate-800 placeholder:text-slate-400"
            readOnly
          />
        </div>
      </div>

      {/* 2. STICKY CATEGORY TABS */}
      <div className="sticky top-[140px] z-40 bg-[#f4f6f9]/90 backdrop-blur-xl py-3 border-b border-slate-200/60 shadow-sm">
        <div className="flex gap-2.5 overflow-x-auto snap-x px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((category) => {
            const isActive = activeCategory === category.id
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`snap-center flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] font-extrabold transition-all duration-200 whitespace-nowrap active:scale-95 outline-none ${
                  isActive 
                    ? "bg-slate-900 text-white shadow-md" 
                    : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Icon size={16} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white' : 'text-slate-400'} />
                {category.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. LIST LAYANAN */}
      <div className="px-4 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {(() => {
          const currentCategoryServices = services[activeCategory as keyof typeof services];
          const visibleServices = currentCategoryServices.filter(service => {
            const matchedService = dbServices.find((s: any) => s.name.toLowerCase() === service.title.toLowerCase())
            return matchedService ? matchedService.active : true
          });

          if (visibleServices.length === 0) {
            return (
              <div className="col-span-full p-10 flex flex-col items-center justify-center text-center bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mt-2">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                  <span className="text-3xl">🚧</span>
                </div>
                <h3 className="text-[17px] font-extrabold text-slate-800 tracking-tight mb-2">Layanan Sedang Tutup</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-sm">{emptyMessage}</p>
              </div>
            )
          }

          return visibleServices.map((service, index) => {
            const matchedService = dbServices.find((s: any) => s.name.toLowerCase() === service.title.toLowerCase())
            const displayPrice = matchedService ? new Intl.NumberFormat("id-ID").format(matchedService.price) : service.price
            const customStatus = matchedService?.customStatus

            return (
              <div 
                key={index} 
                className="bg-white rounded-[2rem] p-5 md:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 flex flex-col active:scale-[0.98] transition-all duration-200"
              >
                <div className="flex gap-4 mb-4">
                  <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-[1.2rem] flex items-center justify-center shrink-0 border border-orange-100/50">
                    <Sparkles size={24} strokeWidth={2} />
                  </div>
                  
                  <div className="flex-1 pt-0.5">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-[15px] font-extrabold text-slate-800 tracking-tight leading-snug pr-2">
                        {service.title}
                      </h3>
                      {service.popular && (
                        <span className="shrink-0 bg-red-100 text-red-600 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1">
                          <Zap size={10} className="fill-current" /> Populer
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] font-medium text-slate-500 leading-relaxed line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="w-full border-t border-dashed border-slate-200 my-4 flex-grow" />

                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Mulai Dari</p>
                    <div className="flex items-center gap-0.5">
                      {customStatus ? (
                        <span className="text-[12px] font-extrabold text-red-500 bg-red-50 px-2 py-1 rounded-md border border-red-100">{customStatus}</span>
                      ) : (
                        <>
                          <span className="text-[13px] font-bold text-slate-800">Rp</span>
                          <span className="text-lg font-black text-slate-800">{displayPrice}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handlePesan(service)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-full text-[13px] font-extrabold transition-colors active:scale-95 outline-none flex items-center gap-1.5 shadow-sm shadow-orange-600/30"
                  >
                    Pesan <ArrowRight size={14} strokeWidth={3} />
                  </button>
                </div>
              </div>
            )
          })
        })()}
      </div>
      
      </div>

      {/* Package Selection Popup */}
      <PackagePopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        service={selectedService}
      />
    </div>
  )
}