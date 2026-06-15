"use client"

import { useRouter } from "next/navigation"
import { MobileHeader } from "@/components/MobileHeader"
import { Check, Star, ArrowRight, Sparkles, Zap, Crown, ShoppingCart, Loader2 } from "lucide-react"
import { useCart } from "@/components/cart"
import { useState, useEffect } from "react"

export default function PaketPage() {
  const router = useRouter()
  const { addItem, setIsOpen } = useCart()
  const [addedPlan, setAddedPlan] = useState<string | null>(null)
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null)
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

    fetch("/api/website-settings")
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.data) {
          const parsed = resData.data
          if (parsed.services) setDbServices(parsed.services)
          if (parsed.emptyStateMessage) setEmptyMessage(parsed.emptyStateMessage)
          localStorage.setItem("websiteSettings", JSON.stringify(parsed))
        }
      })
      .catch(err => console.error("Error fetching settings:", err))
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price)
  }

  const handleAddToCart = (plan: typeof plans[0]) => {
    addItem({
      serviceId: "poster-event",  // default service
      serviceName: `Desain ${plan.name}`,
      packageId: plan.packageId,
      packageName: plan.name,
      price: plan.price,
    })
    setAddedPlan(plan.packageId)
    setTimeout(() => {
      setAddedPlan(null)
      setIsOpen(true)
    }, 800)
  }

  const plans = [
    {
      name: "Basic",
      description: "Tugas personal & simple.",
      price: 15000,
      icon: Zap,
      features: ["1 Konsep Desain", "2x Revisi Minor", "Format JPG/PNG Resolusi Tinggi", "Pengerjaan Reguler"],
      popular: false,
      // Tema Terang (Entry Level)
      // packageId harus cocok dengan id paket di halaman /order
      cardClass: "bg-white border-slate-200 text-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)]",
      iconBox: "bg-slate-50 text-slate-400 border border-slate-100",
      priceColor: "text-slate-800",
      checkColor: "text-orange-500",
      btnClass: "bg-slate-100 text-slate-700 hover:bg-slate-200 active:bg-slate-300",
      packageId: "basic",
    },
    {
      name: "Professional",
      description: "Branding & event promosi.",
      price: 25000,
      icon: Sparkles,
      features: ["1 Desain Premium", "5x Revisi Detail", "Semua Format (JPG, PNG, PDF)", "Gratis Source File", "Prioritas Pengerjaan"],
      popular: true,
      // Tema Oranye (The Bestseller / Focus Point)
      cardClass: "bg-gradient-to-br from-orange-500 via-[#ff6b00] to-orange-600 border-orange-400 text-white shadow-[0_15px_40px_-10px_rgba(249,115,22,0.5)] ring-2 ring-orange-500 ring-offset-4 ring-offset-[#f4f6f9]",
      iconBox: "bg-white/10 text-white border border-white/20 backdrop-blur-md",
      priceColor: "text-white",
      checkColor: "text-orange-200",
      btnClass: "bg-white text-orange-600 hover:bg-orange-50 active:bg-orange-100 shadow-lg",
      packageId: "professional",
    },
    {
      name: "Enterprise",
      description: "Skala perusahaan komersial.",
      price: 50000,
      icon: Crown,
      features: ["Eksklusif HD 4K", "Revisi Unlimited", "Dedicated Designer", "Full Commercial Rights"],
      popular: false,
      // Tema Gelap (Premium/Exclusive)
      cardClass: "bg-slate-900 border-slate-800 text-white shadow-[0_8px_30px_rgb(0,0,0,0.1)]",
      iconBox: "bg-slate-800 text-amber-400 border border-slate-700",
      priceColor: "text-white",
      checkColor: "text-amber-400",
      btnClass: "bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800",
      packageId: "enterprise",
    },
  ]

  return (
    <div className="bg-[#f4f6f9] min-h-screen font-sans pb-24 select-none">
      <div className="sticky top-0 z-50 bg-[#f4f6f9]/80 backdrop-blur-xl border-b border-slate-200/50">
        <MobileHeader title="Paket Harga" />
      </div>

      <div className="max-w-6xl mx-auto w-full">
      {/* Hero Section */}
      <div className="px-5 pt-10 pb-6 text-center relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-orange-400/20 rounded-full blur-[60px] pointer-events-none"></div>
        
        <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 shadow-sm">
          <Sparkles size={12} className="fill-current" />
          Harga Spesial
        </div>
        <h2 className="text-[28px] md:text-4xl font-black text-slate-800 tracking-tight leading-tight">Investasi <span className="text-orange-600">Visual</span></h2>
        <p className="text-[13px] md:text-[15px] font-medium text-slate-500 mt-2.5 leading-relaxed max-w-md mx-auto">
          Tingkatkan kualitas desain bisnis Anda menyesuaikan dengan anggaran.
        </p>
      </div>

      {/* Pricing Cards List */}
      <div className="px-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-2">
        {(() => {
          const visiblePlans = plans.filter(plan => {
            const matchedPlan = dbServices.find((s: any) => s.name.toLowerCase() === plan.name.toLowerCase())
            return matchedPlan ? matchedPlan.active : true
          });

          if (visiblePlans.length === 0) {
            return (
              <div className="col-span-full p-10 flex flex-col items-center justify-center text-center bg-white rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mt-2">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                  <span className="text-3xl">🚧</span>
                </div>
                <h3 className="text-[17px] font-extrabold text-slate-800 tracking-tight mb-2">Pemesanan Sedang Tutup</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-sm">{emptyMessage}</p>
              </div>
            )
          }

          return visiblePlans.map((plan, index) => {
            const Icon = plan.icon
            const matchedPlan = dbServices.find((s: any) => s.name.toLowerCase() === plan.name.toLowerCase())
            const displayPrice = matchedPlan ? matchedPlan.price : plan.price
            const customStatus = matchedPlan?.customStatus

            return (
              <div 
                key={index} 
                className={`relative rounded-[2rem] p-7 border transition-transform duration-300 ${plan.cardClass} ${plan.popular ? 'scale-[1.02] z-10' : 'active:scale-[0.98]'}`}
              >
                
                {/* Bestseller Floating Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 inset-x-0 flex justify-center">
                    <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-yellow-950 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5 border border-yellow-300">
                      <Star size={12} className="fill-current" />
                      Pilihan Favorit
                    </div>
                  </div>
                )}

                {/* Header Card (Icon & Title) */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-extrabold tracking-tight">{plan.name}</h3>
                    <p className={`text-[12px] mt-1.5 font-medium ${plan.popular ? 'text-orange-100' : 'text-slate-500'}`}>
                      {plan.description}
                    </p>
                  </div>
                  <div className={`p-3.5 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${plan.iconBox}`}>
                    <Icon size={22} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Price Display (Apple Style Layout) */}
                <div className="flex items-start gap-1 mb-7">
                  {customStatus ? (
                    <span className={`text-[15px] font-extrabold px-3 py-1.5 rounded-md border ${plan.popular ? 'bg-orange-700/50 text-white border-orange-400' : 'bg-red-50 text-red-500 border-red-100'}`}>
                      {customStatus}
                    </span>
                  ) : (
                    <>
                      <span className={`text-sm font-bold mt-1.5 ${plan.popular ? 'text-orange-200' : 'text-slate-400'}`}>Rp</span>
                      <span className={`text-[42px] font-black tracking-tighter leading-none ${plan.priceColor}`}>
                        {formatPrice(displayPrice)}
                      </span>
                      <span className={`text-[10px] font-bold self-end mb-1.5 ml-1 uppercase tracking-widest ${plan.popular ? 'text-orange-200' : 'text-slate-400'}`}>
                        / Proyek
                      </span>
                    </>
                  )}
                </div>

              {/* Features List */}
              <div className="space-y-3.5 mb-8">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className={`mt-0.5 shrink-0 ${plan.checkColor}`}>
                      <Check size={16} strokeWidth={3} />
                    </div>
                    <span className={`text-[13px] font-semibold leading-snug ${plan.popular ? 'text-white' : 'text-slate-600'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAddToCart(plan)}
                  disabled={addedPlan === plan.packageId}
                  className={`flex items-center justify-center gap-1.5 py-3.5 rounded-[1rem] text-[13px] font-extrabold transition-all outline-none active:scale-95 border-2 ${
                    addedPlan === plan.packageId
                      ? plan.popular ? 'bg-white/30 border-white/50 text-white' : 'bg-emerald-50 border-emerald-400 text-emerald-600'
                      : plan.popular ? 'bg-white/10 border-white/30 text-white hover:bg-white/20' : plan.packageId === 'enterprise' ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {addedPlan === plan.packageId ? (
                    <><Check size={15} strokeWidth={3} /> Added!</>
                  ) : (
                    <><ShoppingCart size={15} strokeWidth={2.5} /> Keranjang</>
                  )}
                </button>
                <button 
                  onClick={() => {
                    setNavigatingTo(plan.packageId)
                    router.push(`/order?package=${plan.packageId}`)
                  }}
                  disabled={navigatingTo === plan.packageId}
                  className={`flex items-center justify-center gap-1.5 py-3.5 rounded-[1rem] text-[13px] font-extrabold transition-all outline-none active:scale-95 disabled:opacity-70 ${plan.btnClass}`}
                >
                  {navigatingTo === plan.packageId ? (
                    <><Loader2 size={15} className="animate-spin" /> Memuat...</>
                  ) : (
                    <>Checkout <ArrowRight size={15} strokeWidth={3} /></>
                  )}
                </button>
              </div>
            </div>
          )
        })
        })()}
      </div>
      </div>

    </div>
  )
}