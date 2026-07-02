"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowLeft, Code, Check, ShoppingBag, ChevronRight } from "lucide-react"

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
        <nav className="flex items-center gap-2 text-sm font-medium text-slate-400">
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/#products" className="hover:text-orange-500 transition-colors">Katalog</Link>
          <ChevronRight size={14} />
          <span className="text-slate-700 dark:text-slate-300 font-bold truncate max-w-[200px]">{product.title}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          
          {/* LEFT: Product Image */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 p-5 md:p-6 border border-slate-100 dark:border-slate-850 rounded-[2rem] shadow-sm flex flex-col gap-4">
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <img
                  src={product.image ? product.image.split("|")[activeImageIndex] : "/ucapan.png"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Discount badge */}
                {hasDiscount && (
                  <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-base font-extrabold px-4 py-1.5 rounded-xl shadow-md">
                    -{discountPercentage}% OFF
                  </div>
                )}

                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-extrabold text-xs uppercase tracking-wider z-10">
                    Stok Habis
                  </div>
                )}

                {/* Stamp overlay */}
                <div className="absolute bottom-4 right-4 z-10 w-14 h-14 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-lg">
                  {product.categoryId === "webcode" ? (
                    <Code size={22} className="text-orange-500" />
                  ) : (
                    <span className="text-sm font-black text-[#00c4cc] italic">Canva</span>
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
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
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
            <div className="bg-white dark:bg-slate-900 p-7 md:p-8 border border-slate-100 dark:border-slate-850 rounded-[2rem] shadow-sm space-y-5">
              <span className="text-sm font-extrabold text-orange-500 uppercase tracking-wider block">
                {product.categoryId === "webcode" ? "Source Code" : "Template Canva"} — Katalog Resmi
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {product.title}
              </h1>
              <div className="flex items-baseline gap-4">
                <span className="text-3xl md:text-4xl font-black text-orange-500">
                  Rp {new Intl.NumberFormat("id-ID").format(product.priceDiscount)}
                </span>
                {hasDiscount && (
                  <span className="text-lg font-semibold text-slate-400 line-through">
                    Rp {new Intl.NumberFormat("id-ID").format(product.priceOriginal)}
                  </span>
                )}
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white dark:bg-slate-900 p-7 md:p-8 border border-slate-100 dark:border-slate-850 rounded-[2rem] shadow-sm space-y-5">
              <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Deskripsi Item</h3>
              <div className="text-base font-medium text-slate-600 dark:text-slate-350 leading-relaxed space-y-4">
                <p className="text-slate-800 dark:text-white uppercase font-black text-lg">SPESIFIKASI DAN KELENGKAPAN:</p>
                <p className="whitespace-pre-wrap">
                  {product.descriptionFull || product.description}
                </p>
                
                {/* Features checklist */}
                {product.features && (
                  <div className="pt-3 space-y-3">
                    {product.features.map((feature: string, fIdx: number) => (
                      <div key={fIdx} className="flex items-center gap-3 text-slate-800 dark:text-white text-base font-bold">
                        <div className="w-6 h-6 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center shrink-0">
                          <Check size={14} strokeWidth={3} />
                        </div>
                        <span>{feature}</span>
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
                className="w-full flex items-center justify-center gap-3 py-5 bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 font-extrabold text-lg uppercase tracking-wider rounded-2xl cursor-not-allowed"
              >
                <ShoppingBag size={22} />
                Stok Habis
              </button>
            ) : (
              <Link
                href={`/payment?package=custom_template&title=${encodeURIComponent(product.title)}&image=${encodeURIComponent(product.image ? product.image.split("|")[0] : "/ucapan.png")}&price=${product.priceDiscount}`}
                className="w-full flex items-center justify-center gap-3 py-5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-lg uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/15 active:scale-95 transition-all duration-300"
              >
                <ShoppingBag size={22} />
                Beli Sekarang — Rp {new Intl.NumberFormat("id-ID").format(product.priceDiscount)}
              </Link>
            )}

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 text-sm text-slate-400 dark:text-slate-500 font-semibold">
              <div className="flex items-center gap-1.5">
                <Check size={16} className="text-green-500" />
                <span>Akses Instan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check size={16} className="text-green-500" />
                <span>Editable</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check size={16} className="text-green-500" />
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