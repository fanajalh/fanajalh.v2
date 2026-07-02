"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { 
  ArrowLeft, ShieldCheck, Loader2, Copy, Check, Clock, Mail, CheckCircle, 
  CreditCard, Tag, CheckSquare, Square, AlertCircle
} from "lucide-react"
import { motion } from "framer-motion"

function PaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()
  
  // Checkout flow states: "input" | "pay" | "success"
  const [flowState, setFlowState] = useState<"input" | "pay" | "success">("input")
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [copied, setCopied] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [agreePromo, setAgreePromo] = useState(true)
  
  // Inline feedback messages (replacing toast/popups)
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Product info from query params or package selection
  const [product, setProduct] = useState({
    title: "Template Poster Premium",
    image: "/feed arfan (20).png",
    price: 10000,
    packageId: "professional",
  })

  // Buyer info
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })

  // Prefill buyer info from session if logged in
  useEffect(() => {
    if (session?.user) {
      setBuyerInfo((prev) => ({
        ...prev,
        name: prev.name || session.user?.name || "",
        email: prev.email || session.user?.email || "",
      }))
    }
  }, [session])

  // Generated transaction details from backend
  const [transaction, setTransaction] = useState({
    orderNumber: "",
    totalPrice: 0,
  })

  // Timer states
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes

  // Auto-clear feedback after 5 seconds
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => setFeedbackMessage(null), 6000)
      return () => clearTimeout(timer)
    }
  }, [feedbackMessage])

  // Auto-load details from search parameters & fetch dynamic database pricing
  useEffect(() => {
    if (!searchParams) return

    const orderNumberParam = searchParams.get("orderNumber")
    if (orderNumberParam) {
      setLoading(true)
      fetch(`/api/payment/details?orderNumber=${orderNumberParam}`)
        .then(res => res.json())
        .then(json => {
          if (json.success && json.order) {
            const ord = json.order
            setBuyerInfo({
              name: ord.name || "",
              email: ord.email || "",
              phone: ord.phone || "",
            })
            setTransaction({
              orderNumber: ord.orderNumber,
              totalPrice: ord.totalPrice,
            })
            
            // Determine package title/image
            let displayTitle = ord.title || "Paket Kustom"
            let displayImg = "/feed arfan (20).png"
            if (ord.packageId === "basic") {
              displayTitle = "Basic Pack - Template"
              displayImg = "/promosi.png"
            } else if (ord.packageId === "professional") {
              displayTitle = "Professional Pack - Template"
              displayImg = "/feed arfan (20).png"
            } else if (ord.packageId === "enterprise") {
              displayTitle = "Enterprise Bundle - Template"
              displayImg = "/flyer.png"
            }

            setProduct({
              title: displayTitle,
              image: displayImg,
              price: ord.totalPrice,
              packageId: ord.packageId,
            })

            // If pending, go directly to pay screen
            if (ord.status === "pending") {
              setFlowState("pay")
            } else if (ord.status === "completed") {
              setFlowState("success")
            }
          } else {
            setFeedbackMessage({ type: "error", text: json.message || "Gagal memuat detail transaksi." })
          }
        })
        .catch(err => {
          console.error("Gagal memuat detail transaksi:", err)
          setFeedbackMessage({ type: "error", text: "Terjadi kesalahan koneksi saat memuat transaksi." })
        })
        .finally(() => setLoading(false))
      return
    }

    const pkg = searchParams.get("package") || "professional"
    const titleParam = searchParams.get("title")
    const imageParam = searchParams.get("image")
    const priceParam = searchParams.get("price")

    if (titleParam) {
      setProduct({
        title: titleParam,
        image: imageParam || "/feed arfan (20).png",
        price: priceParam ? parseInt(priceParam) : 10000,
        packageId: "custom_template",
      })

      fetch("/api/products")
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data)) {
            const dbProduct = json.data.find(
              (p: any) => p.title.toLowerCase() === titleParam.toLowerCase()
            )
            if (dbProduct) {
              setProduct({
                title: dbProduct.title,
                image: (dbProduct.image ? dbProduct.image.split("|")[0] : null) || imageParam || "/feed arfan (20).png",
                price: Number(dbProduct.price_discount) || 10000,
                packageId: "custom_template",
              })
            }
          }
        })
        .catch((err) => console.error("Error verifying payment price with DB:", err))
    } else {
      fetch("/api/website-settings")
        .then((res) => res.json())
        .then((data) => {
          let basicPrice = 15000;
          let professionalPrice = 20000;
          let enterprisePrice = 25000;

          if (data.success && data.data?.services) {
            const dbServices = data.data.services;
            const basicDb = dbServices.find((s: any) => s.id === "basic");
            const proDb = dbServices.find((s: any) => s.id === "professional");
            const entDb = dbServices.find((s: any) => s.id === "enterprise");

            if (basicDb) basicPrice = basicDb.price;
            if (proDb) professionalPrice = proDb.price;
            if (entDb) enterprisePrice = entDb.price;
          }

          const packagePrices: { [key: string]: number } = {
            basic: basicPrice,
            professional: professionalPrice,
            enterprise: enterprisePrice,
          };
          const selectedPkg = pkg.toLowerCase()
          setProduct({
            title: selectedPkg === "basic" ? "Basic Pack - Template" : selectedPkg === "enterprise" ? "Enterprise Bundle - Template" : "Professional Pack - Template",
            image: selectedPkg === "basic" ? "/promosi.png" : selectedPkg === "enterprise" ? "/flyer.png" : "/feed arfan (20).png",
            price: packagePrices[selectedPkg] || 20000,
            packageId: selectedPkg,
          })
        })
        .catch((err) => {
          console.error("Error fetching pricing settings in payment page:", err);
          const packagePrices: { [key: string]: number } = {
            basic: 15000,
            professional: 20000,
            enterprise: 25000,
          };
          const selectedPkg = pkg.toLowerCase()
          setProduct({
            title: selectedPkg === "basic" ? "Basic Pack - Template" : selectedPkg === "enterprise" ? "Enterprise Bundle - Template" : "Professional Pack - Template",
            image: selectedPkg === "basic" ? "/promosi.png" : selectedPkg === "enterprise" ? "/flyer.png" : "/feed arfan (20).png",
            price: packagePrices[selectedPkg] || 20000,
            packageId: selectedPkg,
          })
        })
    }
  }, [searchParams])

  // Count down timer logic
  useEffect(() => {
    if (flowState !== "pay" || timeLeft <= 0) return
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [flowState, timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price)
  }

  // Step 1: Submit Form to calculate nominal and generate FNT transaction
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedbackMessage(null)

    if (!buyerInfo.email || !buyerInfo.phone) {
      setFeedbackMessage({ type: "error", text: "Harap lengkapi Email dan No. WhatsApp Anda." })
      return
    }
    if (!agreeTerms) {
      setFeedbackMessage({ type: "error", text: "Anda harus menyetujui Ketentuan Layanan." })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: buyerInfo.name || buyerInfo.email.split("@")[0], // Fallback if name is empty
          email: buyerInfo.email,
          phone: buyerInfo.phone,
          packageId: product.packageId,
          title: product.title,
        }),
      })
      const result = await response.json()
      
      if (result.success) {
        setTransaction({
          orderNumber: result.order.orderNumber,
          totalPrice: result.order.totalPrice,
        })

        // Save pending order to local storage for guest session tracking
        try {
          const pending = JSON.parse(localStorage.getItem("pendingOrders") || "[]")
          if (!pending.includes(result.order.orderNumber)) {
            pending.push(result.order.orderNumber)
            localStorage.setItem("pendingOrders", JSON.stringify(pending))
          }
          // Remove this product from local cart since it's now a transaction
          const cart = JSON.parse(localStorage.getItem("cart") || "[]")
          const updatedCart = cart.filter((item: any) => item.title !== product.title)
          localStorage.setItem("cart", JSON.stringify(updatedCart))
          
          window.dispatchEvent(new Event("cart-updated"))
        } catch (err) {
          console.error(err)
        }

        setFlowState("pay")
        setTimeLeft(600) // Reset to 10 minutes
        setFeedbackMessage({ type: "success", text: "ID Transaksi dan nominal unik berhasil di-generate!" })
      } else {
        setFeedbackMessage({ type: "error", text: result.message || "Gagal memproses transaksi." })
      }
    } catch (err) {
      setFeedbackMessage({ type: "error", text: "Kesalahan jaringan. Silakan coba lagi." })
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Request Payment Verification
  const handleConfirmPayment = async () => {
    setConfirming(true)
    setFeedbackMessage(null)
    try {
      const response = await fetch("/api/payment/confirm-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber: transaction.orderNumber }),
      })
      const result = await response.json()

      if (result.success) {
        setFlowState("success")
      } else {
        setFeedbackMessage({ type: "error", text: result.message || "Gagal mengirim permintaan konfirmasi." })
      }
    } catch (err) {
      setFeedbackMessage({ type: "error", text: "Terjadi kesalahan jaringan. Silakan hubungi admin." })
    } finally {
      setConfirming(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(transaction.totalPrice.toString())
    setCopied(true)
    setFeedbackMessage({ type: "success", text: "Nominal unik berhasil disalin!" })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative min-h-screen bg-[#FAF9F6] dark:bg-slate-950 pt-6 pb-32 text-slate-800 dark:text-slate-100 flex flex-col items-center font-sans selection:bg-orange-500/20 selection:text-orange-500">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.015)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0"></div>
      
      <div className="max-w-5xl w-full px-6 relative z-10">
        {/* Back navigation header */}
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-base font-bold text-slate-600 dark:text-slate-400 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            <span>Kembali</span>
          </Link>
          <h1 className="text-xl font-extrabold text-slate-855 dark:text-white uppercase tracking-tight flex items-center gap-2">
            Checkout <ShieldCheck size={22} className="text-orange-500" />
          </h1>
          <div className="w-24 hidden sm:block"></div>
        </div>

        {/* Inline Feedback Message — replaces toast */}
        {feedbackMessage && (
          <div className={`mb-8 p-4 sm:p-5 rounded-2xl flex items-center gap-3 text-sm sm:text-base font-semibold animate-in fade-in slide-in-from-top-2 duration-300 ${
            feedbackMessage.type === "success" 
              ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 text-green-700 dark:text-green-400"
              : "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400"
          }`}>
            {feedbackMessage.type === "success" 
              ? <CheckCircle size={20} className="shrink-0" />
              : <AlertCircle size={20} className="shrink-0" />
            }
            {feedbackMessage.text}
          </div>
        )}
 
        {flowState === "success" ? (
          /* ================= SUCCESS SCREEN ================= */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-855 p-6 sm:p-10 md:p-14 text-center max-w-xl mx-auto flex flex-col items-center space-y-6 sm:space-y-8"
          >
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-orange-50 dark:bg-orange-950/20 text-orange-500 border border-orange-100 dark:border-orange-900/35 flex items-center justify-center rounded-2xl sm:rounded-[2rem] shadow-sm">
              <CheckCircle size={32} className="sm:w-12 sm:h-12" strokeWidth={2.5} />
            </div>
 
            <div className="space-y-2">
              <h2 className="text-xl sm:text-3xl font-black uppercase tracking-tight text-slate-800 dark:text-white">Konfirmasi Terkirim!</h2>
              <p className="text-xs sm:text-base text-slate-550 dark:text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                Pembayaran Anda sedang <strong>diverifikasi secara otomatis</strong> oleh sistem kami.
              </p>
            </div>
 
            <div className="bg-slate-50 dark:bg-slate-950 p-5 sm:p-7 border border-slate-200/60 dark:border-slate-900 rounded-xl sm:rounded-2xl w-full text-left space-y-4 sm:space-y-5">
              <div className="flex items-start gap-3 sm:gap-4">
                <Mail size={20} className="text-orange-500 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm sm:text-base font-bold text-slate-880 dark:text-slate-200">Menunggu Verifikasi Mutasi</p>
                  <p className="text-xs sm:text-base text-slate-550 dark:text-slate-400 font-medium mt-1 leading-normal">Tautan template akan dikirimkan ke email <span className="text-orange-500 font-extrabold break-all">{buyerInfo.email}</span> setelah transfer masuk terdeteksi di mutasi GoPay kami (1-3 menit).</p>
                </div>
              </div>
              <div className="text-[11px] sm:text-sm text-slate-555 leading-normal font-semibold border-t border-slate-200 dark:border-slate-850 pt-3 sm:pt-4">
                📢 Pastikan nominal transfer pas hingga 2 digit terakhir. Butuh verifikasi cepat? Hubungi WhatsApp admin di +62 851-3373-7623.
              </div>
            </div>
 
            <div className="w-full pt-2">
              <Link
                href="/"
                className="w-full flex items-center justify-center py-4 sm:py-5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg shadow-orange-500/25 active:scale-95 transition-all duration-300"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </motion.div>
        ) : (
          /* ================= TWO-COLUMN CHECKOUT LAYOUT ================= */
          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-start">
                    {/* LEFT COLUMN: PRODUCT & BUYER INFO */}
            <div className="space-y-6 sm:space-y-8">
              
              {/* Product summary card */}
              <div className="space-y-3">
                <h3 className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Product</h3>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] shadow-sm flex items-center gap-3 sm:gap-5">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 dark:bg-slate-955 rounded-xl sm:rounded-2xl border border-slate-150 dark:border-slate-800 overflow-hidden relative shrink-0">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm sm:text-lg font-extrabold text-slate-800 dark:text-white truncate">{product.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-400 font-bold uppercase tracking-wider mt-0.5 sm:mt-1">Quantity: 1x</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm sm:text-lg font-extrabold text-slate-900 dark:text-white">Rp {formatPrice(product.price)}</span>
                  </div>
                </div>
              </div>

              {/* Buyer info form card */}
              <div className="space-y-3">
                <h3 className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Buyer Info</h3>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] shadow-sm space-y-4 sm:space-y-5">
                  {/* Name Input */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center gap-1 pl-1">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">Nama Lengkap</span>
                    </div>
                    <input
                      type="text"
                      disabled={flowState === "pay" || loading}
                      placeholder="Masukkan nama lengkap"
                      value={buyerInfo.name}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })}
                      className="w-full px-4 py-3 sm:px-5 sm:py-4 text-sm sm:text-base bg-slate-55 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800/80 rounded-xl sm:rounded-2xl font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:focus:border-orange-500 disabled:opacity-60 transition-colors"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center gap-1 pl-1">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">Email</span>
                      <span className="text-rose-500 font-bold text-base">*</span>
                    </div>
                    <input
                      type="email"
                      required
                      disabled={flowState === "pay" || loading || !!session?.user?.email}
                      placeholder="contoh@email.com"
                      value={buyerInfo.email}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, email: e.target.value })}
                      className="w-full px-4 py-3 sm:px-5 sm:py-4 text-sm sm:text-base bg-slate-55 dark:bg-slate-955 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800/80 rounded-xl sm:rounded-2xl font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:focus:border-orange-500 disabled:opacity-60 transition-colors"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex items-center gap-1 pl-1">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">Nomor WhatsApp</span>
                      <span className="text-rose-500 font-bold text-base">*</span>
                    </div>
                    <input
                      type="tel"
                      required
                      disabled={flowState === "pay" || loading}
                      placeholder="08xxxxxx"
                      value={buyerInfo.phone}
                      onChange={(e) => setBuyerInfo({ ...buyerInfo, phone: e.target.value })}
                      className="w-full px-4 py-3 sm:px-5 sm:py-4 text-sm sm:text-base bg-slate-55 dark:bg-slate-955 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-800/80 rounded-xl sm:rounded-2xl font-medium focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 dark:focus:border-orange-500 disabled:opacity-60 transition-colors"
                    />
                  </div>

                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: PAYMENT DETAILS & ACTIONS */}
            <div className="space-y-6 sm:space-y-8">
              
              {/* Payment details card */}
              <div className="space-y-3">
                <h3 className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Payment Detail</h3>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] shadow-sm space-y-4 sm:space-y-5">
                  <div className="space-y-2.5 sm:space-y-3 text-xs sm:text-base">
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 font-medium">
                      <span>Subtotal</span>
                      <span>Rp {formatPrice(product.price)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 font-medium">
                      <span>Discount</span>
                      <span className="text-orange-500">- Rp 0</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 font-medium">
                      <span>Convenience fee</span>
                      <span>Rp 0</span>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100 dark:bg-slate-800 w-full" />
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs sm:text-base font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Total</span>
                    <span className="text-xl sm:text-3xl font-black text-orange-500">
                      Rp {formatPrice(flowState === "pay" ? transaction.totalPrice : product.price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Voucher Action Box */}
              {flowState === "input" && (
                <button className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-900 hover:bg-orange-50/20 text-orange-500 dark:text-orange-400 font-bold text-xs sm:text-sm uppercase tracking-wider border border-orange-500/30 hover:border-orange-500/60 rounded-xl sm:rounded-2xl transition-all">
                  <Tag size={16} /> Add Voucher
                </button>
              )}

              {/* Payment Method / QRIS display */}
              <div className="space-y-3">
                <h3 className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">Payment Method</h3>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-855 p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] shadow-sm space-y-5 sm:space-y-6">
                  
                  {flowState === "input" ? (
                    /* Initial payment method indicator */
                    <div className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 rounded-xl sm:rounded-2xl">
                      <div className="p-2 sm:p-3 bg-orange-50 dark:bg-orange-950/20 text-orange-500 rounded-lg sm:rounded-xl shrink-0">
                        <CreditCard size={18} className="sm:w-[22px] sm:h-[22px]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-base font-bold text-slate-800 dark:text-white">QRIS (Scan & Bayar Instan)</h4>
                        <p className="text-[10px] sm:text-sm text-slate-400 dark:text-slate-500 font-medium mt-0.5 sm:mt-1">Kode QR & nominal unik di backend</p>
                      </div>
                    </div>
                  ) : (
                    /* QRIS Code presentation */
                    <div className="flex flex-col items-center space-y-4 sm:space-y-5">
                      <div className="text-center space-y-1.5 sm:space-y-2">
                        <span className="text-[10px] sm:text-sm font-black bg-orange-100 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400 px-2.5 py-0.5 rounded uppercase tracking-wider">nominal unik</span>
                        <div className="flex items-center justify-center gap-2 sm:gap-3 mt-1.5 sm:mt-2">
                          <span className="text-lg sm:text-2xl font-black text-slate-800 dark:text-white">Rp {formatPrice(transaction.totalPrice)}</span>
                          <button
                            onClick={copyToClipboard}
                            className="p-1.5 sm:p-2 bg-slate-50 dark:bg-slate-855 hover:bg-orange-500/10 border border-slate-200 dark:border-slate-850 rounded-lg text-slate-500 dark:text-slate-400 hover:text-orange-500 transition-colors"
                            title="Salin nominal"
                          >
                            {copied ? <Check size={14} className="text-orange-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                        <p className="text-[10px] sm:text-sm font-extrabold text-orange-500 mt-1.5 uppercase">PENTING: Transfer pas sampai digit terakhir!</p>
                      </div>

                      {/* QRIS Image Box */}
                      <div className="relative p-3 bg-white border border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center shadow-inner">
                        <img src={`/api/payment/qris?amount=${transaction.totalPrice}`} alt="QRIS QR Code" className="w-full h-full object-contain" />
                        {timeLeft <= 0 && (
                          <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-xl sm:rounded-2xl flex flex-col items-center justify-center p-3 text-center">
                            <Clock className="w-6 h-6 text-rose-500 mb-1.5 animate-bounce" />
                            <p className="text-sm font-bold text-slate-800 dark:text-white">Waktu Habis</p>
                            <button onClick={() => setFlowState("input")} className="mt-2 px-3 py-1.5 bg-orange-500 text-white text-xs font-black rounded-lg uppercase">Ulangi</button>
                          </div>
                        )}
                      </div>

                      {/* Timer */}
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-base text-slate-550 dark:text-slate-400 font-semibold bg-slate-50 dark:bg-slate-950 px-4 py-2.5 rounded-xl sm:rounded-2xl border border-slate-150 dark:border-slate-855">
                        <Clock size={16} className="text-orange-500 shrink-0" />
                        Sisa Waktu: <span className="font-extrabold text-orange-500">{formatTime(timeLeft)}</span>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Consent checklist checkboxes */}
              {flowState === "input" && (
                <div className="space-y-3 px-2">
                  <div className="flex items-start gap-2.5 cursor-pointer select-none" onClick={() => setAgreeTerms(!agreeTerms)}>
                    <div className="mt-0.5 text-orange-500 shrink-0">
                      {agreeTerms ? <CheckSquare size={18} /> : <Square size={18} className="text-slate-350" />}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-normal">
                      I agree to the <span className="text-orange-500 underline font-extrabold">Terms of Use</span>
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5 cursor-pointer select-none" onClick={() => setAgreePromo(!agreePromo)}>
                    <div className="mt-0.5 text-orange-500 shrink-0">
                      {agreePromo ? <CheckSquare size={18} /> : <Square size={18} className="text-slate-350" />}
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-normal">
                      I agree that my email and phone number may be used to receive updates or marketing.
                    </span>
                  </div>
                </div>
              )}

              {/* Checkout CTA actions */}
              <div className="pt-1.5">
                {flowState === "input" ? (
                  <button
                    onClick={handleProceedToPayment}
                    disabled={loading || !buyerInfo.email || !buyerInfo.phone || !agreeTerms}
                    className="w-full flex items-center justify-center gap-2 py-4 sm:py-5 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:cursor-not-allowed text-white font-extrabold text-sm sm:text-base uppercase tracking-wider rounded-xl sm:rounded-2xl shadow-lg shadow-orange-500/25 transition-all duration-300 hover:scale-[1.01] active:scale-95"
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin shrink-0" /> Memproses...</>
                    ) : (
                      <>Buy Now — IDR {formatPrice(product.price)}</>
                    )}
                  </button>
                ) : (
                  <div className="space-y-2.5 sm:space-y-3">
                    <button
                      onClick={handleConfirmPayment}
                      disabled={confirming || timeLeft <= 0}
                      className="w-full flex items-center justify-center gap-2 py-4 sm:py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-sm sm:text-base uppercase tracking-wider rounded-xl sm:rounded-2xl hover:opacity-90 transition-all shadow-md active:scale-95"
                    >
                      {confirming ? (
                        <><Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin shrink-0" /> Memverifikasi...</>
                      ) : (
                        <>Saya Sudah Bayar</>
                      )}
                    </button>
                    <button
                      onClick={() => setFlowState("input")}
                      disabled={confirming}
                      className="w-full py-3.5 bg-transparent border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 font-bold text-xs uppercase rounded-xl sm:rounded-2xl transition-all"
                    >
                      Kembali ke Pengisian Data
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF9F6] dark:bg-slate-955 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
      </div>
    }>
      <PaymentContent />
    </Suspense>
  )
}
