"use client"

import { useState, useEffect } from "react"
import {
  Palette, RefreshCw, LogOut, WifiOff, AlertCircle,
  BarChart3, FileText, MessageSquare, TrendingUp,
  Globe, CreditCard, Settings, Newspaper, X, LayoutGrid, Crown, Images, Image as ImageIcon, Code,
} from "lucide-react"
import Swal from "sweetalert2"

import {
  TabOverview, TabOrders, TabSuggestions, TabAnalytics,
  TabWebsite, TabPricing, TabSettings, TabContent, TabPremium, TabPhotoboothFrames,
  OrderDetailModal, EditOrderModal, SuggestionModal,
  TabPortfolioDesigns, TabPortfolioDev,
  GRADIENT_ORANGE, DEFAULT_SETTINGS,
  type Order, type Analytics, type WebsiteSettings, type Suggestion,
} from "@/components/dashboard"

const TAB_ICONS: Record<string, any> = {
  overview: BarChart3, orders: FileText, content: Newspaper, suggestions: MessageSquare,
  analytics: TrendingUp, website: Globe, pricing: CreditCard, settings: Settings, premium: Crown,
  frames: Images, portfolio_designs: ImageIcon, portfolio_dev: Code,
}

const TABS = [
  { id: "overview", label: "Ringkasan", color: "blue" },
  { id: "orders", label: "Pesanan", color: "orange" },
  { id: "content", label: "Konten", color: "rose" },
  { id: "frames", label: "Frame", color: "pink" },
  { id: "portfolio_designs", label: "Porto Desain", color: "indigo" },
  { id: "portfolio_dev", label: "Porto Dev", color: "blue" },
  { id: "premium", label: "Premium", color: "yellow" },
  { id: "suggestions", label: "Saran", color: "amber" },
  { id: "analytics", label: "Analitik", color: "emerald" },
  { id: "website", label: "Website", color: "indigo" },
  { id: "pricing", label: "Harga", color: "purple" },
  { id: "settings", label: "Sistem", color: "slate" },
]

export default function Dashboard() {
  // --- STATES ---
  const [orders, setOrders] = useState<Order[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(DEFAULT_SETTINGS)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])

  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [isMenuOpen, setIsMenuOpen] = useState(false) // State untuk Menu Mengambang
  const [connectionStatus, setConnectionStatus] = useState<"connected" | "mock" | "error">("connected")
  const [error, setError] = useState("")
  const [loggingOut, setLoggingOut] = useState(false)
  const [editingSettings, setEditingSettings] = useState(false)

  // Modal States
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null)
  const [suggestionResponse, setSuggestionResponse] = useState("")

  // --- EFFECTS ---
  useEffect(() => {
    fetchOrders()
    fetchAnalytics()
    fetchSuggestions()
    loadWebsiteSettings()
  }, [])

  // --- API FUNCTIONS ---
  const handleLogout = async () => {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      const { signOut } = await import("next-auth/react")
      await signOut({ callbackUrl: "/login" })
    } catch { window.location.href = "/login" }
    finally { setLoggingOut(false) }
  }

  const fetchOrders = async () => {
    try {
      setError("")
      const response = await fetch("/api/orders", { cache: "no-store" })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const data = await response.json()
      if (data.success) {
        setOrders(data.orders)
        setConnectionStatus(data.message?.includes("mock") ? "mock" : "connected")
      } else throw new Error(data.message)
    } catch (error) {
      setConnectionStatus("error")
      setError(error instanceof Error ? error.message : "Unknown error")
    } finally { setLoading(false) }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics", { cache: "no-store" })
      if (!response.ok) return
      const data = await response.json()
      if (data.success) setAnalytics(data.analytics)
    } catch (error) { console.error(error) }
  }

  const fetchSuggestions = async () => {
    try {
      const res = await fetch("/api/suggestions", { cache: "no-store" })
      const json = await res.json()
      setSuggestions(json.data || [])
    } catch { setSuggestions([]) }
  }

  const loadWebsiteSettings = async () => {
    const saved = localStorage.getItem("websiteSettings")
    if (saved) setWebsiteSettings(JSON.parse(saved))
    try {
      const res = await fetch("/api/website-settings")
      const json = await res.json()
      if (json.success && json.data) {
        setWebsiteSettings(json.data)
        localStorage.setItem("websiteSettings", JSON.stringify(json.data))
      }
    } catch (err) {
      console.error("Failed to load settings from DB", err)
    }
  }

  const saveWebsiteSettings = async () => {
    try {
      const res = await fetch("/api/website-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(websiteSettings),
      })
      const json = await res.json()
      if (json.success) {
        localStorage.setItem("websiteSettings", JSON.stringify(websiteSettings))
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Pengaturan berhasil disimpan!', timer: 1500, showConfirmButton: false })
        setEditingSettings(false)
      } else {
        throw new Error(json.message)
      }
    } catch (err: any) {
      Swal.fire({ icon: 'error', text: err.message || 'Gagal menyimpan pengaturan' })
    }
  }

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (response.ok) {
        fetchOrders(); fetchAnalytics(); setEditingOrder(null)
        Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Order updated successfully!', timer: 1500, showConfirmButton: false })
      }
    } catch { Swal.fire({ icon: 'error', text: 'Failed to update order' }) }
  }

  const deleteOrder = async (orderId: string) => {
    const result = await Swal.fire({ title: 'Hapus Pesanan?', text: "Pesanan yang dihapus tidak bisa dikembalikan.", icon: 'warning', showCancelButton: true, confirmButtonText: 'Ya, Hapus!' })
    if (!result.isConfirmed) return
    try {
      const response = await fetch(`/api/orders/${orderId}`, { method: "DELETE" })
      if (response.ok) { fetchOrders(); fetchAnalytics() }
    } catch { Swal.fire({ icon: 'error', text: 'Failed to delete order' }) }
  }

  const duplicateOrder = async (order: Order) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact: { name: order.name, email: order.email, phone: order.phone, company: order.company },
          service: order.service, package: order.package,
          details: { title: order.title, description: order.description, dimensions: order.dimensions, colors: order.colors, deadline: order.deadline, additionalInfo: order.additional_info },
        }),
      })
      if (response.ok) { fetchOrders(); Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Order duplicated!', timer: 1500, showConfirmButton: false }) }
    } catch { Swal.fire({ icon: 'error', text: 'Failed to duplicate' }) }
  }

  const handleBulkAction = async (action: string, ids: string[]) => {
    const result = await Swal.fire({ title: 'Konfirmasi', text: `Apply ${action} to ${ids.length} selected orders?`, icon: 'warning', showCancelButton: true, confirmButtonText: 'Lanjutkan' })
    if (!result.isConfirmed) return
    try {
      const promises = ids.map((orderId) => {
        if (action === "delete") return fetch(`/api/orders/${orderId}`, { method: "DELETE" })
        return fetch(`/api/orders/${orderId}`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: action }),
        })
      })
      await Promise.all(promises)
      fetchOrders(); fetchAnalytics()
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Bulk action completed!', timer: 1500, showConfirmButton: false })
    } catch { Swal.fire({ icon: 'error', text: 'Bulk action failed' }) }
  }

  const exportOrders = async () => {
    try {
      const response = await fetch("/api/orders/export")
      if (!response.ok) { Swal.fire({ icon: 'warning', text: 'Export not available' }); return }
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url; a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a); a.click()
      window.URL.revokeObjectURL(url); document.body.removeChild(a)
    } catch { Swal.fire({ icon: 'error', text: 'Failed to export data' }) }
  }

  const sendWhatsAppMessage = (phone: string, orderNumber: string) => {
    const message = `Halo! Update mengenai pesanan Anda ${orderNumber}. Silakan hubungi kami untuk info lebih lanjut.`
    window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`, "_blank")
  }

  const handleSuggestionSubmit = async () => {
    if (!selectedSuggestion) return
    try {
      const res = await fetch(`/api/admin/suggestions/${selectedSuggestion.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: suggestionResponse, status: "reviewed" }),
      })
      if (res.ok) { setSelectedSuggestion(null); fetchSuggestions() }
      else Swal.fire({ icon: 'error', text: 'Gagal menyimpan' })
    } catch { Swal.fire({ icon: 'error', text: 'Error jaringan' }) }
  }

  // --- COMPUTED ---
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    in_progress: orders.filter((o) => o.status === "in_progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  }

  // Active Tab Info
  const currentTabInfo = TABS.find(t => t.id === activeTab) || TABS[0]

  // --- LOADING STATE ---
  if (loading) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin mb-4" />
      <p className="font-bold text-gray-400 animate-pulse tracking-widest uppercase text-xs">Loading Dashboard</p>
    </div>
  )

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 text-black pb-24 select-none">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-[40] bg-white border-b-4 border-black py-4 px-4 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black border-2 border-black rounded-none flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0 transform -rotate-3 overflow-hidden">
              <img src="/feed arfan (20).png" alt="AllFanajalh Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-widest uppercase text-black leading-none">JokiPoster <span className="text-orange-500 underline decoration-black decoration-4 underline-offset-4">Admin</span></h1>
              <div className="flex items-center gap-2 mt-2">
                {connectionStatus === "connected" ? (
                  <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-black bg-white px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div className="w-2 h-2 bg-emerald-500 border border-black animate-pulse" /> Live
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-black bg-white px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <WifiOff size={12} strokeWidth={3} /> Demo
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { fetchOrders(); fetchAnalytics() }} className="p-2.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all active:scale-95" title="Refresh Data">
              <RefreshCw size={20} strokeWidth={3} className="text-black" />
            </button>
            <div className="h-8 w-1 bg-black mx-1 hidden sm:block" />
            <button onClick={handleLogout} disabled={loggingOut} className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase tracking-widest hover:bg-black hover:text-white hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all active:scale-95 disabled:opacity-50">
              <LogOut size={18} strokeWidth={3} /> <span className="text-xs">{loggingOut ? "KELUAR..." : "LOGOUT"}</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700">
            <AlertCircle size={20} />
            <div><p className="font-bold text-sm">Connection Error</p><p className="text-xs">{error}</p></div>
          </div>
        )}

        {/* Dynamic Title based on Active Tab */}
        <div className="mb-8 border-l-8 border-black pl-4">
          <h2 className="text-3xl font-black text-black uppercase tracking-widest">{currentTabInfo.label}</h2>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Kelola data {currentTabInfo.label}</p>
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in duration-300">
          {activeTab === "overview" && <TabOverview stats={stats} analytics={analytics} orders={orders} setActiveTab={setActiveTab} />}
          {activeTab === "orders" && (
            <TabOrders orders={orders} onViewOrder={setSelectedOrder} onEditOrder={setEditingOrder}
              onDuplicateOrder={duplicateOrder} onDeleteOrder={deleteOrder}
              onSendWhatsApp={sendWhatsAppMessage} onExportOrders={exportOrders}
              onBulkAction={handleBulkAction} />
          )}
          {activeTab === "suggestions" && (
            <TabSuggestions suggestions={suggestions} onRefresh={fetchSuggestions}
              onViewSuggestion={(s) => { setSelectedSuggestion(s); setSuggestionResponse(s.response || "") }} />
          )}
          {activeTab === "analytics" && analytics && <TabAnalytics analytics={analytics} />}
          {activeTab === "website" && <TabWebsite settings={websiteSettings} setSettings={setWebsiteSettings} editing={editingSettings} setEditing={setEditingSettings} onSave={saveWebsiteSettings} />}
          {activeTab === "pricing" && <TabPricing settings={websiteSettings} setSettings={setWebsiteSettings} editing={editingSettings} setEditing={setEditingSettings} onSave={saveWebsiteSettings} />}
          {activeTab === "content" && <TabContent />}
          {activeTab === "frames" && <TabPhotoboothFrames />}
          {activeTab === "portfolio_designs" && <TabPortfolioDesigns />}
          {activeTab === "portfolio_dev" && <TabPortfolioDev />}
          {activeTab === "premium" && <TabPremium />}
          {activeTab === "settings" && <TabSettings connectionStatus={connectionStatus} />}
        </div>
      </main>

      {/* ==================== SINGLE FLOATING ACTION BUTTON ==================== */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="flex items-center gap-3 bg-white text-black border-4 border-black px-6 py-4 rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all outline-none group"
        >
          <LayoutGrid size={24} strokeWidth={3} className="text-black group-hover:text-white transition-colors" />
          <span className="font-black text-sm uppercase tracking-widest">Menu Navigasi</span>
        </button>
      </div>

      {/* ==================== FLOATING OVERLAY MENU (BENTO GRID) ==================== */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border-4 border-black p-6 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] w-full max-w-[500px] animate-in zoom-in-95 duration-200 relative overflow-hidden rounded-none">
            
            <div className="flex justify-between items-start mb-8 relative z-10 border-b-4 border-black pb-4">
              <div>
                <h2 className="text-2xl font-black text-black uppercase tracking-widest">Pintas Admin</h2>
                <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1">Pilih modul yang ingin dikelola</p>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="bg-white text-black border-2 border-black hover:bg-black hover:text-white transition-all rounded-none p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] active:scale-95">
                <X size={24} strokeWidth={3} />
              </button>
            </div>
            
            {/* Grid Navigasi */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6 relative z-10">
              {TABS.map((tab) => {
                const Icon = TAB_ICONS[tab.id]
                const isActive = activeTab === tab.id
                return (
                  <button 
                    key={tab.id} 
                    onClick={() => { setActiveTab(tab.id); setIsMenuOpen(false); }} 
                    className={`group flex flex-col items-center gap-3 p-3 rounded-none transition-all outline-none border-2 border-black ${
                      isActive 
                        ? 'bg-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] translate-y-1' 
                        : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-50'
                    }`}
                  >
                    <div className={`flex items-center justify-center transition-colors ${
                      isActive ? 'text-white' : 'text-black'
                    }`}>
                      <Icon className="w-8 h-8" strokeWidth={isActive ? 3 : 2.5} />
                    </div>
                    <span className={`text-[9px] sm:text-[10px] font-black text-center uppercase tracking-widest ${isActive ? 'text-white' : 'text-black'}`}>
                      {tab.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Extra Action (Mobile Logout) */}
            <button onClick={handleLogout} className="sm:hidden w-full py-4 bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase tracking-widest text-[13px] active:scale-95 outline-none flex justify-center items-center gap-2 relative z-10 hover:bg-black hover:text-white transition-all hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mt-4">
              <LogOut size={18} strokeWidth={3} /> KELUAR DARI ADMIN
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedOrder && <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onEdit={setEditingOrder} onSendWhatsApp={sendWhatsAppMessage} />}
      {editingOrder && <EditOrderModal order={editingOrder} setOrder={setEditingOrder} onClose={() => setEditingOrder(null)} onSave={updateOrder} />}
      {selectedSuggestion && <SuggestionModal suggestion={selectedSuggestion} response={suggestionResponse} setResponse={setSuggestionResponse} onClose={() => setSelectedSuggestion(null)} onSubmit={handleSuggestionSubmit} />}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}