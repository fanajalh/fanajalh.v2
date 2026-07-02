"use client"

import Link from "next/link"
import Image from "next/image"
import { Layers, Code, ShoppingBag, ArrowRight } from "lucide-react"
import { headersConfig } from "@/components/sections/headersConfig"

// Helper: create slug from title
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

interface FeaturedProductsProps {
  filteredProducts: Product[];
  websiteSettings?: any;
}

export default function FeaturedProducts({ filteredProducts, websiteSettings }: FeaturedProductsProps) {
  const config = websiteSettings?.featuredProducts || {}
  const badge = config.badge || headersConfig.featuredProducts.badge
  const title = config.title || headersConfig.featuredProducts.title
  const subtitle = config.subtitle || headersConfig.featuredProducts.subtitle

  return (
    <section id="products" className="max-w-7xl mx-auto px-6 lg:px-8 py-10 space-y-10">
      
      {/* ================= HEADER SECTION ================= */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          {title}
        </h2>
        <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* ================= PRODUCTS GRID ================= */}
      {filteredProducts.length === 0 ? (
        
        /* --- EMPTY STATE --- */
        <div className="text-center py-24 border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 rounded-[2.5rem] flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <Layers className="text-slate-400 dark:text-slate-500" size={32} />
          </div>
          <h4 className="text-lg font-black text-slate-700 dark:text-slate-300 mb-2">Tidak ada template ditemukan</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Coba gunakan kata kunci pencarian atau pilih kategori lain.</p>
        </div>
        
      ) : (
        
        /* --- CARDS GRID (MARKETPLACE STYLE) --- */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 pb-8">
          {filteredProducts.slice(0, 4).map((service, index) => {
            const hasDiscount = service.priceOriginal > service.priceDiscount
            const discountPercentage = hasDiscount
              ? Math.round(((service.priceOriginal - service.priceDiscount) / service.priceOriginal) * 100)
              : 0
            const productSlug = slugify(service.title)

            return (
              <Link
                key={index}
                href={`/product/${productSlug}`}
                className="group relative bg-white dark:bg-slate-900 p-4 md:p-5 transition-all duration-500 ease-[0.21,0.47,0.32,0.98] border border-slate-200/80 dark:border-slate-800 rounded-[2rem] hover:border-orange-500/30 hover:shadow-[0_20px_40px_-15px_rgba(234,88,12,0.15)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] md:hover:-translate-y-2 flex flex-col justify-between w-full"
              >
                <div>
                  {/* Image Box */}
                  <div className="relative aspect-[4/5] rounded-[1.25rem] overflow-hidden bg-slate-100 dark:bg-slate-950 mb-6 border border-slate-100/50 dark:border-slate-800/40">
                    <Image
                      src={service.image ? service.image.split("|")[0] : "/ucapan.png"}
                      alt={service.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    
                    {/* Inner Shadow Overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Premium Discount Badge */}
                    {hasDiscount && (
                      <div className="absolute top-3 left-3 z-10 bg-rose-500/90 backdrop-blur-md border border-rose-400/50 text-white text-[10px] sm:text-xs font-black px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg shadow-lg shadow-rose-500/20">
                        -{discountPercentage}%
                      </div>
                    )}

                    {service.stock === 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-extrabold text-[10px] sm:text-xs uppercase tracking-wider z-10">
                        Habis
                      </div>
                    )}

                    {/* Technology Stamp: Canva / Source Code */}
                    <div className="absolute bottom-3 right-3 z-10 flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border border-white/50 dark:border-slate-700/50 text-orange-500">
                      {service.categoryId === "webcode" ? (
                        <Code size={16} strokeWidth={2.5} className="sm:w-[18px] sm:h-[18px]" />
                      ) : (
                        <span className="text-[8px] sm:text-[10px] font-black text-[#00c4cc] italic tracking-tight">Canva</span>
                      )}
                    </div>
                  </div>

                  {/* Header details */}
                  <div className="px-1 md:px-2 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] sm:text-[11px] font-black text-orange-500 uppercase tracking-[0.12em] sm:tracking-[0.15em] block truncate">
                        {service.categoryId === "webcode" ? "Web Code" : "Canva"}
                      </span>
                      <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider shrink-0 ${
                        service.stock === 0 ? "text-rose-600 font-extrabold" : (service.stock !== undefined && service.stock <= 5) ? "text-orange-500 font-extrabold" : "text-emerald-600 font-extrabold"
                      }`}>
                        {service.stock === 0 ? "Habis" : (service.stock !== undefined && service.stock <= 5) ? "Sisa Sedikit" : `Stok: ${service.stock ?? 10}`}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-lg lg:text-xl font-black text-slate-900 dark:text-white line-clamp-1 leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 font-medium leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Pricing & Buy block */}
                <div className="px-1 md:px-2 pt-4 sm:pt-6 pb-2 flex items-center sm:items-end justify-between gap-2 sm:gap-3 mt-3">
                  <div className="flex flex-col gap-0.5 sm:gap-1">
                    {hasDiscount && (
                      <span className="text-[10px] sm:text-xs font-bold text-slate-400 line-through decoration-slate-300 dark:decoration-slate-600">
                        Rp {new Intl.NumberFormat("id-ID").format(service.priceOriginal)}
                      </span>
                    )}
                    <span className="text-sm sm:text-lg md:text-xl lg:text-2xl font-black text-slate-900 dark:text-white leading-none">
                      Rp {new Intl.NumberFormat("id-ID").format(service.priceDiscount)}
                    </span>
                  </div>
                  
                  {/* Action Button */}
                  <div className="w-8 h-8 sm:w-12 sm:h-12 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 group-hover:bg-gradient-to-r group-hover:from-[#ff7a00] group-hover:to-[#ea580c] group-hover:text-white rounded-lg sm:rounded-[1rem] shadow-sm group-hover:shadow-lg group-hover:shadow-orange-500/25 flex items-center justify-center transition-all duration-300 transform group-hover:rotate-[-5deg] shrink-0">
                    <ArrowRight size={16} strokeWidth={2.5} className="sm:w-5 sm:h-5 group-hover:-rotate-45 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* ================= SEE MORE BUTTON ================= */}
      {filteredProducts.length > 4 && (
        <div className="text-center pt-2">
          <Link
            href="/poster-portfolio"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold uppercase tracking-wider text-xs rounded-xl shadow-md transition-all hover:scale-105 active:scale-95"
          >
            <ShoppingBag size={14} />
            Lihat Semua Produk
          </Link>
        </div>
      )}
    </section>
  )
}