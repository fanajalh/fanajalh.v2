"use client"
import { useState, useEffect } from "react"
import { Plus, X, Trash2, RefreshCw, Package, ShoppingCart, Loader2, CheckCircle, Clock, XCircle } from "lucide-react"
import Swal from "sweetalert2"

type StockItem = {
  id: number
  email: string
  password: string
  status: string
  buyer_wa: string | null
  order_token: string | null
  sold_at: string | null
  created_at: string
  product_name: string | null
  type: string | null
  duration: string | null
  app: string | null
}

type PremiumOrder = {
  id: number
  order_token: string
  buyer_wa: string
  total_price: number
  status: string
  created_at: string
  product_name: string | null
  type: string | null
  duration: string | null
  stock_email: string | null
}

export default function PremiumStockAdmin() {
  const [accounts, setAccounts] = useState<StockItem[]>([])
  const [orders, setOrders] = useState<PremiumOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<"stock" | "orders">("stock")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [newApp, setNewApp] = useState("Canva")
  const [newType, setNewType] = useState("Private")
  const [newDuration, setNewDuration] = useState("1 Bulan")
  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")

  // Fetch dari database
  const fetchStocks = async () => {
    try {
      const res = await fetch("/api/admin/premium")
      const json = await res.json()
      if (json.success) setAccounts(json.data || [])
    } catch { console.error("Failed to fetch stocks") }
  }

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/premium/orders")
      const json = await res.json()
      if (json.success) setOrders(json.data || [])
    } catch { console.error("Failed to fetch orders") }
  }

  useEffect(() => {
    Promise.all([fetchStocks(), fetchOrders()]).finally(() => setLoading(false))
  }, [])

  // Tambah stok ke database
  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail || !newPassword) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/premium", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ app: newApp, type: newType, duration: newDuration, email: newEmail, password: newPassword }),
      })
      const json = await res.json()
      if (json.success) {
        Swal.fire({ icon: "success", title: "Berhasil!", text: "Stok berhasil ditambahkan.", timer: 1500, showConfirmButton: false })
        setNewEmail(""); setNewPassword(""); setIsModalOpen(false)
        fetchStocks()
      } else {
        Swal.fire({ icon: "error", text: json.message || "Gagal menyimpan" })
      }
    } catch { Swal.fire({ icon: "error", text: "Error jaringan" }) }
    finally { setSaving(false) }
  }

  // Hapus stok
  const handleDeleteStock = async (stockId: number) => {
    const result = await Swal.fire({ title: "Hapus stok?", text: "Data ini akan hilang permanen.", icon: "warning", showCancelButton: true, confirmButtonText: "Hapus" })
    if (!result.isConfirmed) return
    try {
      const res = await fetch(`/api/admin/premium?id=${stockId}`, { method: "DELETE" })
      const json = await res.json()
      if (json.success) { fetchStocks(); Swal.fire({ icon: "success", title: "Dihapus!", timer: 1200, showConfirmButton: false }) }
    } catch { Swal.fire({ icon: "error", text: "Gagal menghapus" }) }
  }

  // Konfirmasi pembayaran pesanan -> assign stok
  const handleConfirmPayment = async (orderToken: string) => {
    const result = await Swal.fire({ title: "Konfirmasi Pembayaran?", text: "Stok akan otomatis dikirim ke pembeli.", icon: "question", showCancelButton: true, confirmButtonText: "Ya, Konfirmasi!" })
    if (!result.isConfirmed) return
    try {
      const res = await fetch("/api/admin/premium/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderToken, status: "paid" }),
      })
      const json = await res.json()
      if (json.success) {
        Swal.fire({ icon: "success", title: "Pembayaran Dikonfirmasi!", text: "Stok telah di-assign.", timer: 1500, showConfirmButton: false })
        fetchOrders(); fetchStocks()
      } else {
        Swal.fire({ icon: "error", text: json.message || "Gagal konfirmasi" })
      }
    } catch { Swal.fire({ icon: "error", text: "Error jaringan" }) }
  }

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      AVAILABLE: "bg-green-400 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
      SOLD: "bg-gray-200 text-gray-500 border-2 border-gray-400",
      RESERVED: "bg-yellow-400 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
      pending: "bg-yellow-400 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
      paid: "bg-green-400 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
      delivered: "bg-blue-400 text-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
      cancelled: "bg-red-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
    }
    return map[status] || "bg-gray-100 text-gray-500 border-2 border-gray-200"
  }

  // Computed stats
  const stockAvailable = accounts.filter(a => a.status === "AVAILABLE").length
  const stockSold = accounts.filter(a => a.status === "SOLD").length
  const ordersPending = orders.filter(o => o.status === "pending").length

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white border-4 border-dashed border-black mt-4">
        <Loader2 className="w-10 h-10 animate-spin text-black mb-4" strokeWidth={3} />
        <p className="text-xs font-black text-black uppercase tracking-widest">MEMUAT DATA…</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border-4 border-black rounded-none p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black text-gray-500 uppercase tracking-widest">TOTAL STOK</p>
          <p className="text-4xl font-black text-black mt-2">{accounts.length}</p>
        </div>
        <div className="bg-green-400 border-4 border-black rounded-none p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black text-black uppercase tracking-widest">AVAILABLE</p>
          <p className="text-4xl font-black text-black mt-2">{stockAvailable}</p>
        </div>
        <div className="bg-gray-200 border-4 border-black rounded-none p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black text-gray-600 uppercase tracking-widest">TERJUAL</p>
          <p className="text-4xl font-black text-black mt-2">{stockSold}</p>
        </div>
        <div className="bg-yellow-400 border-4 border-black rounded-none p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-xs font-black text-black uppercase tracking-widest">PESANAN MASUK</p>
          <p className="text-4xl font-black text-black mt-2">{ordersPending}</p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 bg-white p-5 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex w-full md:w-auto border-4 border-black">
          <button onClick={() => setActiveView("stock")}
            className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all border-r-4 border-black last:border-r-0 ${
              activeView === "stock" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-200"
            }`}>
            <Package size={18} strokeWidth={3} /> GUDANG STOK
          </button>
          <button onClick={() => setActiveView("orders")}
            className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest transition-all relative ${
              activeView === "orders" ? "bg-black text-white" : "bg-white text-black hover:bg-gray-200"
            }`}>
            <ShoppingCart size={18} strokeWidth={3} /> PESANAN
            {ordersPending > 0 && (
              <span className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] font-black w-6 h-6 border-2 border-black flex items-center justify-center">
                {ordersPending}
              </span>
            )}
          </button>
        </div>
        <div className="flex-1" />
        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={() => { fetchStocks(); fetchOrders() }}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 border-4 border-black bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
            title="Refresh Data">
            <RefreshCw size={18} strokeWidth={3} /> REFRESH
          </button>
          {activeView === "stock" && (
            <button onClick={() => setIsModalOpen(true)}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-yellow-400 border-4 border-black text-black font-black uppercase tracking-widest text-xs hover:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all">
              <Plus size={20} strokeWidth={3} /> TAMBAH
            </button>
          )}
        </div>
      </div>

      {/* ============== STOCK VIEW ============== */}
      {activeView === "stock" && (
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          {/* Mobile Cards */}
          <div className="block md:hidden divide-y-4 divide-black border-b-4 border-black">
            {accounts.map(acc => (
              <div key={acc.id} className="p-5 space-y-4 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-black text-black text-lg uppercase tracking-widest">{acc.app || "UNKNOWN"}</p>
                    <p className="text-xs text-gray-500 font-black uppercase tracking-widest">{acc.type} • {acc.duration}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1.5 text-[10px] font-black tracking-widest uppercase ${statusBadge(acc.status)}`}>
                      {acc.status}
                    </span>
                    {acc.status === "AVAILABLE" && (
                      <button onClick={() => handleDeleteStock(acc.id)} className="bg-red-500 text-white border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black active:translate-y-0.5 active:shadow-none transition-all">
                        <Trash2 size={16} strokeWidth={3} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="bg-gray-100 p-4 border-2 border-black flex flex-col gap-2 font-mono text-sm shadow-inner">
                  <span className="text-black font-black break-all">{acc.email}</span>
                  <span className="text-gray-600 break-all">{acc.password}</span>
                </div>
                {acc.buyer_wa && (
                  <p className="text-[11px] text-gray-500 font-black uppercase tracking-widest">PEMBELI: {acc.buyer_wa}</p>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black text-white text-xs uppercase tracking-widest font-black border-b-4 border-black">
                  <th className="p-5 border-r-4 border-black">APLIKASI & PAKET</th>
                  <th className="p-5 border-r-4 border-black">DETAIL LOGIN</th>
                  <th className="p-5 border-r-4 border-black">STATUS</th>
                  <th className="p-5 border-r-4 border-black">PEMBELI</th>
                  <th className="p-5 w-20">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map(acc => (
                  <tr key={acc.id} className="border-b-4 border-black last:border-0 hover:bg-gray-100 transition-colors">
                    <td className="p-5 border-r-4 border-black">
                      <p className="font-black text-black text-lg uppercase tracking-widest">{acc.app || "UNKNOWN"}</p>
                      <p className="text-xs text-gray-500 font-black uppercase tracking-widest mt-1">{acc.type} • {acc.duration}</p>
                    </td>
                    <td className="p-5 border-r-4 border-black">
                      <div className="flex flex-col gap-2 text-sm font-mono">
                        <span className="text-black font-black">{acc.email}</span>
                        <span className="text-gray-600 font-bold">{acc.password}</span>
                      </div>
                    </td>
                    <td className="p-5 border-r-4 border-black">
                      <span className={`inline-block px-3 py-1.5 text-[10px] font-black tracking-widest uppercase ${statusBadge(acc.status)}`}>
                        {acc.status}
                      </span>
                    </td>
                    <td className="p-5 text-sm font-black text-black uppercase tracking-widest border-r-4 border-black">{acc.buyer_wa || "—"}</td>
                    <td className="p-5">
                      {acc.status === "AVAILABLE" && (
                        <button onClick={() => handleDeleteStock(acc.id)} className="w-10 h-10 flex items-center justify-center bg-red-500 text-white border-2 border-black hover:bg-black transition-all active:translate-y-0.5 active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none">
                          <Trash2 size={16} strokeWidth={3} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {accounts.length === 0 && <div className="p-10 text-center font-black text-gray-500 text-sm uppercase tracking-widest">BELUM ADA STOK AKUN. KLIK "TAMBAH" UNTUK MULAI.</div>}
        </div>
      )}

      {/* ============== ORDERS VIEW ============== */}
      {activeView === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white border-4 border-dashed border-black p-12 text-center font-black text-gray-500 text-sm uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">BELUM ADA PESANAN MASUK.</div>
          ) : (
            orders.map(order => (
              <div key={order.order_token} className="bg-white border-4 border-black p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-black text-black text-xl uppercase tracking-widest">{order.product_name || "PRODUK"}</h3>
                      <span className={`px-3 py-1.5 text-[10px] font-black tracking-widest uppercase ${statusBadge(order.status)}`}>
                        {order.status === "pending" ? "BELUM BAYAR" : order.status === "paid" ? "LUNAS" : order.status === "delivered" ? "TERKIRIM" : order.status}
                      </span>
                    </div>
                    <p className="text-xs font-black text-gray-500 mt-2 uppercase tracking-widest">{order.type} • {order.duration}</p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm">
                      <span className="text-black font-black uppercase tracking-widest">📱 {order.buyer_wa}</span>
                      <span className="text-white bg-black px-3 py-1 font-black uppercase tracking-widest border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">RP {order.total_price.toLocaleString("id-ID")}</span>
                    </div>
                    {order.stock_email && (
                      <p className="text-xs text-black mt-4 font-black bg-green-400 px-4 py-3 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block uppercase tracking-widest">
                        ✅ AKUN: {order.stock_email}
                      </p>
                    )}
                    <p className="text-[10px] font-black text-gray-400 mt-4 uppercase tracking-widest border-t-2 border-dashed border-black pt-3">
                      {new Date(order.created_at).toLocaleString("id-ID")}
                    </p>
                  </div>
                  {order.status === "pending" && (
                    <button onClick={() => handleConfirmPayment(order.order_token)}
                      className="bg-green-400 hover:bg-black text-black hover:text-white border-2 border-black px-6 py-4 text-xs font-black flex items-center gap-2 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none flex-shrink-0 uppercase tracking-widest">
                      <CheckCircle size={18} strokeWidth={3} /> KONFIRMASI BAYAR
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ============== MODAL TAMBAH STOK ============== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white border-4 border-black rounded-none shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 w-full max-w-lg animate-in slide-in-from-bottom sm:zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-white z-10 py-2 border-b-4 border-black">
              <div>
                <h2 className="text-2xl font-black text-black uppercase tracking-widest">TAMBAH AKUN</h2>
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-1">PASTIKAN KREDENSIAL VALID.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="bg-white border-2 border-black p-2 text-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none">
                <X size={24} strokeWidth={3} />
              </button>
            </div>

            <form onSubmit={handleAddStock} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-widest mb-2">APLIKASI</label>
                  <select className="w-full bg-white border-2 border-black rounded-none px-4 py-3 text-sm text-black font-black outline-none focus:bg-black focus:text-white transition-colors uppercase tracking-widest"
                    value={newApp} onChange={(e) => setNewApp(e.target.value)}>
                    <option value="Canva">CANVA PRO</option>
                    <option value="CapCut">CAPCUT PRO</option>
                    <option value="Netflix">NETFLIX</option>
                    <option value="Spotify">SPOTIFY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-widest mb-2">TIPE AKUN</label>
                  <select className="w-full bg-white border-2 border-black rounded-none px-4 py-3 text-sm text-black font-black outline-none focus:bg-black focus:text-white transition-colors uppercase tracking-widest"
                    value={newType} onChange={(e) => setNewType(e.target.value)}>
                    <option value="Private">PRIVATE</option>
                    <option value="Sharing">SHARING</option>
                    <option value="Family">FAMILY</option>
                    <option value="Owner">OWNER</option>
                    <option value="Member">MEMBER</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-black uppercase tracking-widest mb-2">MASA BERLAKU</label>
                <select className="w-full bg-white border-2 border-black rounded-none px-4 py-3 text-sm text-black font-black outline-none focus:bg-black focus:text-white transition-colors uppercase tracking-widest"
                  value={newDuration} onChange={(e) => setNewDuration(e.target.value)}>
                  <option value="7 Hari">7 HARI</option>
                  <option value="1 Bulan">1 BULAN</option>
                  <option value="3 Bulan">3 BULAN</option>
                  <option value="6 Bulan">6 BULAN</option>
                  <option value="1 Tahun">1 TAHUN</option>
                  <option value="Lifetime">LIFETIME / SELAMANYA</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t-2 border-dashed border-black">
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-widest mb-2">EMAIL / USERNAME</label>
                  <input required type="text" placeholder="USER@EMAIL.COM"
                    className="w-full bg-white border-2 border-black rounded-none px-4 py-3 text-sm text-black outline-none focus:bg-black focus:text-white transition-colors font-black uppercase tracking-widest"
                    value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-widest mb-2">PASSWORD</label>
                  <input required type="text" placeholder="PASS123!@#"
                    className="w-full bg-white border-2 border-black rounded-none px-4 py-3 text-sm text-black outline-none focus:bg-black focus:text-white transition-colors font-black uppercase tracking-widest"
                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
              </div>

              <button type="submit" disabled={saving}
                className="w-full bg-black text-white font-black py-4 border-2 border-black uppercase tracking-widest transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black mt-8 disabled:opacity-50 flex items-center justify-center gap-2 active:translate-y-1 active:shadow-none">
                {saving ? <><Loader2 size={20} strokeWidth={3} className="animate-spin" /> MENYIMPAN...</> : "SIMPAN KE GUDANG"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}