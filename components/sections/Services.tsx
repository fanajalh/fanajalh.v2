"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileImage, Printer, Smartphone, ArrowRight, CheckCircle2, Layers } from "lucide-react"

export default function Services() {
  const [activeCategory, setActiveCategory] = useState("poster")
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
    { id: "poster", label: "Poster Design", icon: FileImage },
    { id: "social", label: "Social Media", icon: Smartphone },
    { id: "print", label: "Print Design", icon: Printer },
  ]

  const services = {
    poster: [
      {
        title: "Poster Event / Konser",
        description: "Desain poster eksklusif untuk konser, seminar, workshop, dan acara premium.",
        features: ["Desain memukau", "Hierarki visual rapi", "Format ultra HD", "3x revisi minor"],
        price: "15.000",
        popular: false,
      },
      {
        title: "Poster Promosi Bisnis",
        description: "Poster berdaya konversi tinggi untuk promosi produk dan jasa bisnis Anda.",
        features: ["Desain persuasif", "High CTR layouts", "Brand consistency", "Multiformat (IG/WA)"],
        price: "15.000",
        popular: true,
      },
      {
        title: "Infografis & Edukasi",
        description: "Visualisasi data infografis elegan untuk edukasi dan kampanye masyarakat.",
        features: ["Infografis elegan", "Tipografi bersih", "Data terstruktur", "Visual engaging"],
        price: "20.000",
        popular: false,
      },
    ],
    social: [
      {
        title: "Instagram Post (Feed)",
        description: "Desain feed Instagram premium yang konsisten dan memikat audiens Anda.",
        features: ["Template eksklusif", "Aesthetic grid", "Engagement focused", "Resolusi tinggi"],
        price: "25.000",
        popular: true,
      },
      {
        title: "Social Media Story",
        description: "Desain story interaktif dan clean untuk semua platform media sosial.",
        features: ["Multi-platform", "Animasi-ready", "Brand guidelines", "Visual kekinian"],
        price: "10.000",
        popular: false,
      },
      {
        title: "Cover / Banner Web",
        description: "Header sosial media profesional (YouTube, Facebook, LinkedIn).",
        features: ["Platform optimized", "High resolution", "Brand aligned", "Pengerjaan cepat"],
        price: "20.000",
        popular: false,
      },
    ],
    print: [
      {
        title: "Flyer & Brosur",
        description: "Desain materi promosi cetak yang elegan, tajam, dan persuasif.",
        features: ["Eye-catching", "Print optimization (CMYK)", "Cost effective", "Fast turnaround"],
        price: "15.000",
        popular: false,
      },
      {
        title: "Spanduk (Outdoor)",
        description: "Format besar resolusi tinggi untuk event dan advertising outdoor.",
        features: ["Large format scale", "Vektor presisi", "High visibility", "Ukuran custom"],
        price: "20.000",
        popular: true,
      },
    ],
  }

  return (
    <section id="services" className="relative py-24 lg:py-32 bg-gray-50 dark:bg-black overflow-hidden selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black border-t border-gray-200 dark:border-white/10">
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        
        {/* ================= HEADER ================= */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-2">
            <Layers className="w-5 h-5 text-black dark:text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tight">
            Layanan Eksklusif
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            Kualitas visual agensi besar, kini tersedia untuk kebutuhan personal dan bisnis Anda.
          </p>
        </div>

        {/* ================= CATEGORY TABS ================= */}
        <div className="flex flex-wrap justify-center gap-2 mb-16 bg-white dark:bg-white/5 p-1 border border-gray-200 dark:border-white/10 max-w-fit mx-auto relative z-20">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all duration-300 relative ${
                activeCategory === category.id
                  ? "text-white dark:text-black bg-black dark:bg-white"
                  : "bg-transparent text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10"
              }`}
            >
              <category.icon size={18} className={activeCategory === category.id ? "text-white dark:text-black" : "text-gray-400 dark:text-gray-500"} />
              <span>{category.label}</span>
            </button>
          ))}
        </div>

        {/* ================= SERVICES GRID ================= */}
        {(() => {
          const currentCategoryServices = services[activeCategory as keyof typeof services];
          const visibleServices = currentCategoryServices.filter(service => {
            const matchedService = dbServices.find((s: any) => s.name.toLowerCase() === service.title.toLowerCase())
            return matchedService ? matchedService.active : true
          });

          if (visibleServices.length === 0) {
            return (
              <div className="p-16 flex flex-col items-center justify-center text-center border border-gray-200 dark:border-white/10 bg-white dark:bg-black max-w-3xl mx-auto">
                <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6">
                  <span className="text-2xl">🚧</span>
                </div>
                <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-widest mb-2">Layanan Sedang Tutup</h3>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{emptyMessage}</p>
              </div>
            )
          }

          return (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-gray-200 dark:border-white/10 bg-white dark:bg-black">
              {currentCategoryServices.map((service, index) => {
            const matchedService = dbServices.find((s: any) => s.name.toLowerCase() === service.title.toLowerCase())
            const displayPrice = matchedService ? new Intl.NumberFormat("id-ID").format(matchedService.price) : service.price
            const customStatus = matchedService?.customStatus
            const isActive = matchedService ? matchedService.active : true

            if (!isActive) return null

            return (
              <div
                key={index}
                className={`relative bg-white dark:bg-black p-8 transition-all duration-300 flex flex-col h-full group border-r border-b border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5`}
              >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute top-0 right-0 bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  Best Value
                </div>
              )}

              {/* Title & Description */}
              <div className="mb-8 relative z-10 pt-4">
                <h3 className="text-xl font-bold text-black dark:text-white mb-3">{service.title}</h3>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                  {service.description}
                </p>
              </div>

              {/* Features List */}
              <div className="mb-10 flex-1 relative z-10">
                <ul className="space-y-4">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-gray-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5 border border-gray-200 dark:border-white/10">
                        <CheckCircle2 size={12} className="text-black dark:text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price & Action */}
              <div className="pt-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-between relative z-10">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Mulai Dari</span>
                  <div className="flex items-baseline gap-1">
                    {customStatus ? (
                      <span className="text-sm font-black text-red-500 uppercase tracking-widest border border-red-500 px-2 py-1 bg-red-50 dark:bg-red-900/20">{customStatus}</span>
                    ) : (
                      <span className="text-2xl font-bold text-black dark:text-white">Rp {displayPrice}</span>
                    )}
                  </div>
                </div>
                
                <Link
                  href="/order"
                  className={`flex items-center justify-center w-12 h-12 transition-all duration-300 group/btn border ${
                    service.popular 
                      ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white hover:bg-white dark:hover:bg-transparent hover:text-black dark:hover:text-white" 
                      : "bg-white dark:bg-transparent text-black dark:text-white border-gray-200 dark:border-white/20 hover:border-black dark:hover:border-white"
                  }`}
                  title="Order Sekarang"
                >
                  <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>

            </div>
            )
          })}
            </div>
          )
        })()}

      </div>
    </section>
  )
}