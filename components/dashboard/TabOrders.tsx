"use client"

import { useState } from "react"
import { Search, Download, Eye, Edit, Copy, Trash2, MessageCircle, CheckSquare, X } from "lucide-react"
import { formatCurrency, statusColor, statusLabel, type Order } from "./types"

interface Props {
  orders: Order[]
  onViewOrder: (order: Order) => void
  onEditOrder: (order: Order) => void
  onDuplicateOrder: (order: Order) => void
  onDeleteOrder: (orderId: string) => void
  onSendWhatsApp: (phone: string, orderNumber: string) => void
  onExportOrders: () => void
  onBulkAction: (action: string, ids: string[]) => void
}

export function TabOrders({ orders, onViewOrder, onEditOrder, onDuplicateOrder, onDeleteOrder, onSendWhatsApp, onExportOrders, onBulkAction }: Props) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const filtered = orders.filter((o) => {
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.order_number.toLowerCase().includes(search.toLowerCase()) ||
      o.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "all" || o.status === statusFilter
    return matchSearch && matchStatus
  })

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id])
  }

  const toggleAll = () => {
    setSelectedIds((prev) => prev.length === filtered.length ? [] : filtered.map((o) => String(o.id)))
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Toolbar & Filters */}
      <div className="bg-white p-4 rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="CARI NAMA, EMAIL, ATAU ID ORDER..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white border-2 border-black rounded-none text-sm font-black text-black outline-none focus:bg-black focus:text-white transition-all placeholder:text-gray-400 placeholder:font-black focus:placeholder:text-gray-500 uppercase tracking-widest"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 md:flex-none px-4 py-3.5 bg-white border-2 border-black rounded-none text-xs font-black text-black outline-none focus:bg-black focus:text-white appearance-none uppercase tracking-widest cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <button onClick={onExportOrders} className="flex items-center justify-center w-[52px] shrink-0 bg-black text-white border-2 border-black rounded-none hover:bg-white hover:text-black active:translate-y-1 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none" title="Export CSV">
            <Download size={20} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Bulk Actions Floating Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-black text-white p-4 border-4 border-black rounded-none flex items-center justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-4 sticky top-24 z-30">
          <div className="flex items-center gap-3">
            <span className="bg-white text-black w-8 h-8 rounded-none flex items-center justify-center text-xs font-black border-2 border-black">{selectedIds.length}</span>
            <span className="text-sm font-black uppercase tracking-widest">Dipilih</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => onBulkAction("completed", selectedIds)} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-black border-2 border-black rounded-none text-xs font-black hover:bg-white transition-colors uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none">
              <CheckSquare size={16} strokeWidth={2.5} /> Selesai
            </button>
            <button onClick={() => onBulkAction("delete", selectedIds)} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-black border-2 border-black rounded-none text-xs font-black hover:bg-white transition-colors uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none">
              <Trash2 size={16} strokeWidth={2.5} /> Hapus
            </button>
          </div>
        </div>
      )}

      {/* Orders List (Card View - Mobile Friendly) */}
      <div className="flex items-center justify-between px-2 mb-2 border-b-4 border-black pb-2">
        <label className="flex items-center gap-3 cursor-pointer text-xs font-black text-black uppercase tracking-widest group">
          <input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-5 h-5 rounded-none border-2 border-black text-black focus:ring-black cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none group-hover:translate-y-0.5 transition-all" />
          PILIH SEMUA
        </label>
        <span className="text-xs font-black text-black uppercase tracking-widest bg-white border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{filtered.length} Pesanan</span>
      </div>

      <div className="space-y-4">
        {filtered.map((order) => (
          <div key={order.id} className={`bg-white rounded-none p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black transition-all ${selectedIds.includes(String(order.id)) ? 'bg-black text-white' : 'hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'}`}>
            
            {/* Header Card */}
            <div className="flex justify-between items-start mb-4 border-b-2 border-current pb-4">
              <div className="flex items-start gap-4">
                <input type="checkbox" checked={selectedIds.includes(String(order.id))} onChange={() => toggleSelect(String(order.id))} className="mt-1 w-6 h-6 rounded-none border-2 border-black text-black focus:ring-black cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all" />
                <div>
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-widest leading-none mb-1">{order.name}</h3>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${selectedIds.includes(String(order.id)) ? 'text-gray-300' : 'text-gray-500'}`}>{order.order_number}</p>
                </div>
              </div>
              <span className={`shrink-0 text-[10px] font-black uppercase px-3 py-1 border-2 border-current shadow-[2px_2px_0px_0px_currentColor] ${statusColor(order.status)}`}>
                {statusLabel(order.status)}
              </span>
            </div>

            {/* Content Details */}
            <div className={`rounded-none p-4 mb-4 grid grid-cols-2 gap-4 border-2 border-current ${selectedIds.includes(String(order.id)) ? 'bg-white/10' : 'bg-gray-50'}`}>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Layanan</p>
                <p className="text-xs md:text-sm font-black uppercase tracking-widest">{order.service}</p>
                <p className="text-[10px] font-bold uppercase mt-1 opacity-80">{order.package}</p>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">Total Biaya</p>
                <p className={`text-lg md:text-xl font-black tracking-widest ${selectedIds.includes(String(order.id)) ? 'text-green-400' : 'text-green-600'}`}>{formatCurrency(order.total_price)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
              <button onClick={() => onViewOrder(order)} className={`flex-1 min-w-[90px] flex justify-center items-center gap-2 py-3 border-2 border-black rounded-none text-[11px] font-black uppercase tracking-widest transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none ${selectedIds.includes(String(order.id)) ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-white hover:text-black'}`}>
                <Eye size={16} strokeWidth={3} /> DETAIL
              </button>
              <button onClick={() => onSendWhatsApp(order.phone, order.order_number)} className="flex-1 min-w-[90px] flex justify-center items-center gap-2 py-3 border-2 border-black bg-green-400 text-black rounded-none text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none">
                <MessageCircle size={16} strokeWidth={3} /> CHAT
              </button>
              <button onClick={() => onEditOrder(order)} className="w-12 h-12 shrink-0 flex justify-center items-center border-2 border-black bg-blue-400 text-black rounded-none hover:bg-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none" title="Edit">
                <Edit size={18} strokeWidth={2.5} />
              </button>
              <button onClick={() => onDuplicateOrder(order)} className="w-12 h-12 shrink-0 flex justify-center items-center border-2 border-black bg-purple-400 text-black rounded-none hover:bg-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none" title="Duplikat">
                <Copy size={18} strokeWidth={2.5} />
              </button>
              <button onClick={() => onDeleteOrder(String(order.id))} className="w-12 h-12 shrink-0 flex justify-center items-center border-2 border-black bg-red-500 text-white rounded-none hover:bg-white hover:text-red-500 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none" title="Hapus">
                <Trash2 size={18} strokeWidth={2.5} />
              </button>
            </div>

          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-20 bg-white border-4 border-dashed border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Search size={40} strokeWidth={3} className="mx-auto text-black mb-4" />
            <p className="text-xl font-black text-black uppercase tracking-widest mb-2">Pesanan Tidak Ditemukan</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Coba ubah kata kunci atau filter status.</p>
          </div>
        )}
      </div>
    </div>
  )
}