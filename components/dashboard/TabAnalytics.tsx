"use client"

import { TrendingUp, DollarSign, ShoppingBag, Users, Activity, BarChart2 } from "lucide-react"
import { formatCurrency, type Analytics } from "./types"

interface Props {
  analytics: Analytics
}

export function TabAnalytics({ analytics }: Props) {
  
  // Helper: Format angka jadi ringkas untuk HP (contoh: 1.500.000 jadi 1.5Jt)
  const compactCurrency = (val: number) => {
    if (val >= 1000000) return (val / 1000000).toFixed(1).replace('.0', '') + 'Jt'
    if (val >= 1000) return (val / 1000).toFixed(1).replace('.0', '') + 'Rb'
    return val.toString()
  }

  // Mengambil angka saja dari format rupiah untuk styling khusus
  const revenueNumber = formatCurrency(analytics.totalRevenue).replace(/Rp|\s/g, '')

  return (
    <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 select-none px-1">
      
      {/* ================= BENTO STATS GRID ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        
        {/* 1. REVENUE CARD (Hero Highlight - Full Width di Mobile) */}
        <div className="col-span-2 bg-black rounded-none p-5 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black relative overflow-hidden flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="w-12 h-12 bg-white rounded-none flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black">
              <DollarSign size={24} strokeWidth={3} />
            </div>
            <span className="bg-white text-black px-3 py-1.5 rounded-none text-[10px] font-black uppercase tracking-widest border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              TOTAL OMZET
            </span>
          </div>
          <div className="relative z-10">
            <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest mb-1">PENDAPATAN BERSIH</p>
            <p className="text-3xl md:text-5xl font-black text-white tracking-widest flex items-baseline gap-2">
              <span className="text-xl text-gray-400 font-bold">Rp</span>
              {revenueNumber}
            </p>
          </div>
        </div>

        {/* 2. TOTAL ORDERS CARD */}
        <div className="col-span-1 bg-blue-500 rounded-none p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black flex flex-col justify-between hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
          <div className="w-12 h-12 bg-white text-black rounded-none flex items-center justify-center mb-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <ShoppingBag size={24} strokeWidth={3} />
          </div>
          <div>
            <p className="text-[10px] font-black text-white uppercase tracking-widest mb-1">SEMUA ORDER</p>
            <p className="text-4xl font-black text-black leading-none">{analytics.totalOrders}</p>
          </div>
        </div>

        {/* 3. COMPLETED CARD */}
        <div className="col-span-1 bg-green-400 rounded-none p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-4 border-black flex flex-col justify-between hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
          <div className="w-12 h-12 bg-white text-black rounded-none flex items-center justify-center mb-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <TrendingUp size={24} strokeWidth={3} />
          </div>
          <div>
            <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">SELESAI</p>
            <p className="text-4xl font-black text-white leading-none">{analytics.completedOrders}</p>
          </div>
        </div>

        {/* 4. PENDING CARD (Alert Style - Full Width di Mobile) */}
        <div className="col-span-2 md:col-span-4 bg-yellow-400 rounded-none p-5 md:p-6 border-4 border-black flex items-center justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-black text-white rounded-none flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Users size={24} strokeWidth={3} />
             </div>
             <div>
               <p className="text-[11px] font-black text-black uppercase tracking-widest mb-1">PERLU DIPROSES</p>
               <div className="flex items-baseline gap-2">
                 <p className="text-3xl font-black text-white leading-none" style={{ textShadow: "2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}>{analytics.pendingOrders}</p>
                 <span className="text-sm font-black text-black uppercase tracking-widest">ORDERAN</span>
               </div>
             </div>
          </div>
          {/* Visual Indicator */}
          {analytics.pendingOrders > 0 && (
            <div className="w-6 h-6 bg-red-500 rounded-none border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] animate-bounce mr-2" />
          )}
        </div>

      </div>

      {/* ================= CHART REVENUE ================= */}
      {analytics.monthlyRevenue && analytics.monthlyRevenue.length > 0 && (
        <div className="bg-white rounded-none p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black relative overflow-hidden mt-6">
          <div className="absolute top-0 left-0 right-0 h-2 bg-black" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 mt-2 gap-4">
            <h2 className="text-xl font-black text-black uppercase tracking-widest flex items-center gap-3">
              <div className="p-2 border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <BarChart2 size={20} strokeWidth={3} className="text-black" />
              </div>
              GRAFIK PENDAPATAN
            </h2>
            <span className="bg-black text-white px-3 py-1.5 rounded-none text-[10px] font-black uppercase tracking-widest border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              TAHUN INI
            </span>
          </div>

          {/* Area Grafik */}
          <div className="w-full overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b-4 border-black border-dashed">
            <div className="flex items-end gap-4 md:gap-6 min-w-max h-[200px] px-2">
              {analytics.monthlyRevenue.map((m, i) => {
                const max = Math.max(...analytics.monthlyRevenue.map((x) => x.revenue), 1)
                const height = (m.revenue / max) * 100

                return (
                  <div key={i} className="flex flex-col items-center gap-3 w-12 md:w-16 group cursor-default">
                    {/* Tooltip Angka Ringkas */}
                    <span className="text-[10px] font-black text-black opacity-0 group-hover:opacity-100 transition-opacity bg-yellow-400 px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -mb-2 z-10">
                      {compactCurrency(m.revenue)}
                    </span>
                    
                    {/* Batang Grafik */}
                    <div className="w-10 md:w-14 bg-gray-100 rounded-none relative flex items-end justify-center h-full border-x-2 border-t-2 border-black">
                      <div 
                        className="w-full bg-black rounded-none shadow-[inset_0_-4px_0_0_rgba(255,255,255,0.3)] transition-all duration-700 ease-out group-hover:bg-orange-500" 
                        style={{ height: `${Math.max(height, 5)}%` }} 
                      />
                    </div>
                    
                    {/* Label Bulan */}
                    <span className="text-xs font-black text-black uppercase tracking-widest group-hover:text-orange-500 transition-colors">
                      {m.month.substring(0, 3)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}