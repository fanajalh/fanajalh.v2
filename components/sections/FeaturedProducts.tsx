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
        
        /* --- CARDS CAROUSEL ON MOBILE, GRID ON DESKTOP --- */
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 md:gap-8 md:grid md:grid-cols-2 lg:grid-cols-3 pb-8 -mx-6 px-6 lg:mx-0 lg:px-0 scroll-smooth">
          {filteredProducts.map((service, index) => {
            const hasDiscount = service.priceOriginal > service.priceDiscount
            const discountPercentage = hasDiscount
              ? Math.round(((service.priceOriginal - service.priceDiscount) / service.priceOriginal) * 100)
              : 0
            const productSlug = slugify(service.title)

            return (
              <Link
                key={index}
                href={`/product/${productSlug}`}
                className="group relative bg-white dark:bg-slate-900 p-4 md:p-5 transition-all duration-500 ease-[0.21,0.47,0.32,0.98] border border-slate-200/80 dark:border-slate-800 rounded-[2rem] hover:border-orange-500/30 hover:shadow-[0_20px_40px_-15px_rgba(234,88,12,0.15)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] md:hover:-translate-y-2 flex flex-col justify-between shrink-0 snap-center w-[45vw] sm:w-[40vw] md:w-auto"
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
                      <div className="absolute top-3 left-3 z-10 bg-rose-500/90 backdrop-blur-md border border-rose-400/50 text-white text-xs font-black px-3 py-1.5 rounded-lg shadow-lg shadow-rose-500/20">
                        HEMAT {discountPercentage}%
                      </div>
                    )}

                    {service.stock === 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-extrabold text-xs uppercase tracking-wider z-10">
                        Stok Habis
                      </div>
                    )}

                    {/* Technology Stamp: Canva / Source Code */}
                    <div className="absolute bottom-3 right-3 z-10 flex items-center justify-center w-10 h-10 rounded-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border border-white/50 dark:border-slate-700/50 text-orange-500">
                      {service.categoryId === "webcode" ? (
                        <Code size={18} strokeWidth={2.5} />
                      ) : (
                        <span className="text-[10px] font-black text-[#00c4cc] italic tracking-tight">Canva</span>
                      )}
                    </div>
                  </div>

                  {/* Header details */}
                  <div className="px-2 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-orange-500 uppercase tracking-[0.15em] block">
                        {service.categoryId === "webcode" ? "Source Code" : "Template Canva"}
                      </span>
                      <span className={`text-[9px] font-black uppercase tracking-wider ${
                        service.stock === 0 ? "text-rose-600 font-extrabold" : (service.stock !== undefined && service.stock <= 5) ? "text-orange-500 font-extrabold" : "text-emerald-600 font-extrabold"
                      }`}>
                        {service.stock === 0 ? "Habis" : (service.stock !== undefined && service.stock <= 5) ? "Sisa Sedikit" : `Stok: ${service.stock ?? 10}`}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white line-clamp-1 leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 font-medium leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Pricing & Buy block */}
                <div className="px-2 pt-6 pb-2 flex items-end justify-between gap-3 mt-4">
                  <div className="flex flex-col gap-1">
                    {hasDiscount && (
                      <span className="text-xs font-bold text-slate-400 line-through decoration-slate-300 dark:decoration-slate-600">
                        Rp {new Intl.NumberFormat("id-ID").format(service.priceOriginal)}
                      </span>
                    )}
                    <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-none">
                      Rp {new Intl.NumberFormat("id-ID").format(service.priceDiscount)}
                    </span>
                  </div>
                  
                  {/* Action Button */}
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 group-hover:bg-gradient-to-r group-hover:from-[#ff7a00] group-hover:to-[#ea580c] group-hover:text-white rounded-[1rem] shadow-sm group-hover:shadow-lg group-hover:shadow-orange-500/25 flex items-center justify-center transition-all duration-300 transform group-hover:rotate-[-5deg]">
                    <ArrowRight size={20} strokeWidth={2.5} className="group-hover:-rotate-45 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}