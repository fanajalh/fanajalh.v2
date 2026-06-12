"use client"

import { X, Edit, MessageCircle, Clock, Package, User, Mail, Phone, Building, FileText, Save } from "lucide-react"
import { formatCurrency, statusColor, statusLabel, type Order, type Suggestion } from "./types"

// ==================== ORDER DETAIL MODAL ====================
interface OrderDetailProps {
  order: Order
  onClose: () => void
  onEdit: (order: Order) => void
  onSendWhatsApp: (phone: string, orderNumber: string) => void
}

export function OrderDetailModal({ order, onClose, onEdit, onSendWhatsApp }: OrderDetailProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-none max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] border-4 border-black" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white p-5 border-b-4 border-black flex justify-between items-center rounded-none z-10">
          <div>
            <h3 className="font-black text-black text-xl uppercase tracking-widest">{order.order_number}</h3>
            <span className={`mt-1 inline-block text-[10px] font-black uppercase px-2 py-1 border-2 border-current shadow-[2px_2px_0px_0px_currentColor] ${statusColor(order.status)}`}>
              {statusLabel(order.status)}
            </span>
          </div>
          <button onClick={onClose} className="p-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"><X size={20} strokeWidth={3} /></button>
        </div>
        <div className="p-5 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 border-2 border-black">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1"><User size={12} strokeWidth={3} className="inline mr-1" /> NAMA</p>
              <p className="text-sm font-black text-black uppercase tracking-widest">{order.name}</p>
            </div>
            <div className="bg-gray-50 p-3 border-2 border-black">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1"><Mail size={12} strokeWidth={3} className="inline mr-1" /> EMAIL</p>
              <p className="text-sm font-black text-black uppercase tracking-widest break-words">{order.email}</p>
            </div>
            <div className="bg-gray-50 p-3 border-2 border-black">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1"><Phone size={12} strokeWidth={3} className="inline mr-1" /> TELEPON</p>
              <p className="text-sm font-black text-black uppercase tracking-widest">{order.phone}</p>
            </div>
            <div className="bg-gray-50 p-3 border-2 border-black">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1"><Package size={12} strokeWidth={3} className="inline mr-1" /> LAYANAN</p>
              <p className="text-sm font-black text-black uppercase tracking-widest">{order.service}</p>
              <p className="text-[10px] font-bold mt-1 text-gray-600">{order.package}</p>
            </div>
          </div>
          {order.title && (
            <div className="bg-gray-50 p-3 border-2 border-black">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">JUDUL DESAIN</p>
              <p className="text-sm font-black text-black uppercase tracking-widest">{order.title}</p>
            </div>
          )}
          {order.description && (
            <div className="bg-gray-50 p-3 border-2 border-black">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">DESKRIPSI</p>
              <p className="text-sm font-bold text-gray-800">{order.description}</p>
            </div>
          )}
          <div className="pt-4 border-t-4 border-black flex justify-between items-center">
            <p className="text-2xl font-black text-black">{formatCurrency(order.total_price)}</p>
            <div className="flex gap-2">
              <button onClick={() => onSendWhatsApp(order.phone, order.order_number)} className="flex items-center gap-2 px-4 py-3 bg-green-400 text-black rounded-none text-xs font-black uppercase tracking-widest border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-white active:translate-y-0.5 active:shadow-none transition-all">
                <MessageCircle size={16} strokeWidth={3} /> WHATSAPP
              </button>
              <button onClick={() => { onClose(); onEdit(order) }} className="flex items-center gap-2 px-4 py-3 bg-black text-white rounded-none text-xs font-black uppercase tracking-widest border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:text-black active:translate-y-0.5 active:shadow-none transition-all">
                <Edit size={16} strokeWidth={3} /> EDIT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== EDIT ORDER MODAL ====================
interface EditOrderProps {
  order: Order
  setOrder: (order: Order | null) => void
  onClose: () => void
  onSave: (orderId: string, updates: Partial<Order>) => void
}

export function EditOrderModal({ order, setOrder, onClose, onSave }: EditOrderProps) {
  const statusOptions = ["pending", "in_progress", "completed", "cancelled"]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-none max-w-md w-full shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] border-4 border-black" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b-4 border-black flex justify-between items-center bg-white z-10">
          <h3 className="font-black text-black text-xl uppercase tracking-widest">EDIT {order.order_number}</h3>
          <button onClick={onClose} className="p-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"><X size={20} strokeWidth={3} /></button>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <label className="block text-[11px] font-black text-black uppercase tracking-widest mb-2">STATUS PESANAN</label>
            <select
              value={order.status}
              onChange={(e) => setOrder({ ...order, status: e.target.value as Order["status"] })}
              className="w-full px-4 py-3 bg-white border-2 border-black rounded-none text-sm font-black uppercase tracking-widest outline-none focus:bg-black focus:text-white transition-colors cursor-pointer appearance-none"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{statusLabel(s)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-black text-black uppercase tracking-widest mb-2">TOTAL HARGA</label>
            <input
              type="number" value={order.total_price}
              onChange={(e) => setOrder({ ...order, total_price: Number(e.target.value) })}
              className="w-full px-4 py-3 bg-white border-2 border-black rounded-none text-sm font-black outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            />
          </div>
          <div className="flex gap-2 justify-end pt-4 border-t-4 border-black">
            <button onClick={onClose} className="px-5 py-3 bg-white text-black border-2 border-black rounded-none text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">BATAL</button>
            <button onClick={() => onSave(String(order.id), { status: order.status, total_price: order.total_price })}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white border-2 border-black rounded-none text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
              <Save size={16} strokeWidth={3} /> SIMPAN
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== SUGGESTION MODAL ====================
interface SuggestionModalProps {
  suggestion: Suggestion
  response: string
  setResponse: (r: string) => void
  onClose: () => void
  onSubmit: () => void
}

export function SuggestionModal({ suggestion, response, setResponse, onClose, onSubmit }: SuggestionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-none max-w-md w-full shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] border-4 border-black" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b-4 border-black flex justify-between items-center bg-white z-10">
          <h3 className="font-black text-black text-xl uppercase tracking-widest">DETAIL SARAN</h3>
          <button onClick={onClose} className="p-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all"><X size={20} strokeWidth={3} /></button>
        </div>
        <div className="p-5 space-y-5">
          <div className="bg-gray-50 p-3 border-2 border-black">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">DARI</p>
            <p className="text-sm font-black text-black uppercase tracking-widest">{suggestion.nama || "ANONIM"}</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{suggestion.user_email}</p>
          </div>
          <div className="bg-gray-50 p-3 border-2 border-black">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">KATEGORI</p>
            <p className="text-sm font-black text-black uppercase tracking-widest">{suggestion.category}</p>
          </div>
          <div>
            <p className="text-[10px] font-black text-black uppercase tracking-widest mb-2">ISI SARAN</p>
            <p className="text-sm font-bold text-black bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">{suggestion.saran}</p>
          </div>
          <div>
            <label className="block text-[11px] font-black text-black uppercase tracking-widest mb-2">RESPON ADMIN</label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={4}
              placeholder="TULIS RESPON..."
              className="w-full px-4 py-3 bg-white border-2 border-black rounded-none text-sm font-bold outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all resize-none uppercase"
            />
          </div>
          <div className="flex gap-2 justify-end pt-4 border-t-4 border-black">
            <button onClick={onClose} className="px-5 py-3 bg-white text-black border-2 border-black rounded-none text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">BATAL</button>
            <button onClick={onSubmit} className="px-6 py-3 bg-black text-white border-2 border-black rounded-none text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none">
              SIMPAN & REVIEW
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
