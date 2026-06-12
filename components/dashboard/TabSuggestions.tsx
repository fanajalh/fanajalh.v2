"use client"

import { RefreshCw, Eye, MessageSquare, Clock, CheckCircle } from "lucide-react"
import type { Suggestion } from "./types"

interface Props {
  suggestions: Suggestion[]
  onRefresh: () => void
  onViewSuggestion: (s: Suggestion) => void
}

export function TabSuggestions({ suggestions, onRefresh, onViewSuggestion }: Props) {
  const pending = suggestions.filter((s) => s.status === "pending")
  const reviewed = suggestions.filter((s) => s.status === "reviewed")

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border-4 border-black p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none gap-4">
        <div>
          <h2 className="text-xl font-black text-black uppercase tracking-widest">KOTAK SARAN</h2>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
            <span className="bg-black text-white px-2 py-0.5">{suggestions.length} TOTAL</span> <span className="bg-yellow-400 text-black px-2 py-0.5 ml-1 border-2 border-black">{pending.length} MENUNGGU</span>
          </p>
        </div>
        <button onClick={onRefresh} className="flex items-center justify-center gap-2 px-5 py-3 bg-white text-black border-2 border-black rounded-none text-xs font-black hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none uppercase tracking-widest shrink-0">
          <RefreshCw size={16} strokeWidth={3} /> REFRESH
        </button>
      </div>

      <div className="space-y-3">
        {suggestions.length === 0 ? (
          <div className="text-center py-16 bg-white border-4 border-dashed border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
            <MessageSquare size={40} strokeWidth={3} className="mx-auto text-black mb-4" />
            <p className="font-black text-black uppercase tracking-widest text-lg">BELUM ADA SARAN MASUK</p>
          </div>
        ) : (
          suggestions.map((s) => (
            <div key={s.id} className="bg-white p-5 border-4 border-black hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none group">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                      s.status === "reviewed" ? "bg-green-400 text-black" : "bg-yellow-400 text-black"
                    }`}>
                      {s.status === "reviewed" ? "DITINJAU" : "MENUNGGU"}
                    </span>
                    <span className="text-[10px] font-black text-white bg-black border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest">{s.category}</span>
                  </div>
                  <p className="text-base font-black text-black mb-2 uppercase">{s.saran}</p>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    {s.nama || "ANONIM"} &bull; <span className="text-black">{new Date(s.created_at).toLocaleDateString("id-ID")}</span>
                  </p>
                </div>
                <button onClick={() => onViewSuggestion(s)} className="p-3 border-2 border-black bg-white text-black group-hover:bg-black group-hover:text-white rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all shrink-0">
                  <Eye size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
