"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CheckCircle2, X, Star, ArrowRight, Sparkles, Zap, Crown, HelpCircle } from "lucide-react"

export default function Pricing() {
  const [dbServices, setDbServices] = useState<any[]>([])
  const [emptyMessage, setEmptyMessage] = useState("Maaf, layanan kami sedang dalam mode libur/tutup sementara.")

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
    <section id="pricing" className="relative py-24 lg:py-32 bg-gray-50 dark:bg-black overflow-hidden selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black border-t border-gray-200 dark:border-white/10">
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-black dark:text-white" />
            <span className="text-[10px] font-bold text-black dark:text-white uppercase tracking-[0.2em]">
              Investasi Visual
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white tracking-tight">
            Transparan & Terjangkau
          </h2>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
            Harga jelas tanpa biaya tersembunyi. Tingkatkan kualitas visual bisnis Anda dengan ROI yang masuk akal.
          </p>
        </div>

        {/* ================= PRICING CARDS ================= */}
        {(() => {
          const visiblePlans = plans.filter(plan => {
            const matchedPlan = dbServices.find((s: any) => s.name.toLowerCase() === plan.name.toLowerCase())
            return matchedPlan ? matchedPlan.active : true
          });

          if (visiblePlans.length === 0) {
            return (
              <div className="p-16 flex flex-col items-center justify-center text-center border border-gray-200 dark:border-white/10 bg-white dark:bg-black max-w-3xl mx-auto">
                <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6">
                  <span className="text-2xl">🚧</span>
                </div>
                <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-widest mb-2">Pemesanan Sedang Tutup</h3>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{emptyMessage}</p>
              </div>
            )
          }

          return (
            <div className="grid lg:grid-cols-3 gap-0 items-stretch max-w-6xl mx-auto border-l border-t border-gray-200 dark:border-white/10 bg-white dark:bg-black">
              {plans.map((plan, index) => {
            const matchedPlan = dbServices.find((s: any) => s.name.toLowerCase() === plan.name.toLowerCase())
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
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-black dark:bg-white text-white dark:text-black px-5 py-2 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Star size={12} className="fill-current" />
                    Best Seller
                  </div>
                </div>
              )}

              {/* Card Header */}
              <div className="flex justify-between items-start mb-8 pt-4">
                <div>
                  <h3 className="text-2xl font-bold text-black dark:text-white">{plan.name}</h3>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2 line-clamp-2 pr-4">{plan.description}</p>
                </div>
                <div className={`p-3 border flex-shrink-0 ${plan.popular ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white' : 'bg-white dark:bg-black text-black dark:text-white border-gray-200 dark:border-white/10'}`}>
                  <plan.icon size={24} />
                </div>
              </div>

                <div className="mb-8 relative z-10 pt-4">
                  <div className="flex items-baseline gap-2 mb-1">
                    {customStatus ? (
                      <span className="text-sm font-black text-red-500 uppercase tracking-widest border border-red-500 px-2 py-1 bg-red-50 dark:bg-red-900/20">{customStatus}</span>
                    ) : (
                      <>
                        <span className="text-5xl font-bold text-black dark:text-white tracking-tighter">
                          {formatPrice(displayPrice).replace("Rp", "").trim()}
                        </span>
                        <span className="text-lg font-bold text-gray-500 dark:text-gray-400">IDR</span>
                      </>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    / PROJECT
                  </span>
                </div>

              <div className="h-px w-full bg-gray-200 dark:bg-white/10 mb-8" />

              {/* Features List */}
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
                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Tidak Termasuk:</p>
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
          )
        })()}

        {/* ================= FAQ SECTION ================= */}
        <div className="mt-32 max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center justify-center p-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-2">
              <HelpCircle className="w-5 h-5 text-black dark:text-white" />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-black dark:text-white tracking-tight">F.A.Q</h3>
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
                a: "Setiap paket sudah mencakup jatah revisi (bahkan unlimited untuk Enterprise) agar hasil akhirnya benar-benar sesuai dengan brand guidelines Anda."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white dark:bg-black p-6 lg:p-8 border-r border-b border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <h4 className="text-lg font-bold text-black dark:text-white mb-3">{faq.q}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}