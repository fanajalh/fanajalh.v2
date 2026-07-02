"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Flame, ShoppingBag } from "lucide-react"
import { headersConfig } from "@/components/sections/headersConfig"

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
}

interface Product {
  categoryId: string;
  title: string;
  image: string;
  description: string;
  priceOriginal: number;
  priceDiscount: number;
  popular?: boolean;
  stock?: number;
  itemsSold?: number;
}

interface DealsOfDayProps {
  dealsProducts: Product[];
  websiteSettings?: any;
}

export default function DealsOfDay({ dealsProducts, websiteSettings }: DealsOfDayProps) {
  const config = websiteSettings?.dealsOfDay || {}
  const badge = config.badge || headersConfig.dealsOfDay.badge
  const title = config.title || headersConfig.dealsOfDay.title

  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 space-y-10">
      
      {/* ================= HEADER SECTION ================= */}
      <div className="flex items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-orange-500">
            <Flame size={20} className="fill-orange-500 animate-pulse" />
            <span className="text-sm font-black uppercase tracking-[0.2em]">
              {badge}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {title}
          </h2>
        </div>
        <Link 
          href="#products" 
          className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-orange-500 transition-colors"
        >
          Selengkapnya <ArrowRight size={16} />
        </Link>
      </div>

      {/* ================= CAROUSEL / GRID LAYOUT ================= */}
      {dealsProducts.length > 0 ? (
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 md:gap-6 md:grid md:grid-cols-2 lg:grid-cols-4 pb-8 -mx-6 px-6 lg:mx-0 lg:px-0 scroll-smooth">
          {dealsProducts.map((service, index) => {
            const hasDiscount = service.priceOriginal > service.priceDiscount
            const discountPercentage = hasDiscount
              ? Math.round(((service.priceOriginal - service.priceDiscount) / service.priceOriginal) * 100)
              : 0
            const productSlug = slugify(service.title)
            
            // Dynamic items sold percentage
            const itemsSoldPercent = service.itemsSold !== undefined ? service.itemsSold : (index + 2) * 17
            
            // Dynamic stock status
            const stock = service.stock !== undefined ? service.stock : 10
            const isOutOfStock = stock === 0

            return (
              <Link
                key={index}
                href={`/product/${productSlug}`}
                className="group relative bg-white dark:bg-slate-900/50 p-4 transition-all duration-500 border border-slate-200 dark:border-slate-800 rounded-[2rem] hover:border-orange-500/30 shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 md:hover:-translate-y-2 flex flex-col shrink-0 snap-center w-[45vw] sm:w-[40vw] md:w-auto"
              >
                {/* Image Box */}
                <div className="relative aspect-square rounded-[1.5rem] overflow-hidden bg-slate-100 dark:bg-slate-950 mb-4">
                  <Image
                    src={service.image ? service.image.split("|")[0] : "/ucapan.png"}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {hasDiscount && !isOutOfStock && (
                    <div className="absolute top-3 left-3 z-10 bg-rose-600/90 backdrop-blur-sm text-white text-[11px] font-black px-3 py-1.5 rounded-lg shadow-lg">
                      HOT -{discountPercentage}%
                    </div>
                  )}
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-extrabold text-xs uppercase tracking-wider z-10">
                      Stok Habis
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="px-1 flex-1 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-orange-600 transition-colors">
                    {service.title}
                  </h3>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      Rp {new Intl.NumberFormat("id-ID").format(service.priceDiscount)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xs font-bold text-slate-400 line-through decoration-slate-400">
                        Rp {new Intl.NumberFormat("id-ID").format(service.priceOriginal)}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="pt-2 space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <span>Terjual {isOutOfStock ? 0 : itemsSoldPercent}%</span>
                      <span className={isOutOfStock ? "text-rose-650 font-extrabold" : "text-orange-600 dark:text-orange-400 font-extrabold"}>
                        {isOutOfStock ? "Habis" : stock <= 5 ? "Sisa Sedikit" : `Stok: ${stock}`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000" 
                        style={{ width: `${isOutOfStock ? 0 : itemsSoldPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-5">
                  <button 
                    disabled={isOutOfStock}
                    className={`w-full py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                      isOutOfStock
                        ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-650 cursor-not-allowed shadow-none"
                        : "bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-orange-600 hover:text-white active:scale-95 shadow-slate-900/10"
                    }`}
                  >
                    <ShoppingBag size={14} /> {isOutOfStock ? "Stok Habis" : "Beli Sekarang"}
                  </button>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-900/40 rounded-[2rem] border border-dashed border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="w-14 h-14 bg-orange-50 dark:bg-orange-500/5 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={24} />
          </div>
          <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">
            Belum Ada Penawaran
          </h4>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Semua produk Deals of the Day sedang kosong saat ini.
          </p>
        </div>
      )}
    </section>
  )
}