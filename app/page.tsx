"use client"

import { useState, useEffect } from "react"
import { services } from "@/components/ServicesAndPricing/data"

// Section Components
import Navbar from "@/components/sections/Navbar"
import Hero from "@/components/sections/Hero"
import FeaturedCategories from "@/components/sections/FeaturedCategories"
import PromoBanners from "@/components/sections/PromoBanners"
import FeaturedProducts from "@/components/sections/FeaturedProducts"
import CountdownBanner from "@/components/sections/CountdownBanner"
import DealsOfDay from "@/components/sections/DealsOfDay"
import PhotoboothSection from "@/components/sections/PhotoboothSection"
import DownloadApkSection from "@/components/sections/DownloadApkSection"
import BeritaSection from "@/components/sections/BeritaSection"
import Contact from "@/components/sections/Contact"
import Footer from "@/components/sections/Footer"

export default function LandingPage() {
  const [websiteSettings, setWebsiteSettings] = useState<any>(null)
  const [orderPageOpen, setOrderPageOpen] = useState(true)
  const [activeCategory, setActiveCategory] = useState("poster")
  const [searchQuery, setSearchQuery] = useState("")
  const [dbProducts, setDbProducts] = useState<any[] | null>(null)

  // Retrieve setting parameter
  useEffect(() => {
    fetch("/api/website-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setWebsiteSettings(data.data)
          setOrderPageOpen(data.data.orderPageOpen !== false)
          if (data.data.siteName) {
            document.title = `${data.data.siteName} — ${data.data.tagline || "Template Premium"}`
          }
        } else {
          // Fallback to default setting structure if API returns error
          setWebsiteSettings({
            orderPageOpen: true,
            premiumPageOpen: true,
            services: []
          })
        }
      })
      .catch((err) => {
        console.error("Error fetching settings in page.tsx:", err)
        // Fallback to default settings if API call fails completely
        setWebsiteSettings({
          orderPageOpen: true,
          premiumPageOpen: true,
          services: []
        })
      })

    // Fetch dynamic products from db
    fetch("/api/products")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setDbProducts(json.data)
        } else {
          setDbProducts([]) // Set to empty array to resolve loading screen
        }
      })
      .catch((err) => {
        console.error("Error fetching products in page.tsx:", err)
        setDbProducts([]) // Set to empty array to resolve loading screen
      })
  }, [])

  // Merge static services with dynamic settings from DB
  const getDynamicServices = () => {
    const dbServices = websiteSettings?.services || []
    const merged = { ...services }
    
    Object.keys(merged).forEach((catId) => {
      const key = catId as keyof typeof services
      merged[key] = (services[key] as any[])
        .map((item) => {
          const itemKey = item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          const dbItem = dbServices.find((db: any) => 
            db.id === itemKey || 
            db.name.toLowerCase() === item.title.toLowerCase() ||
            db.id === item.title.toLowerCase().replace(/\s+/g, '-')
          );
          
          if (dbItem) {
            return {
              ...item,
              priceDiscount: dbItem.price,
              priceOriginal: Math.round(dbItem.price * 1.5),
              active: dbItem.active !== false,
              customStatus: dbItem.customStatus || undefined
            };
          }
          return { ...item, active: true };
        })
        .filter((item) => item.active !== false);
    });
    
    return merged;
  }

  const activeServices = getDynamicServices()

  const getMappedDbProducts = () => {
    if (!dbProducts) return []
    return dbProducts.map((p) => {
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
  }

  const dbMapped = getMappedDbProducts()
  // Render products directly from the database (no static fallback)
  const allProducts = dbMapped

  // Filter products based on selected category & search input
  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = product.categoryId === activeCategory
    const matchesSearch = searchQuery.trim() === "" || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Selected popular products for "Deals of the Day"
  const dealsProducts = allProducts.filter(p => p.popular).slice(0, 4)

  if (!websiteSettings || dbProducts === null) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
          <div className="space-y-1">
            <h4 className="text-slate-900 font-extrabold text-sm uppercase tracking-widest animate-pulse">Menghubungkan Ke Server</h4>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Memuat Pengaturan Web...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 min-h-screen selection:bg-orange-500/25 selection:text-orange-500 font-sans">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} websiteSettings={websiteSettings} />

      <main className="space-y-24 pb-24">
        
        {/* ================= 1. HERO SECTION ================= */}
        <Hero orderPageOpen={orderPageOpen} websiteSettings={websiteSettings} />

        {/* ================= 2. FEATURED CATEGORIES SECTION ================= */}
        {websiteSettings?.featuredCategories?.isActive !== false && (
          <FeaturedCategories activeCategory={activeCategory} setActiveCategory={setActiveCategory} websiteSettings={websiteSettings} products={allProducts} />
        )}

        {/* ================= 3. HIGHLIGHT PROMO BANNERS ================= */}
        {websiteSettings?.promoBanners?.isActive !== false && (
          <PromoBanners setActiveCategory={setActiveCategory} websiteSettings={websiteSettings} />
        )}

        {/* ================= 4. FEATURED PRODUCTS GRID ================= */}
        {websiteSettings?.featuredProducts?.isActive !== false && (
          <FeaturedProducts filteredProducts={filteredProducts} websiteSettings={websiteSettings} />
        )}

        {/* ================= 5. SUMMER DISCOUNT COUNTDOWN BANNER ================= */}
        {websiteSettings?.countdownPromo?.isActive !== false && (
          <CountdownBanner websiteSettings={websiteSettings} />
        )}

        {/* ================= 6. DEALS OF THE DAY ================= */}
        {websiteSettings?.dealsOfDay?.isActive !== false && (
          <DealsOfDay dealsProducts={dealsProducts} websiteSettings={websiteSettings} />
        )}

        {/* ================= PHOTOBOOTH SECTION ================= */}
        <PhotoboothSection />

        {/* ================= 7. DOWNLOAD APK SECTION ================= */}
        <section id="download-apk" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DownloadApkSection />
        </section>

        {/* ================= 8. BERITA & UPDATE RILIS ================= */}
        <BeritaSection />

        {/* ================= 9. CONTACT & COLLABORATION ================= */}
        <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Contact orderPageOpen={orderPageOpen} websiteSettings={websiteSettings} />
        </section>

      </main>

      <Footer websiteSettings={websiteSettings} />

      {/* NO POPUPS — NO MODALS — NO FLOATING BUTTONS */}
    </div>
  )
}
