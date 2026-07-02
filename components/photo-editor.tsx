"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Move,
  Maximize,
  RotateCcw,
  Check,
  Settings2,
  Wand2
} from "lucide-react"

export interface PhotoAdjustment {
  offsetX: number
  offsetY: number
  scale: number
  filter: string
}

interface PhotoEditorProps {
  photoId: string
  photoSrc: string
  onAdjustment: (adjustment: PhotoAdjustment) => void
}

// Daftar Preset Filter
const FILTERS = [
  { id: "normal", label: "Normal", value: "none", color: "from-slate-200 to-slate-300" },
  { id: "bw", label: "B & W", value: "grayscale(100%)", color: "from-slate-600 to-slate-900" },
  { id: "sepia", label: "Sepia", value: "sepia(100%)", color: "from-amber-600 to-amber-800" },
  { id: "vintage", label: "Vintage", value: "sepia(40%) contrast(150%) saturate(80%)", color: "from-orange-800 to-red-900" },
  { id: "bright", label: "Cerahan", value: "brightness(120%) contrast(110%) saturate(120%)", color: "from-yellow-300 to-orange-400" },
  { id: "cool", label: "Cool", value: "hue-rotate(180deg) saturate(120%)", color: "from-blue-400 to-indigo-600" },
]

export default function PhotoEditor({ photoId, photoSrc, onAdjustment }: PhotoEditorProps) {
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [scale, setScale] = useState(1)
  const [activeFilter, setActiveFilter] = useState("none")

  const handleApply = () => {
    onAdjustment({ offsetX, offsetY, scale, filter: activeFilter })
  }

  const handleReset = () => {
    setOffsetX(0)
    setOffsetY(0)
    setScale(1)
    setActiveFilter("none")
  }

  return (
    <Card className="p-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden select-none">
      {/* Header Editor */}
      <div className="p-5 md:p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-orange-50 dark:bg-orange-950/20 p-2.5 text-orange-500 rounded-xl border border-orange-100/50">
            <Settings2 className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-850 dark:text-white leading-tight uppercase tracking-wider">Sesuaikan Foto</h3>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">Filter, Geser & Perbesar</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          className="w-10 h-10 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350 active:scale-90 transition-all"
        >
          <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
        </Button>
      </div>

      <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 md:gap-10 bg-white dark:bg-slate-900 items-center md:items-stretch">

        {/* LEFT COLUMN: PREVIEW AREA */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="relative group w-full max-w-[280px] md:max-w-[360px]">
            <div className="relative aspect-square bg-slate-50 dark:bg-slate-950 overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-100 dark:shadow-none">
              <img
                src={photoSrc}
                alt="Editing preview"
                className="w-full h-full object-cover"
                style={{
                  transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
                  filter: activeFilter,
                  transition: "transform 0.1s ease-out, filter 0.3s ease",
                  willChange: "transform, filter"
                }}
              />
              {/* Overlay Grid */}
              <div className="absolute inset-0 border border-black/10 dark:border-white/10 pointer-events-none flex flex-col justify-between mix-blend-overlay">
                <div className="w-full h-1/3 border-b border-black/20 dark:border-white/20 border-dashed" />
                <div className="w-full h-1/3 border-b border-black/20 dark:border-white/20 border-dashed" />
              </div>
              <div className="absolute inset-0 border border-black/10 dark:border-white/10 pointer-events-none flex justify-between mix-blend-overlay">
                <div className="w-1/3 h-full border-r border-black/20 dark:border-white/20 border-dashed" />
                <div className="w-1/3 h-full border-r border-black/20 dark:border-white/20 border-dashed" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTROLS */}
        <div className="w-full md:w-1/2 flex flex-col justify-between space-y-6">
          {/* ================= INI BAGIAN FILTERNYA ================= */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <Wand2 className="w-3.5 h-3.5 text-orange-500" strokeWidth={2.5} /> Efek Filter
            </label>
            <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-1">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.value)}
                  className="flex flex-col items-center gap-2 group shrink-0 outline-none"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${f.color} border-2 transition-all duration-300 rounded-xl ${activeFilter === f.value ? 'border-orange-500 scale-105 shadow-md shadow-orange-500/10' : 'border-transparent group-hover:border-orange-200'}`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${activeFilter === f.value ? 'text-orange-500 dark:text-orange-400' : 'text-slate-400 group-hover:text-slate-650'}`}>
                    {f.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* KONTROL SLIDER EDITOR */}
          <div className="space-y-5 bg-slate-50 dark:bg-white/5 p-5 md:p-6 border border-slate-100 dark:border-slate-800 rounded-2xl">
            <div className="space-y-3">
              <div className="flex justify-between items-end px-1">
                <label className="text-[10px] font-bold text-slate-450 dark:text-slate-550 uppercase tracking-wider flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5 text-orange-500" strokeWidth={2.5} /> Geser Horizontal
                </label>
              </div>
              <input type="range" min={-150} max={150} value={offsetX} onChange={(e) => setOffsetX(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 appearance-none cursor-pointer rounded-full accent-orange-500" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end px-1">
                <label className="text-[10px] font-bold text-slate-450 dark:text-slate-550 uppercase tracking-wider flex items-center gap-1.5">
                  <Move className="w-3.5 h-3.5 rotate-90 text-orange-500" strokeWidth={2.5} /> Geser Vertikal
                </label>
              </div>
              <input type="range" min={-150} max={150} value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 appearance-none cursor-pointer rounded-full accent-orange-500" />
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-end px-1">
                <label className="text-[10px] font-bold text-slate-455 dark:text-slate-550 uppercase tracking-wider flex items-center gap-1.5">
                  <Maximize className="w-3.5 h-3.5 text-orange-500" strokeWidth={2.5} /> Perbesar (Zoom)
                </label>
              </div>
              <input type="range" min={0.5} max={3} step={0.05} value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 appearance-none cursor-pointer rounded-full accent-orange-500" />
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="pt-2">
            <button
              onClick={handleApply}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white py-4 font-bold uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/10 hover:scale-[1.01] active:scale-95 transition-all duration-300 outline-none"
            >
              <Check className="w-5 h-5" strokeWidth={3} />
              Konfirmasi
            </button>
          </div>
        </div>

      </div>
    </Card>
  )
}