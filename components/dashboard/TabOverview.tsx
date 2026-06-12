"use client"

import { TrendingUp, FileText, Clock, CheckCircle, DollarSign, ArrowUpRight, ChevronRight } from "lucide-react"
import { formatCurrency, statusColor, statusLabel, type Order, type Analytics } from "./types"

interface Props {
  stats: { total: number; pending: number; in_progress: number; completed: number; cancelled: number }
  analytics: Analytics | null
  orders: Order[]
  setActiveTab: (tab: string) => void
}

export function TabOverview({ stats, analytics, orders, setActiveTab }: Props) {
  const statCards = [
    { label: "Total Pesanan", value: stats.total, icon: FileText, color: "text-white", bg: "bg-blue-600" },
    { label: "Menunggu", value: stats.pending, icon: Clock, color: "text-black", bg: "bg-yellow-400" },
    { label: "Dikerjakan", value: stats.in_progress, icon: TrendingUp, color: "text-white", bg: "bg-orange-500" },
    { label: "Selesai", value: stats.completed, icon: CheckCircle, color: "text-white", bg: "bg-green-600" },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Hero Revenue Card */}
      {analytics && (
        <div className="bg-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black relative overflow-hidden rounded-none">
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 bg-white rounded-none flex items-center justify-center text-black border-2 border-white">
              <DollarSign size={20} strokeWidth={3} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-white">Total Pendapatan</span>
          </div>
          <p className="text-4xl md:text-5xl font-black text-white tracking-widest relative z-10">
            {formatCurrency(analytics.totalRevenue)}
          </p>
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((s, i) => {
          const Icon = s.icon
          return (
            <div key={i} className={`p-4 md:p-5 border-4 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${s.bg} ${s.color} border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}>
                  <Icon size={24} strokeWidth={2.5} />
                </div>
                <ArrowUpRight size={20} className="text-black" />
              </div>
              <p className="text-3xl font-black text-black leading-none mb-2">{s.value}</p>
              <p className="text-[10px] md:text-xs font-black text-black uppercase tracking-widest">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Recent Orders List */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-5 md:p-6 rounded-none">
        <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
          <h3 className="text-xl font-black text-black tracking-widest uppercase">Pesanan Terbaru</h3>
          <button onClick={() => setActiveTab("orders")} className="text-[11px] font-black text-white bg-black border-2 border-black hover:bg-white hover:text-black px-4 py-2 transition-all flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]">
            Lihat Semua <ChevronRight size={14} strokeWidth={3} />
          </button>
        </div>
        
        <div className="space-y-4">
          {orders.slice(0, 5).map((order) => (
            <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 border-2 border-black hover:bg-black hover:text-white transition-colors group cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-0.5">
              <div className="flex items-center gap-4 min-w-0 mb-3 sm:mb-0">
                <div className="w-12 h-12 bg-white text-black border-2 border-black flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <FileText size={20} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm md:text-base font-black truncate mb-1 uppercase tracking-widest">{order.name}</p>
                  <p className="text-[10px] md:text-xs font-bold truncate tracking-widest">
                    {order.order_number} &bull; <span className="text-orange-500 group-hover:text-yellow-400">{order.service}</span>
                  </p>
                </div>
              </div>
              <span className={`shrink-0 sm:ml-4 text-[10px] font-black uppercase px-3 py-1.5 border-2 border-black group-hover:border-white ${statusColor(order.status)}`}>
                {statusLabel(order.status)}
              </span>
            </div>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-10 bg-white border-4 border-dashed border-black">
              <Clock size={32} strokeWidth={2.5} className="mx-auto text-black mb-3" />
              <p className="text-sm font-black text-black uppercase tracking-widest">Belum ada pesanan masuk</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}