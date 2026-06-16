"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  CheckCircle2, X, Star, ArrowRight, Sparkles, Zap, Crown, HelpCircle,
  FileImage, Printer, Smartphone, Layers
} from "lucide-react"

export default function ServicesAndPricing() {
  const [settings, setSettings] = useState<any>(null)
  const [dbServices, setDbServices] = useState<any[]>([])
  const [emptyMessage, setEmptyMessage] = useState("Maaf, layanan kami sedang dalam mode libur/tutup sementara.")
  const [activeCategory, setActiveCategory] = useState("poster")

  useEffect(() => {
    try {
      const saved = localStorage.getItem("websiteSettings")
      if (saved) {
        const parsed = JSON.parse(saved)
        setSettings(parsed)
        if (parsed.services) setDbServices(parsed.services)
        if (parsed.emptyStateMessage) setEmptyMessage(parsed.emptyStateMessage)
      }
    } catch (e) {
      console.error(e)
    }

    fetch("/api/website-settings")
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.data) {
          const parsed = resData.data
          setSettings(parsed)
          if (parsed.services) setDbServices(parsed.services)
          if (parsed.emptyStateMessage) setEmptyMessage(parsed.emptyStateMessage)
          localStorage.setItem("websiteSettings", JSON.stringify(parsed))
        }
      })
      .catch(err => console.error("Error fetching settings in ServicesAndPricing:", err))
  }, [])

  const isClosed = settings ? settings.orderPageOpen === false : false

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

  const plans = [
    {
      name: "Basic",
      description: "Untuk kebutuhan personal atau tugas harian.",
      monthlyPrice: 15000,
      icon: Zap,
      features: [
        "1 Pilihan Layout Poster",
        "2x Revisi Minor",
        "Format Digital (JPG/PNG)",
        "Resolusi Standar",
        "Pengerjaan 2-3 Hari",
        "Support via Chat",
      ],
      notIncluded: [
        "Source File (PSD/AI)", 
        "Desain Super Kompleks", 
        "Pengerjaan Kilat", 
        "Konsultasi Konsep"
      ],
      buttonStyle: "bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10",
      buttonText: "Mulai Project",
      popular: false,
    },
    {
      name: "Professional",
      description: "Pilihan utama untuk branding dan promosi UMKM.",
      monthlyPrice: 20000,
      icon: Sparkles,
      features: [
        "1 Desain Poster Premium",
        "5x Revisi",
        "Multi-Format (JPG, PNG, PDF)",
        "Resolusi Tinggi (Print Ready)",
        "Source File Included",
        "Pengerjaan 2-3 Hari",
        "Konsultasi Arah Desain",
        "Priority Support",
      ],
      notIncluded: ["Pengerjaan Kilat (24 Jam)"],
      buttonStyle: "bg-black dark:bg-white text-white dark:text-black hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white border border-black dark:border-white transition-colors",
      buttonText: "Pilih Professional",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "Solusi end-to-end untuk skala komersial besar.",
      monthlyPrice: 25000,
      icon: Crown,
      features: [
        "1 Desain Poster Eksklusif",
        "Revisi Sepuasnya",
        "Semua Format + Template Base",
        "Resolusi Ultra HD 4K",
        "Prioritas Pengerjaan Kilat",
        "Dedicated Designer",
        "24/7 VIP Support",
        "Lisensi Komersial Bebas",
      ],
      notIncluded: [],
      buttonStyle: "bg-white dark:bg-black text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10",
      buttonText: "Pilih Enterprise",
      popular: false,
    },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <section id="services" className="relative py-24 lg:py-32 bg-gray-50 dark:bg-black overflow-hidden selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black border-t border-gray-200 dark:border-white/10">
      
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),dark:linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none z-0"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        
        {/* Services / Layanan Joki Header (Always Visible) */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-2">
            <Layers className="w-5 h-5 text-black dark:text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tight uppercase">
            Layanan Joki Desain
          </h2>
          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Kualitas visual agensi besar, kini tersedia untuk kebutuhan personal dan bisnis Anda.
          </p>
        </div>

        {isClosed ? (
          /* ================= UNIFIED CLOSED STATE ================= */
          <div className="mb-20">
            <div className="p-16 flex flex-col items-center justify-center text-center border-4 border-black dark:border-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.15)] bg-white dark:bg-black max-w-3xl mx-auto">
              <div className="w-16 h-16 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)]">
                <span className="text-2xl">🚧</span>
              </div>
              <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-widest mb-3">Layanan & Pemesanan Tutup</h3>
              <p className="text-sm font-bold text-gray-505 dark:text-gray-400 uppercase tracking-widest leading-relaxed">
                {emptyMessage}
              </p>
            </div>
          </div>
        ) : (
          /* ================= OPEN STATE: SERVICES + PRICING ================= */
          <>
            {/* Category Tabs */}
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

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-gray-200 dark:border-white/10 bg-white dark:bg-black mb-32">
              {(() => {
                const currentCategoryServices = services[activeCategory as keyof typeof services]
                return currentCategoryServices.map((service, index) => {
                  const matchedService = dbServices.find(s => s.name.toLowerCase() === service.title.toLowerCase())
                  const displayPrice = matchedService ? new Intl.NumberFormat("id-ID").format(matchedService.price) : service.price
                  const customStatus = matchedService?.customStatus
                  const isActive = matchedService ? matchedService.active : true

                  if (!isActive) return null

                  return (
                    <div
                      key={index}
                      className="relative bg-white dark:bg-black p-8 transition-all duration-300 flex flex-col h-full group border-r border-b border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      {/* Best Value Badge */}
                      {service.popular && (
                        <div className="absolute top-0 right-0 bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 z-10">
                          Best Value
                        </div>
                      )}

                      {/* Title & Description */}
                      <div className="mb-8 relative z-10 pt-4">
                        <h3 className="text-xl font-bold text-black dark:text-white mb-3 uppercase tracking-wide">{service.title}</h3>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                          {service.description}
                        </p>
                      </div>

                      {/* Features */}
                      <div className="mb-10 flex-1 relative z-10">
                        <ul className="space-y-4">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <div className="w-5 h-5 bg-gray-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5 border border-gray-200 dark:border-white/10">
                                <CheckCircle2 size={12} className="text-black dark:text-white" />
                              </div>
                              <span className="text-sm font-semibold text-gray-600 dark:text-gray-350">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Price & Action */}
                      <div className="pt-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-between relative z-10">
                        <div>
                          <span className="text-[10px] font-bold text-gray-505 uppercase tracking-widest block mb-1">Mulai Dari</span>
                          <div className="flex items-baseline gap-1">
                            {customStatus ? (
                              <span className="text-xs font-black text-red-500 uppercase tracking-widest border border-red-500 px-2 py-0.5 bg-red-50 dark:bg-red-900/20">{customStatus}</span>
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
                        >
                          <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  )
                })
              })()}
            </div>

            {/* Pricing Header */}
            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-black dark:text-white" />
                <span className="text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.2em]">
                  Investasi Visual
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tight uppercase">
                Transparan & Terjangkau
              </h2>
              <p className="text-lg text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
                Harga jelas tanpa biaya tersembunyi. Tingkatkan kualitas visual bisnis Anda dengan ROI yang masuk akal.
              </p>
            </div>

            {/* Pricing Plans Grid */}
            <div className="grid lg:grid-cols-3 gap-0 items-stretch max-w-6xl mx-auto border-l border-t border-gray-200 dark:border-white/10 bg-white dark:bg-black mb-32">
              {plans.map((plan, index) => {
                const matchedPlan = dbServices.find(s => s.name.toLowerCase() === plan.name.toLowerCase())
                const displayPrice = matchedPlan ? matchedPlan.price : plan.monthlyPrice
                const customStatus = matchedPlan?.customStatus
                const isActive = matchedPlan ? matchedPlan.active : true

                if (!isActive) return null

                return (
                  <div
                    key={index}
                    className={`relative flex flex-col bg-white dark:bg-black transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/5 p-8 md:p-10 border-r border-b border-gray-200 dark:border-white/10 ${
                      plan.popular ? "z-20 shadow-2xl scale-[1.02] border border-black dark:border-white" : "z-10"
                    }`}
                  >
                    {/* Best Seller Badge */}
                    {plan.popular && (
                      <div className="absolute top-0 right-0">
                        <div className="bg-black dark:bg-white text-white dark:text-black px-5 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                          <Star size={12} className="fill-current" />
                          Best Seller
                        </div>
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex justify-between items-start mb-8 pt-4">
                      <div>
                        <h3 className="text-2xl font-bold text-black dark:text-white uppercase tracking-wider">{plan.name}</h3>
                        <p className="text-xs font-semibold text-gray-505 dark:text-gray-400 mt-2 line-clamp-2 pr-4">{plan.description}</p>
                      </div>
                      <div className={`p-3 border flex-shrink-0 ${plan.popular ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-white dark:bg-black text-black dark:text-white border-gray-200 dark:border-white/10'}`}>
                        <plan.icon size={24} />
                      </div>
                    </div>

                    {/* Price block */}
                    <div className="mb-8 relative z-10 pt-4">
                      <div className="flex items-baseline gap-2 mb-1">
                        {customStatus ? (
                          <span className="text-xs font-black text-red-500 uppercase tracking-widest border border-red-500 px-2 py-1 bg-red-50 dark:bg-red-900/20">{customStatus}</span>
                        ) : (
                          <>
                            <span className="text-5xl font-bold text-black dark:text-white tracking-tighter">
                              {formatPrice(displayPrice).replace("Rp", "").trim()}
                            </span>
                            <span className="text-lg font-bold text-gray-550 dark:text-gray-400">IDR</span>
                          </>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        / PROJECT
                      </span>
                    </div>

                    <div className="h-px w-full bg-gray-200 dark:bg-white/10 mb-8" />

                    {/* Features list */}
                    <div className="flex-1 space-y-8 mb-10">
                      <div className="space-y-4">
                        <p className="text-[10px] font-bold text-black dark:text-white uppercase tracking-widest mb-4">Yang Anda Dapatkan:</p>
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-gray-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5 border border-gray-200 dark:border-white/10">
                              <CheckCircle2 size={12} className="text-black dark:text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {plan.notIncluded.length > 0 && (
                        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/10">
                          <p className="text-[10px] font-bold text-gray-450 dark:text-gray-505 uppercase tracking-widest mb-4">Tidak Termasuk:</p>
                          {plan.notIncluded.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3 opacity-60">
                              <X size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    <Link
                      href="/order"
                      className={`w-full flex items-center justify-center gap-2 py-4 rounded-none font-bold transition-all duration-300 group/btn ${plan.buttonStyle}`}
                    >
                      {plan.buttonText}
                      <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* ================= FAQ SECTION (Rendered in BOTH states) ================= */}
        <div className="mt-32 max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-2">
              <HelpCircle className="w-5 h-5 text-black dark:text-white" />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-black dark:text-white tracking-tight uppercase">F.A.Q</h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Masih ragu? Temukan jawabannya di sini.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-0 border-t border-l border-gray-200 dark:border-white/10 bg-white dark:bg-black">
            {[
              {
                q: "Apakah ada biaya tersembunyi?",
                a: "Sama sekali tidak. Harga yang tertera pada paket sudah final dan transparan. Tidak ada biaya kejutan di akhir."
              },
              {
                q: "Bagaimana sistem pembayarannya?",
                a: "Untuk keamanan bersama, pembayaran dilakukan 50% di awal (DP) dan sisa 50% dilunasi setelah desain selesai 100%."
              },
              {
                q: "Berapa lama proses pengerjaan?",
                a: "Rata-rata 2-3 hari kerja. Jika Anda memilih paket Enterprise atau menambah fitur Rush Order, bisa selesai kurang dari 24 jam."
              },
              {
                q: "Bagaimana jika saya tidak suka hasilnya?",
                a: "Setiap paket mencakup jatah revisi (unlimited untuk Enterprise) agar hasil akhirnya benar-benar sesuai dengan brand guidelines Anda."
              },
              {
                q: "Bagaimana cara kerja Ekosistem Bisnis?",
                a: "Ini adalah alur terintegrasi: cari prospek di Google Maps (Lead Finder), kelola kontak (CRM), jalankan promosi SMTP (Email Blast), riset ide kata kunci AI (Keyword Planner), tulis konten web (SEO Writer), dan pantau ranking Google (SERP Tracker)."
              },
              {
                q: "Apa itu batas uji coba Akun Tamu (Guest)?",
                a: "Tamu dapat memilih 1 fitur apa saja secara gratis. Begitu fitur tersebut digunakan, IP Anda akan terkunci pada fitur itu dengan batas 5 email blast atau 1 kali input AI/SERP. Modul lainnya otomatis dinonaktifkan."
              },
              {
                q: "Bagaimana cara membuka fitur yang terkunci?",
                a: "Cukup daftar atau masuk ke Akun Gratis. 6 fitur ekosistem akan langsung terbuka untuk Anda gunakan secara berurutan sesuai alur pengerjaan bisnis."
              },
              {
                q: "Apakah ada batas kuota untuk Akun Gratis?",
                a: "Ya. Akun gratis dibatasi maksimal mengirim 45 email blast, dan 5 kali input fitur AI/SERP per 5 hari. Hubungi admin via WhatsApp untuk upgrade ke paket Premium/Unlimited."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white dark:bg-black p-6 lg:p-8 border-r border-b border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <h4 className="text-lg font-bold text-black dark:text-white mb-3 uppercase tracking-wide">{faq.q}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
