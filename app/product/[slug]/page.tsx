"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowLeft, Code, Check, ShoppingBag, ChevronRight, ShoppingCart } from "lucide-react"

export default function ProductDetailPage() {
  const params = useParams()
  const slugParam = params?.slug as string
  const [dbServices, setDbServices] = useState<any[]>([])
  const [dbProducts, setDbProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    // Fetch website settings for static fallback logic
    fetch("/api/website-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.services) {
          setDbServices(data.data.services)
        }
      })
      .catch((err) => console.error("Error fetching settings in product page:", err))

    // Fetch dynamic products from DB
    fetch("/api/products")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          // Map dynamic db products
          const mapped = json.data.map((p: any) => {
            let parsedFeatures = p.features;
            if (typeof parsedFeatures === "string") {
              try {
                parsedFeatures = JSON.parse(parsedFeatures);
              } catch {
                parsedFeatures = [];
              }
            }
            return {
              id: p.id,
              title: p.title,
              description: p.description || "",
              descriptionFull: p.description_full || "",
              features: Array.isArray(parsedFeatures) ? parsedFeatures : [],
              priceOriginal: Number(p.price_original) || 0,
              priceDiscount: Number(p.price_discount) || 0,
              image: p.image || "/ucapan.png",
              popular: p.popular === true,
              categoryId: p.category_id,
              active: p.active !== false,
              stock: p.stock !== undefined ? Number(p.stock) : 10,
              itemsSold: p.items_sold !== undefined ? Number(p.items_sold) : 0
            };
          });
          setDbProducts(mapped)
        }
      })
      .catch((err) => console.error("Error fetching products in product page:", err))
      .finally(() => setLoading(false))
  }, [])
  
  // Resolve product
  const getProduct = () => {
    // Check in dynamic db products
    if (dbProducts.length > 0) {
      const match = dbProducts.find((p) => {
        const pSlug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
        return pSlug === slugParam
      })
      if (match) return match
    }
    return null
  }

  const product = getProduct()

  const handleAddToCart = () => {
    if (!product) return
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      // Check if already in cart
      const exists = cart.some((item: any) => item.title === product.title)
      if (!exists) {
        cart.push({
          title: product.title,
          image: (product.image ? product.image.split("|")[0] : null) || "/ucapan.png",
          price: product.priceDiscount,
        })
        localStorage.setItem("cart", JSON.stringify(cart))
      }
      // Dispatch custom event to notify Navbar
      window.dispatchEvent(new Event("cart-updated"))
      // Show SweetAlert
      import("sweetalert2").then((Swal) => {
        Swal.default.fire({
          icon: "success",
          title: "Berhasil",
          text: `"${product.title}" berhasil ditambahkan ke keranjang!`,
          showConfirmButton: false,
          timer: 1500,
          background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#ffffff",
          color: document.documentElement.classList.contains("dark") ? "#ffffff" : "#0f172a",
        })
      })
    } catch (err) {
      console.error("Gagal menambahkan ke keranjang:", err)
    }
  }

  // Loading view while fetching dynamic catalog
  if (loading && !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] dark:bg-slate-950 text-slate-600 px-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin mx-auto" />
          <p className="font-bold text-slate-400 animate-pulse uppercase tracking-wider text-xs">Memuat detail produk...</p>
        </div>
      </div>
    );
  }

  if (!product || product.active === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F6] dark:bg-slate-950 text-slate-600 px-6">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center">
            <ShoppingBag size={32} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Produk tidak ditemukan</h2>
          <p className="text-base text-slate-500 dark:text-slate-400 font-medium">Template yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-orange-500/15 transition-all hover:scale-105 active:scale-95"
          >
            <ArrowLeft size={20} />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  const hasDiscount = product.priceOriginal > product.priceDiscount
  const discountPercentage = hasDiscount
    ? Math.round(((product.priceOriginal - product.priceDiscount) / product.priceOriginal) * 100)
    : 0

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans selection:bg-orange-500/25 selection:text-orange-500">
      
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-base font-bold text-slate-600 dark:text-slate-400 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            <span>Kembali</span>
          </Link>
          <span className="text-sm font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Detail Template</span>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        <nav className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-slate-400">
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <ChevronRight size={14} className="shrink-0" />
          <Link href="/#products" className="hover:text-orange-500 transition-colors">Katalog</Link>
          <ChevronRight size={14} className="shrink-0" />
          <span className="text-slate-700 dark:text-slate-300 font-bold truncate max-w-[150px] sm:max-w-[200px]">{product.title}</span>
        </nav>
      </div>
 
      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          
          {/* LEFT: Product Image */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 border border-slate-100 dark:border-slate-850 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm flex flex-col gap-4">
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <img
                  src={product.image ? product.image.split("|")[activeImageIndex] : "/ucapan.png"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Discount badge */}
                {hasDiscount && (
                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 bg-red-500 text-white text-xs sm:text-base font-extrabold px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl shadow-md">
                    -{discountPercentage}% OFF
                  </div>
                )}
 
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-extrabold text-xs uppercase tracking-wider z-10">
                    Stok Habis
                  </div>
                )}
 
                {/* Stamp overlay */}
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-lg text-orange-500">
                  {product.categoryId === "webcode" ? (
                    <Code size={18} className="sm:w-[22px] sm:h-[22px]" />
                  ) : (
                    <span className="text-xs sm:text-sm font-black text-[#00c4cc] italic">Canva</span>
                  )}
                </div>
              </div>
 
              {/* Thumbnails row if there are multiple images */}
              {product.image && product.image.split("|").filter(Boolean).length > 1 && (
                <div className="flex flex-wrap gap-2 w-full justify-center">
                  {product.image.split("|").filter(Boolean).map((imgUrl: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-11 h-11 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx
                          ? "border-orange-500 scale-105 shadow-md shadow-orange-500/10"
                          : "border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imgUrl} alt={`thumbnail-${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
 
          {/* RIGHT: Product Details */}
          <div className="space-y-6">
            
            {/* Title & Price Card */}
            <div className="bg-white dark:bg-slate-900 p-5 sm:p-8 border border-slate-100 dark:border-slate-850 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm space-y-4">
              <span className="text-xs sm:text-sm font-extrabold text-orange-500 uppercase tracking-wider block">
                {product.categoryId === "webcode" ? "Source Code" : "Template Canva"} — Katalog Resmi
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {product.title}
              </h1>
              <div className="flex items-baseline gap-3 sm:gap-4">
                <span className="text-2xl sm:text-3xl md:text-4xl font-black text-orange-500">
                  Rp {new Intl.NumberFormat("id-ID").format(product.priceDiscount)}
                </span>
                {hasDiscount && (
                  <span className="text-sm sm:text-lg font-semibold text-slate-400 line-through">
                    Rp {new Intl.NumberFormat("id-ID").format(product.priceOriginal)}
                  </span>
                )}
              </div>
            </div>
 
            {/* Description Card */}
            <div className="bg-white dark:bg-slate-900 p-5 sm:p-8 border border-slate-100 dark:border-slate-850 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm space-y-4">
              <h3 className="text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Deskripsi Item</h3>
              <div className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-350 leading-relaxed space-y-4">
                <p className="text-slate-800 dark:text-white uppercase font-black text-base sm:text-lg">SPESIFIKASI DAN KELENGKAPAN:</p>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {product.descriptionFull || product.description}
                </p>
                
                {/* Features checklist */}
                {product.features && (
                  <div className="pt-2 space-y-2.5 sm:space-y-3">
                    {product.features.map((feature: string, fIdx: number) => (
                      <div key={fIdx} className="flex items-start gap-2.5 sm:gap-3 text-slate-800 dark:text-white text-sm sm:text-base font-bold">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={12} strokeWidth={3} className="sm:w-3.5 sm:h-3.5" />
                        </div>
                        <span className="leading-snug">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
 
             {/* CTA — Direct to Payment, NO POPUP */}
             {product.stock === 0 ? (
               <button
                 disabled
                 className="w-full flex items-center justify-center gap-2.5 py-4 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 font-extrabold text-base uppercase tracking-wider rounded-2xl cursor-not-allowed"
               >
                 <ShoppingBag size={20} />
                 Stok Habis
               </button>
             ) : (
               <div className="flex flex-col sm:flex-row gap-3">
                 <Link
                   href={`/payment?package=custom_template&title=${encodeURIComponent(product.title)}&image=${encodeURIComponent(product.image ? product.image.split("|")[0] : "/ucapan.png")}&price=${product.priceDiscount}`}
                   className="flex-1 flex items-center justify-center gap-2 py-4 sm:py-5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-base uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/15 active:scale-95 transition-all duration-300"
                 >
                   <ShoppingBag size={20} />
                   Beli Sekarang — Rp {new Intl.NumberFormat("id-ID").format(product.priceDiscount)}
                 </Link>
                 <button
                   onClick={handleAddToCart}
                   className="px-6 py-4 sm:py-5 bg-orange-50 hover:bg-orange-100 dark:bg-orange-500/10 dark:hover:bg-orange-500/20 text-orange-500 font-extrabold text-base uppercase tracking-wider rounded-2xl border border-orange-200 dark:border-orange-500/30 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2"
                 >
                   <ShoppingCart size={20} />
                   <span>Keranjang</span>
                 </button>
               </div>
             )}
 
            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-400 dark:text-slate-500 font-semibold pt-1">
              <div className="flex items-center gap-1.5 shrink-0">
                <Check size={14} className="text-green-500" />
                <span>Akses Instan</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Check size={14} className="text-green-500" />
                <span>Editable</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Check size={14} className="text-green-500" />
                <span>Support 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer credit */}
      <div className="text-center py-10 border-t border-slate-100 dark:border-slate-900">
        <p className="text-sm font-bold tracking-widest text-slate-400 dark:text-slate-600 uppercase">
          Fanajalah — Template Premium
        </p>
      </div>
    </div>
  )
}