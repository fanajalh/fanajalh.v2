"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MobileHeader } from "@/components/MobileHeader"
import {
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Zap,
  Clock,
  Package,
  Loader2,
  MessageCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

type ProductDetail = {
  id: string
  category: string
  name: string
  type: string
  price: number
  popular: boolean
  duration: string
  stock: number
  categoryName: string
  categoryIcon: string
}

import { useSession } from "next-auth/react"

export default function PremiumProductDetail({
  params,
}: {
  params: { id: string }
}) {
  const { data: session, status: sessionStatus } = useSession()
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [accessDenied, setAccessDenied] = useState(false)
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [wa, setWa] = useState("")
  const [ordering, setOrdering] = useState(false)
  const [orderError, setOrderError] = useState<string | null>(null)
  const router = useRouter()

  // --- ACCESS CHECK ---
  useEffect(() => {
    async function checkAccess() {
      try {
        const res = await fetch(`/api/website-settings?t=${Date.now()}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache, no-store, must-revalidate", "Pragma": "no-cache" }
        })
        const json = await res.json()
        if (json.success && json.data) {
          const isOpen = json.data.premiumPageOpen === true
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

  // --- DATA FETCH: hanya jalan jika access granted ---
  useEffect(() => {
    if (checkingAccess || accessDenied) return

    const abortController = new AbortController()

    async function fetchProduct() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/premium/${params.id}`, {
          signal: abortController.signal,
        })

        if (!res.ok) {
          const json = await res.json()
          throw new Error(json.message || "Produk tidak ditemukan")
        }

        const json = await res.json()
        if (json.success && json.data) {
          setProduct(json.data)
        } else {
          throw new Error(json.message || "Data tidak valid")
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch product:", err)
          setError(err.message || "Terjadi kesalahan saat memuat data.")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
    return () => abortController.abort()
  }, [params.id, checkingAccess, accessDenied])

  const handleOrder = async () => {
    // Validasi nomor WA
    const waClean = wa.replace(/\D/g, "")
    if (!waClean || waClean.length < 10) {
      setOrderError("Masukkan nomor WhatsApp yang valid (minimal 10 digit)")
      return
    }

    setOrdering(true)
    setOrderError(null)

    try {
      const res = await fetch("/api/premium/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: params.id, wa: waClean }),
      })

      const json = await res.json()

      if (json.success && json.orderToken) {
        // Redirect ke halaman checkout dengan order token
        router.push(`/checkout/${json.orderToken}`)
      } else {
        setOrderError(json.message || "Gagal membuat pesanan")
      }
    } catch {
      setOrderError("Error jaringan. Silakan coba lagi.")
    } finally {
      setOrdering(false)
    }
  }

  // ===== HEADER =====
  const StickyHeader = () => (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 flex justify-center shadow-sm">
      <div className="w-full max-w-2xl">
        <MobileHeader title="Detail Produk" />
      </div>
    </div>
  )

  // ===== LOADING / SESSION CHECK =====
  if (sessionStatus === "loading" || checkingAccess) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen pb-24 font-sans select-none">
        <StickyHeader />
        <div className="w-full max-w-2xl mx-auto px-5 mt-6 space-y-6 animate-pulse">
          <div className="bg-slate-200 rounded-3xl h-48 w-full" />
          <div className="bg-slate-200 rounded-2xl h-6 w-3/4" />
          <div className="bg-slate-200 rounded-2xl h-4 w-1/2" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-200 rounded-xl h-14 w-full" />
            ))}
          </div>
          <div className="bg-slate-200 rounded-2xl h-14 w-full" />
        </div>
      </div>
    )
  }

  // ===== ACCESS DENIED — hard block =====
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
            Layanan Premium saat ini sedang ditutup sementara waktu. Hubungi admin untuk info kuota pengerjaan.
          </p>
          <Link href="/" className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-300">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-widest">Kembali</span>
          </Link>
        </div>
      </div>
    )
  }

  // ===== LOADING DATA =====
  if (loading) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen pb-24 font-sans select-none">
        <StickyHeader />
        <div className="w-full max-w-2xl mx-auto px-5 mt-6 space-y-6 animate-pulse">
          <div className="bg-slate-200 rounded-3xl h-48 w-full" />
          <div className="bg-slate-200 rounded-2xl h-6 w-3/4" />
          <div className="bg-slate-200 rounded-2xl h-4 w-1/2" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-200 rounded-xl h-14 w-full" />
            ))}
          </div>
          <div className="bg-slate-200 rounded-2xl h-14 w-full" />
        </div>
      </div>
    )
  }

  // ===== ERROR =====
  if (error || !product) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen flex flex-col items-center justify-center p-5">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-800 mb-2">
          Produk Tidak Ditemukan
        </h2>
        <p className="text-slate-500 text-center mb-6">
          {error || "Produk yang kamu cari tidak tersedia."}
        </p>
        <button
          onClick={() => router.push("/premium")}
          className="px-6 py-3 bg-slate-900 text-white rounded-full font-bold"
        >
          Kembali ke Katalog
        </button>
      </div>
    )
  }

  const isOutOfStock = product.stock === 0

  // ===== MAIN =====
  return (
    <div className="bg-[#FAFAFA] min-h-screen pb-32 font-sans select-none overflow-x-hidden">
      <StickyHeader />

      <div className="w-full max-w-2xl mx-auto px-5 mt-6">
        {/* ===== HERO BANNER ===== */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-7 mb-6 relative overflow-hidden shadow-xl">
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -ml-8 -mb-8" />

          <div className="relative z-10">
            {/* Category badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full mb-4 backdrop-blur-sm border border-white/10">
              <span className="text-sm">{product.categoryIcon}</span>
              <span className="text-[11px] font-bold text-white/80 uppercase tracking-widest">
                {product.categoryName}
              </span>
            </div>

            {/* Product name */}
            <h1 className="text-2xl font-black text-white leading-tight mb-2">
              {product.name}
            </h1>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white/70">
                <Package size={12} /> {product.type}
              </span>
              {product.duration && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white/70">
                  <Clock size={12} /> {product.duration}
                </span>
              )}
              {product.popular && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-orange-500/80 to-red-500/80 rounded-full text-xs font-bold text-white">
                  <Sparkles size={12} /> POPULER
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mt-5 pt-5 border-t border-white/10">
              <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">
                Harga
              </p>
              <p className="text-3xl font-black text-white">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

        {/* ===== KEUNGGULAN ===== */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { icon: Zap, label: "Instan", desc: "Kirim cepat" },
            { icon: ShieldCheck, label: "Aman", desc: "Garansi resmi" },
            { icon: MessageCircle, label: "Support", desc: "Via WhatsApp" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-4 text-center border border-slate-100 shadow-sm"
            >
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                <item.icon size={18} className="text-orange-500" />
              </div>
              <p className="text-xs font-black text-slate-700">{item.label}</p>
              <p className="text-[10px] text-slate-400 font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ===== STOK INFO ===== */}
        <div
          className={`rounded-2xl p-4 mb-6 flex items-center gap-3 ${
            isOutOfStock
              ? "bg-red-50 border border-red-100"
              : "bg-emerald-50 border border-emerald-100"
          }`}
        >
          {isOutOfStock ? (
            <>
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <div>
                <p className="font-bold text-red-700 text-sm">Stok Habis</p>
                <p className="text-xs text-red-500">
                  Produk ini sedang tidak tersedia. Silakan cek kembali nanti.
                </p>
              </div>
            </>
          ) : (
            <>
              <CheckCircle2
                size={20}
                className="text-emerald-500 flex-shrink-0"
              />
              <div>
                <p className="font-bold text-emerald-700 text-sm">
                  Stok Tersedia
                </p>
                <p className="text-xs text-emerald-500">
                  Sisa {product.stock} akun siap kirim
                </p>
              </div>
            </>
          )}
        </div>

        {/* ===== FORM ORDER ===== */}
        {!isOutOfStock && (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm mb-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-1">
              Beli Sekarang
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Masukkan nomor WhatsApp aktif untuk menerima detail akun
            </p>

            {/* WhatsApp Input */}
            <div className="relative mb-4">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm select-none">
                +62
              </div>
              <input
                type="tel"
                value={wa}
                onChange={(e) => {
                  setWa(e.target.value)
                  setOrderError(null)
                }}
                placeholder="812xxxxxxxx"
                className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all font-medium text-slate-900 placeholder:text-slate-300 outline-none text-lg"
                maxLength={15}
              />
            </div>

            {/* Error message */}
            {orderError && (
              <div className="bg-red-50 text-red-600 text-xs font-medium rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                <AlertCircle size={14} />
                {orderError}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleOrder}
              disabled={ordering || !wa.trim()}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black text-base rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
            >
              {ordering ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Zap size={18} />
                  Pesan Sekarang — Rp{" "}
                  {product.price.toLocaleString("id-ID")}
                </>
              )}
            </button>

            {/* Info */}
            <p className="text-[10px] text-slate-400 text-center mt-3">
              Dengan memesan, kamu setuju dengan syarat & ketentuan kami.
            </p>
          </div>
        )}

        {/* ===== HOW IT WORKS ===== */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-5">
            Cara Kerja
          </h3>
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Pilih & Pesan",
                desc: "Pilih produk dan masukkan nomor WhatsApp kamu",
              },
              {
                step: "2",
                title: "Bayar via QRIS",
                desc: "Scan QRIS untuk pembayaran instan dan aman",
              },
              {
                step: "3",
                title: "Terima Akun",
                desc: "Detail akun akan dikirim langsung ke WhatsApp kamu",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-black text-orange-600">
                    {item.step}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">
                    {item.title}
                  </p>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
