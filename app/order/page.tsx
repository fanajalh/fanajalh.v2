"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, ChevronRight, FileText, Check, Loader2, Sparkles, ShieldCheck } from "lucide-react"
import Link from "next/link"
import Swal from "sweetalert2"
import { useSession } from "next-auth/react"

import {
  SuccessModal,
  ProgressBar,
  StepService,
  StepDetails,
  StepUpload,
  StepReview,
  services,
  packages,
  formatPrice,
  calculateTotal,
  initialOrderData,
  type OrderData,
} from "@/components/order"

function OrderPageContent() {
  const { data: session, status: sessionStatus } = useSession()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    async function checkAccess() {
      try {
        const res = await fetch(`/api/website-settings?t=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache, no-store, must-revalidate", "Pragma": "no-cache" }
        })
        const json = await res.json()
        if (json.success && json.data) {
          const isOpen = json.data.orderPageOpen === true
          const isAdmin = session?.user && (session.user as any).role === "admin"
          if (!isOpen && !isAdmin) {
            setAccessDenied(true)
            return
          }
        } else {
          setAccessDenied(true)
        }
      } catch (err) {
        console.error("Error checking page access:", err)
        setAccessDenied(true)
      } finally {
        setCheckingAccess(false)
      }
    }
    if (sessionStatus !== "loading") {
      checkAccess()
    }
  }, [session, sessionStatus])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [lastOrderDetails, setLastOrderDetails] = useState({
    orderNumber: "",
    totalPrice: 0,
  })

  const [orderData, setOrderData] = useState<OrderData>(initialOrderData)

  // Auto-select service/package dari query parameter
  useEffect(() => {
    if (!searchParams) return
    const serviceParam = searchParams.get("service")
    const packageParam = searchParams.get("package")
    const skipParam = searchParams.get("skip")

    if (serviceParam) {
      setOrderData((prev) => ({ ...prev, service: serviceParam }))
    }
    if (packageParam) {
      setOrderData((prev) => ({ ...prev, package: packageParam }))
    }
    // Kalau ada param skip=true, langsung loncat ke step 2
    if (serviceParam && packageParam && skipParam === "true") {
      setStep(2)
    }
  }, [searchParams])

  // ==================== NAVIGATION ====================
  const nextStep = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    if (step === 1 && (!orderData.service || !orderData.package)) return
    if (step === 2 && (!orderData.details.title || !orderData.details.description || !orderData.details.deadline))
      return
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    if (step > 1) setStep(step - 1)
  }

  // ==================== MODAL CLOSE ====================
  const closeModal = (confirmWhatsApp: boolean) => {
    setIsModalOpen(false)
    const currentTotal = formatPrice(lastOrderDetails.totalPrice)
    const orderNumber = lastOrderDetails.orderNumber

    const whatsappMessage = `Halo! Saya baru saja submit pesanan dengan Order ID: ${orderNumber}\n\nDetail pesanan:\n- Layanan: ${orderData.service.replace("-", " ")}\n- Paket: ${orderData.package}\n- Total: ${currentTotal}\n\nMohon konfirmasi dan info lebih lanjut. Terima kasih!`
    const whatsappUrl = `https://wa.me/6285728150223?text=${encodeURIComponent(whatsappMessage)}`

    if (confirmWhatsApp) window.open(whatsappUrl, "_blank")

    setOrderData(initialOrderData)
    setStep(1)
    setLastOrderDetails({ orderNumber: "", totalPrice: 0 })
  }

  // ==================== SUBMIT ====================
  const handleSubmit = async () => {
    if (isSubmitting || isSuccess) return

    if (!orderData.contact.name || !orderData.contact.email || !orderData.contact.phone) {
      Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Harap lengkapi Nama, Email, dan No. WhatsApp.' })
      return
    }

    setIsSubmitting(true)
    setIsSuccess(false)

    try {
      const { files, ...dataToSend } = orderData

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      })

      const result = await response.json()

      if (result.success) {
        setIsSuccess(true)
        const currentTotal = calculateTotal(orderData)
        setLastOrderDetails({ orderNumber: result.order.order_number, totalPrice: currentTotal })
        setIsModalOpen(true)
        setTimeout(() => setIsSuccess(false), 3000)
      } else {
        Swal.fire({ icon: 'error', title: 'Gagal', text: result.message })
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Terjadi kesalahan saat mengirim pesanan. Silakan coba lagi.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Cek apakah step ini bisa dilanjutkan
  const canProceed = () => {
    if (step === 1) return !!(orderData.service && orderData.package)
    if (step === 2) return !!(orderData.details.title && orderData.details.description && orderData.details.deadline)
    return true
  }

  // ==================== RENDER ====================
  if (sessionStatus === "loading" || checkingAccess) {
    return (
      <div className="min-h-screen bg-[#f4f6f9] dark:bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    )
  }

  const isAdmin = session?.user && (session.user as any).role === "admin"

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-orange-500/20 selection:text-orange-100">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-950/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-8 animate-pulse text-orange-600/60 flex items-center gap-2">
            <Sparkles size={20} className="blur-[1px] text-yellow-500" />
          </div>
          <h1
            className="
              text-7xl md:text-9xl lg:text-[12rem] font-black tracking-tighter uppercase leading-none
              text-transparent bg-clip-text
              bg-[linear-gradient(110deg,#333333,45%,#ffffff,55%,#333333)]
              bg-[length:250%_100%]
              hover:bg-[position:100%_0]
              transition-[background-position] duration-[1500ms] ease-in-out
              cursor-default mb-6
            "
          >
            CLOSE
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-xl font-bold leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 uppercase tracking-wide">
            Layanan Pemesanan saat ini sedang ditutup sementara waktu. Hubungi admin untuk info kuota pengerjaan.
          </p>
          <Link 
            href="/" 
            className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-[#f4f6f9] pt-6 md:pt-12 pb-32 selection:bg-orange-200 selection:text-orange-900 overflow-x-hidden font-sans select-none">

      {/* Background Ambient Tones */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-orange-400/10 rounded-full blur-[100px] pointer-events-none" />

      <SuccessModal
        isOpen={isModalOpen}
        orderId={lastOrderDetails.orderNumber}
        totalPrice={formatPrice(lastOrderDetails.totalPrice)}
        onClose={closeModal}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">

        {/* Header App Style */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200/60 rounded-full shadow-sm text-slate-600 hover:text-orange-600 hover:border-orange-200 hover:bg-orange-50 active:scale-90 transition-all"
          >
            <ArrowLeft size={20} strokeWidth={2.5} className="pr-0.5" />
          </Link>

          <div className="text-center absolute left-1/2 -translate-x-1/2 pointer-events-none">
            <h1 className="text-[18px] md:text-xl font-black text-slate-800 tracking-tight flex items-center gap-1.5 justify-center">
              Checkout <ShieldCheck size={18} className="text-green-500" />
            </h1>
          </div>

          {/* Empty div for flex balance */}
          <div className="w-10 h-10"></div>
        </div>

        {/* Progress Bar (Memanggil komponen ProgressBar baru) */}
        <ProgressBar step={step} />

        {/* Main Content Card */}
        <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 p-5 md:p-8 mb-6 relative z-20">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {step === 1 && <StepService orderData={orderData} setOrderData={setOrderData} />}
            {step === 2 && <StepDetails orderData={orderData} setOrderData={setOrderData} />}
            {step === 3 && <StepUpload onSkip={nextStep} />}
            {step === 4 && <StepReview orderData={orderData} setOrderData={setOrderData} />}
          </div>
        </div>

        {/* Jaminan Teks di Bawah Form */}
        <div className="text-center pb-24">
          <p className="text-[11px] font-bold text-slate-400 flex items-center justify-center gap-1.5">
            <Sparkles size={12} className="text-amber-400" /> Transaksi aman dan terenkripsi
          </p>
        </div>

      </div>

      {/* ==================== STICKY BOTTOM ACTION BAR (Gojek/Traveloka Style) ==================== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/85 backdrop-blur-xl border-t border-slate-200/60 p-4 pb-6 md:pb-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.06)] animate-in slide-in-from-bottom-full duration-500">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">

          {/* Bagian Kiri: Tombol Back (Step 2+) ATAU Info Harga (Step 1) */}
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 active:scale-95 transition-all outline-none"
              >
                <ArrowLeft size={20} strokeWidth={2.5} />
              </button>
            )}

            {/* Info Harga Selalu Muncul Jika Layanan & Paket Dipilih */}
            {orderData.service && orderData.package ? (
              <div className="pl-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Total Harga</p>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-[13px] font-bold text-slate-800">Rp</span>
                  <span className="text-[20px] font-black text-slate-800 leading-none tracking-tight">
                    {formatPrice(calculateTotal(orderData))}
                  </span>
                </div>
              </div>
            ) : (
              <div className="pl-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Status</p>
                <p className="text-[13px] font-bold text-slate-500">Pilih Layanan</p>
              </div>
            )}
          </div>

          {/* Bagian Kanan: Tombol Lanjut / Bayar */}
          {step < 4 ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="flex-1 max-w-[200px] flex items-center justify-center gap-1.5 px-6 py-3.5 bg-orange-600 text-white font-extrabold text-[14px] rounded-[1.2rem] hover:bg-orange-700 transition-all active:scale-95 disabled:opacity-40 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-[0_8px_20px_rgba(234,88,12,0.25)] outline-none"
            >
              Lanjut <ChevronRight size={18} strokeWidth={3} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={
                !orderData.contact.name ||
                !orderData.contact.email ||
                !orderData.contact.phone ||
                isSubmitting ||
                isModalOpen
              }
              className={`flex-1 max-w-[220px] flex items-center justify-center gap-2 px-6 py-3.5 font-extrabold text-[14px] rounded-[1.2rem] transition-all shadow-lg active:scale-95 outline-none disabled:opacity-40 disabled:cursor-not-allowed ${isSuccess
                  ? "bg-emerald-500 text-white shadow-emerald-500/30"
                  : "bg-slate-900 text-white shadow-slate-900/20 hover:bg-black"
                }`}
            >
              {isSuccess ? (
                <>
                  <Check size={18} strokeWidth={3} /> Selesai!
                </>
              ) : isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Memproses...
                </>
              ) : (
                <>
                  <FileText size={18} strokeWidth={2.5} /> Pesan Sekarang
                </>
              )}
            </button>
          )}

        </div>
      </div>

    </div>
  )
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-orange-500" /></div>}>
      <OrderPageContent />
    </Suspense>
  )
}