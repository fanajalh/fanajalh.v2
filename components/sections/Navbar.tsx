"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Search, LogOut, ShoppingCart, ShoppingBag, Loader2 } from "lucide-react"
import { useSession, signOut } from "next-auth/react"
import { headersConfig } from "@/components/sections/headersConfig"

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  websiteSettings?: any;
}

export default function Navbar({ searchQuery, setSearchQuery, websiteSettings }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { data: session, status } = useSession()

  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [pendingOrders, setPendingOrders] = useState<any[]>([])
  const [loadingPending, setLoadingPending] = useState(false)
  const [retrieveId, setRetrieveId] = useState("")

  const loadCartData = async () => {
    try {
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]")
      setCartItems(localCart)

      const localPending = JSON.parse(localStorage.getItem("pendingOrders") || "[]")
      const userEmail = session?.user?.email

      if (userEmail || localPending.length > 0) {
        setLoadingPending(true)
        const res = await fetch("/api/payment/pending-list", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userEmail || null,
            orderNumbers: localPending,
          })
        })
        const json = await res.json()
        if (json.success && Array.isArray(json.data)) {
          setPendingOrders(json.data)
        }
      } else {
        setPendingOrders([])
      }
    } catch (err) {
      console.error("Gagal memuat data keranjang/transaksi:", err)
    } finally {
      setLoadingPending(false)
    }
  }

  useEffect(() => {
    loadCartData()

    const handleCartUpdate = () => {
      loadCartData()
    }
    window.addEventListener("cart-updated", handleCartUpdate)
    return () => window.removeEventListener("cart-updated", handleCartUpdate)
  }, [session])

  const handleRemoveFromCart = (title: string) => {
    try {
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]")
      const updated = localCart.filter((item: any) => item.title !== title)
      localStorage.setItem("cart", JSON.stringify(updated))
      setCartItems(updated)
      window.dispatchEvent(new Event("cart-updated"))
    } catch (err) {
      console.error(err)
    }
  }

  const handleRetrieveOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!retrieveId.trim()) return

    const idToFind = retrieveId.trim().toUpperCase()
    try {
      const res = await fetch(`/api/payment/details?orderNumber=${idToFind}`)
      const json = await res.json()
      if (json.success && json.order) {
        // Add to local storage
        const localPending = JSON.parse(localStorage.getItem("pendingOrders") || "[]")
        if (!localPending.includes(idToFind)) {
          localPending.push(idToFind)
          localStorage.setItem("pendingOrders", JSON.stringify(localPending))
        }
        setRetrieveId("")
        loadCartData()
        
        // Show success alert
        import("sweetalert2").then((Swal) => {
          Swal.default.fire({
            icon: "success",
            title: "Pesanan Ditemukan",
            text: `Pesanan ${idToFind} berhasil ditambahkan ke riwayat keranjang Anda.`,
            showConfirmButton: false,
            timer: 1500,
            background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#ffffff",
            color: document.documentElement.classList.contains("dark") ? "#ffffff" : "#0f172a",
          })
        })
      } else {
        import("sweetalert2").then((Swal) => {
          Swal.default.fire({
            icon: "error",
            title: "Gagal",
            text: json.message || "Pesanan tidak ditemukan.",
            background: document.documentElement.classList.contains("dark") ? "#1e293b" : "#ffffff",
            color: document.documentElement.classList.contains("dark") ? "#ffffff" : "#0f172a",
          })
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  const pendingTransactions = pendingOrders.filter((o: any) => o.status === "pending")
  const waitingTransactions = pendingOrders.filter((o: any) => o.status === "waiting_verification")
  const successTransactions = pendingOrders.filter((o: any) => o.status === "completed" || o.status === "in_progress")

  const cartCount = cartItems.length + pendingTransactions.length + waitingTransactions.length + successTransactions.length

  const siteName = websiteSettings?.siteName || headersConfig.brand.name

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [menuOpen])

  return (
    <>
      <nav className={`fixed left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] lg:w-[calc(100%-4rem)] max-w-[1400px] transition-all duration-300 ${
        scrolled ? "top-4" : "top-6"
      }`}>
      
      {/* ================= NAVBAR UTAMA (MENGAMBANG) ================= */}
      <div className={`transition-all duration-300 rounded-[1.5rem] px-5 lg:px-8 ${
        scrolled || searchOpen || menuOpen
          ? "bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl"
          : "bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 shadow-sm"
      }`}>
        <div className="flex items-center justify-between h-[72px] gap-8">
          
          {/* KIRI: LOGO */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3" onClick={() => { setMenuOpen(false); setSearchOpen(false); }}>
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0">
                <img 
                  src={headersConfig.brand.logoUrl} 
                  alt="Logo" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {siteName}
              </span>
            </Link>
          </div>

          {/* TENGAH: MENU NAVIGASI */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-8">
            {headersConfig.navbar.navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-[15px] font-semibold text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* KANAN: ACTIONS */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Search Toggle Button */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className={`hidden lg:flex p-2.5 rounded-xl transition-colors ${
                searchOpen 
                  ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600" 
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            {/* Cart Icon Button (Desktop) */}
            <button 
              onClick={() => setCartOpen(true)}
              className="hidden lg:flex relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Keranjang Belanja"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-[10px] font-extrabold animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            <div className="hidden lg:block w-[1px] h-5 bg-slate-200 dark:bg-slate-800 mx-1" />
            
            {/* Auth Buttons */}
            {status === "authenticated" ? (
              <div className="hidden lg:flex items-center gap-4 ml-2">
                <span className="text-[15px] font-semibold text-slate-700 dark:text-slate-200">
                  {session?.user?.name?.split(' ')[0] || "User"}
                </span>
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link 
                href="/loginUser?mode=login"
                className="hidden lg:flex ml-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[15px] font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                Login / Daftar
              </Link>
            )}

            {/* Mobile Cart Button */}
            <button 
              onClick={() => setCartOpen(true)}
              className="lg:hidden relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
              title="Keranjang Belanja"
            >
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white rounded-full flex items-center justify-center text-[10px] font-extrabold animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => { setMenuOpen(!menuOpen); setSearchOpen(false); }}
              className="lg:hidden ml-1 p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP SEARCH (TERPISAH MENGAMBANG) ================= */}
      {searchOpen && (
        <div className="hidden lg:block absolute top-[calc(100%+16px)] left-1/2 -translate-x-1/2 w-full max-w-2xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-2xl rounded-2xl p-2 animate-in fade-in zoom-in-95 duration-300">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              autoFocus
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik untuk mencari template poster, dll..." 
              className="w-full h-14 pl-12 pr-12 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 text-[15px] text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all outline-none"
            />
            <button 
              onClick={() => setSearchQuery("")} 
              className={`absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-opacity ${searchQuery ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ================= MOBILE MENU (TERPISAH MENGAMBANG) ================= */}
      {menuOpen && (
        <div className="lg:hidden absolute top-[calc(100%+12px)] left-0 w-full border border-slate-200/80 dark:border-slate-800 rounded-[1.5rem] bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-5 py-6 space-y-6 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300 max-h-[80vh] overflow-y-auto">
          
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari template..." 
              className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 focus:border-orange-500 text-[15px] outline-none"
            />
          </div>

          <div className="flex flex-col space-y-2">
            {headersConfig.navbar.navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-[15px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
            {status === "authenticated" ? (
              <div className="flex items-center justify-between px-4">
                <span className="text-[15px] font-semibold text-slate-900 dark:text-white">
                  {session?.user?.name || "User"}
                </span>
                <button 
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 text-[15px] font-semibold text-rose-600"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/loginUser?mode=login" 
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center px-4 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[15px] font-bold rounded-xl"
              >
                Login / Daftar
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>

    {/* ================= CART SLIDE-OVER DRAWER ================= */}
    {cartOpen && (
      <div className="fixed inset-0 z-[150] overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
        <div className="absolute inset-0 overflow-hidden">
          {/* Overlay */}
          <div 
            onClick={() => setCartOpen(false)}
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-500" 
          />

          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md transform transition-all duration-500 ease-in-out">
              <div className="flex h-full flex-col bg-white dark:bg-slate-950 shadow-2xl border-l border-slate-200 dark:border-slate-800 overflow-hidden">
                
                {/* Drawer Header */}
                <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
                  <h2 className="text-lg font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                    <ShoppingCart className="text-orange-500" />
                    Keranjang Belanja
                  </h2>
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Drawer Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 no-scrollbar">
                  
                  {/* SECTION 1: Items to Buy (Draft) */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Item Di Keranjang ({cartItems.length})
                    </h3>
                    
                    {cartItems.length === 0 ? (
                      <p className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl text-center">
                        Tidak ada item di keranjang.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {cartItems.map((item, idx) => (
                          <div key={idx} className="flex gap-4 p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl relative overflow-hidden group">
                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shrink-0 bg-white">
                              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1 flex flex-col justify-center">
                              <h4 className="text-xs font-bold text-slate-955 dark:text-white truncate">{item.title}</h4>
                              <p className="text-xs font-black text-orange-500 mt-1">
                                Rp {new Intl.NumberFormat("id-ID").format(item.price)}
                              </p>
                            </div>
                            <div className="flex flex-col justify-between items-end gap-2">
                              <button 
                                onClick={() => handleRemoveFromCart(item.title)}
                                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                                title="Hapus"
                              >
                                <X size={14} strokeWidth={2.5} />
                              </button>
                              <Link
                                href={`/payment?package=custom_template&title=${encodeURIComponent(item.title)}&image=${encodeURIComponent(item.image)}&price=${item.price}`}
                                onClick={() => setCartOpen(false)}
                                className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm transition-all"
                              >
                                Bayar
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SECTION 2: Pending Payments (Belum Bayar) */}
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-900">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      Belum Bayar ({pendingTransactions.length})
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    </h3>

                    {loadingPending ? (
                      <div className="flex items-center justify-center py-4 gap-2">
                        <Loader2 size={14} className="animate-spin text-orange-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Memuat...</span>
                      </div>
                    ) : pendingTransactions.length === 0 ? (
                      <p className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl text-center">
                        Tidak ada transaksi tertunda.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {pendingTransactions.map((ord, idx) => (
                          <div key={idx} className="p-4 bg-amber-500/5 border border-amber-200/40 dark:border-amber-900/20 rounded-2xl flex flex-col gap-2.5 relative">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md">
                                  {ord.order_number}
                                </span>
                                <h4 className="text-xs font-bold text-slate-950 dark:text-white mt-1.5 leading-snug">
                                  {ord.title || (ord.package === "basic" ? "Basic Pack - Template" : ord.package === "professional" ? "Professional Pack - Template" : "Enterprise Bundle - Template")}
                                </h4>
                              </div>
                              <span className="text-[11px] font-black text-amber-600 tracking-wider text-right whitespace-nowrap shrink-0">
                                Rp {new Intl.NumberFormat("id-ID").format(ord.total_price)}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-center mt-1 pt-2 border-t border-amber-500/10">
                              <span className="text-[9px] font-bold text-slate-400">
                                {new Date(ord.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).replace(".", ":")}
                              </span>
                              <Link
                                href={`/payment?orderNumber=${ord.order_number}`}
                                onClick={() => setCartOpen(false)}
                                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-sm hover:shadow-lg transition-all"
                              >
                                Bayar Sekarang
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SECTION 3: Waiting Verification */}
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-900">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      Menunggu Verifikasi ({waitingTransactions.length})
                      <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                    </h3>

                    {loadingPending ? null : waitingTransactions.length === 0 ? (
                      <p className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl text-center">
                        Tidak ada transaksi menunggu verifikasi.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {waitingTransactions.map((ord, idx) => (
                          <div key={idx} className="p-4 bg-yellow-500/5 border border-yellow-250/30 dark:border-yellow-900/10 rounded-2xl flex flex-col gap-2 relative">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="text-[9px] font-black uppercase tracking-wider bg-yellow-500/10 text-yellow-600 px-2 py-0.5 rounded-md">
                                  {ord.order_number}
                                </span>
                                <h4 className="text-xs font-bold text-slate-955 dark:text-white mt-1.5 leading-snug">
                                  {ord.title || (ord.package === "basic" ? "Basic Pack - Template" : ord.package === "professional" ? "Professional Pack - Template" : "Enterprise Bundle - Template")}
                                </h4>
                              </div>
                              <span className="text-[11px] font-black text-yellow-650 tracking-wider text-right whitespace-nowrap shrink-0">
                                Rp {new Intl.NumberFormat("id-ID").format(ord.total_price)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-1 pt-2 border-t border-yellow-500/10">
                              <span className="text-[9px] font-bold text-slate-400">
                                {new Date(ord.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).replace(".", ":")}
                              </span>
                              <span className="text-[9px] font-bold text-yellow-600 bg-yellow-500/10 px-2 py-1 rounded">
                                Sedang Diverifikasi
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* SECTION 4: Completed/Success Transactions */}
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-900">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                      Transaksi Sukses ({successTransactions.length})
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </h3>

                    {loadingPending ? null : successTransactions.length === 0 ? (
                      <p className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl text-center">
                        Tidak ada transaksi sukses.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {successTransactions.map((ord, idx) => (
                          <div key={idx} className="p-4 bg-emerald-500/5 border border-emerald-200/40 dark:border-emerald-900/20 rounded-2xl flex flex-col gap-2 relative">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-md">
                                  {ord.order_number}
                                </span>
                                <h4 className="text-xs font-bold text-slate-950 dark:text-white mt-1.5 leading-snug">
                                  {ord.title || (ord.package === "basic" ? "Basic Pack - Template" : ord.package === "professional" ? "Professional Pack - Template" : "Enterprise Bundle - Template")}
                                </h4>
                              </div>
                              <span className="text-[11px] font-black text-emerald-650 tracking-wider text-right whitespace-nowrap shrink-0">
                                Rp {new Intl.NumberFormat("id-ID").format(ord.total_price)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center mt-1 pt-2 border-t border-emerald-500/10">
                              <span className="text-[9px] font-bold text-slate-400">
                                {new Date(ord.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).replace(".", ":")}
                              </span>
                              <span className="text-[9px] font-black text-emerald-650 bg-emerald-500/10 px-2 py-1 rounded">
                                Lunas / Selesai
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Retrieve Order Form */}
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-900 pb-2">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Punya ID Pesanan Lain?
                    </h3>
                    <form onSubmit={handleRetrieveOrder} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Masukkan ID Pesanan (FNT-...)" 
                        value={retrieveId}
                        onChange={(e) => setRetrieveId(e.target.value)}
                        className="flex-1 h-10 px-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-orange-500 transition-all uppercase"
                      />
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-wider rounded-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-95"
                      >
                        Cari
                      </button>
                    </form>
                  </div>

                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    )}
  </>
  )
}