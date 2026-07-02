"use client"

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, ArrowUp, ArrowDown, Trash2, Maximize2, Move, RefreshCw, Upload, Sparkles } from "lucide-react"

const createEmojiSticker = (emoji: string): string => {
  const canvas = document.createElement("canvas")
  canvas.width = 160
  canvas.height = 160
  const ctx = canvas.getContext("2d")
  if (ctx) {
    ctx.font = "120px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(emoji, 80, 80)
  }
  return canvas.toDataURL("image/png")
}

const DEFAULT_EMOJIS = ["✨", "❤️", "🔥", "😎", "😂", "🎉", "💯", "🎂"]

interface Photo { id: string; src: string; boxIndex: number }
interface TransparentBox { x: number; y: number; width: number; height: number; index: number }

// === UPDATE INTERFACE: Tambahkan properti 'filter' ===
interface PhotoAdjustment { offsetX: number; offsetY: number; scale: number; filter?: string }

interface Sticker { id: string; src: string; x: number; y: number; size: number; rotation: number }

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement>
  frameImage: string
  photos?: Photo[]
  transparentBoxes?: TransparentBox[]
  photoAdjustments?: Record<string, PhotoAdjustment>
  onPhotoAdjustment?: (photoId: string, adjustment: PhotoAdjustment) => void
  stickers?: Sticker[]
  setStickers?: Dispatch<SetStateAction<Sticker[]>>
}

type Action = "drag" | "resize" | "rotate" | null

export default function CanvasComposer({
  canvasRef, frameImage, photos = [], transparentBoxes = [], photoAdjustments = {}, stickers = [], setStickers = () => { },
}: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [action, setAction] = useState<Action>(null)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [startSticker, setStartSticker] = useState<Sticker | null>(null)
  const [frameImg, setFrameImg] = useState<HTMLImageElement | null>(null)
  const [photoImages, setPhotoImages] = useState<Record<string, HTMLImageElement>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const img = new Image()
    img.src = frameImage
    img.crossOrigin = "anonymous"
    img.onload = () => setFrameImg(img)
  }, [frameImage])

  useEffect(() => {
    const loaded: Record<string, HTMLImageElement> = {}
    photos.forEach(photo => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        loaded[photo.id] = img
        if (Object.keys(loaded).length === photos.length) setPhotoImages({ ...loaded })
      }
      img.src = photo.src
    })
  }, [photos])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !frameImg) return
    const ctx = canvas.getContext("2d")!

    canvas.width = frameImg.width
    canvas.height = frameImg.height
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = "high"

    let animationFrameId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // A. GAMBAR FOTO USER
      photos.forEach(photo => {
        const box = transparentBoxes[photo.boxIndex]
        const img = photoImages[photo.id]
        if (!box || !img) return

        // Default values jika belum ada editan
        const adj = photoAdjustments[photo.id] || { offsetX: 0, offsetY: 0, scale: 1, filter: "none" }

        ctx.save()
        ctx.beginPath()
        ctx.rect(box.x, box.y, box.width, box.height)
        ctx.clip()

        // 1. Terapkan Filter Gambar ke Canvas
        ctx.filter = adj.filter || "none"

        // 2. Anti-Gepeng Math (Center Crop)
        const coverScale = Math.max(box.width / img.width, box.height / img.height)
        const finalWidth = img.width * coverScale * adj.scale
        const finalHeight = img.height * coverScale * adj.scale
        const drawX = box.x + (box.width - finalWidth) / 2 + adj.offsetX
        const drawY = box.y + (box.height - finalHeight) / 2 + adj.offsetY

        // 3. Lukis gambar ke canvas
        ctx.drawImage(img, drawX, drawY, finalWidth, finalHeight)

        // 4. Reset filter agar elemen lain (seperti frame/stiker) tidak ikut kena filter!
        ctx.filter = "none"
        ctx.restore()
      })

      // B. GAMBAR FRAME (Di atas foto)
      ctx.drawImage(frameImg, 0, 0)

      // C. GAMBAR STIKER
      stickers.forEach(s => {
        const img = new Image()
        img.src = s.src
        ctx.save()
        ctx.translate(s.x + s.size / 2, s.y + s.size / 2)
        ctx.rotate((s.rotation * Math.PI) / 180)
        ctx.drawImage(img, -s.size / 2, -s.size / 2, s.size, s.size)

        if (s.id === activeId) {
          ctx.strokeStyle = "#0ea5e9"
          ctx.setLineDash([6, 4])
          ctx.lineWidth = 2
          ctx.strokeRect(-s.size / 2 - 2, -s.size / 2 - 2, s.size + 4, s.size + 4)
          ctx.setLineDash([])
          ctx.lineWidth = 2

          // Delete Handle (Top Right)
          ctx.beginPath()
          ctx.arc(s.size / 2 + 10, -s.size / 2 - 10, 80, 0, Math.PI * 2)
          ctx.fillStyle = "#ef4444"
          ctx.fill()
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 6
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(s.size / 2 - 14, -s.size / 2 - 34)
          ctx.lineTo(s.size / 2 + 34, -s.size / 2 + 14)
          ctx.moveTo(s.size / 2 + 34, -s.size / 2 - 34)
          ctx.lineTo(s.size / 2 - 14, -s.size / 2 + 14)
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 10
          ctx.stroke()
          ctx.lineWidth = 2

          // Resize Handle (Bottom Right)
          ctx.beginPath()
          ctx.arc(s.size / 2 + 10, s.size / 2 + 10, 80, 0, Math.PI * 2)
          ctx.fillStyle = "#0ea5e9"
          ctx.fill()
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 6
          ctx.stroke()
          ctx.beginPath()
          ctx.arc(s.size / 2 + 10, s.size / 2 + 10, 24, 0, Math.PI * 2)
          ctx.fillStyle = "#ffffff"
          ctx.fill()
          ctx.lineWidth = 2

          // Rotate Handle (Bottom Center)
          ctx.beginPath()
          ctx.arc(0, s.size / 2 + 90, 80, 0, Math.PI * 2)
          ctx.fillStyle = "#10b981"
          ctx.fill()
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 6
          ctx.stroke()
          ctx.beginPath()
          ctx.arc(0, s.size / 2 + 90, 24, 0, Math.PI * 2)
          ctx.fillStyle = "#ffffff"
          ctx.fill()
          ctx.lineWidth = 2
        }
        ctx.restore()
      })
      animationFrameId = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animationFrameId)
  }, [stickers, activeId, frameImg, photos, transparentBoxes, photoAdjustments, photoImages, canvasRef])

  const hitTest = (x: number, y: number) => {
    for (let i = stickers.length - 1; i >= 0; i--) {
      const s = stickers[i]
      const cx = s.x + s.size / 2; const cy = s.y + s.size / 2
      const dx = x - cx; const dy = y - cy
      const angle = (s.rotation * Math.PI) / 180
      const rx = dx * Math.cos(-angle) - dy * Math.sin(-angle)
      const ry = dx * Math.sin(-angle) + dy * Math.cos(-angle)
      if (Math.hypot(rx - (s.size / 2 + 10), ry - (-s.size / 2 - 10)) <= 100) return { id: s.id, type: "delete" }
      if (Math.hypot(rx - 0, ry - (s.size / 2 + 90)) <= 100) return { id: s.id, type: "rotate" }
      if (Math.hypot(rx - (s.size / 2 + 10), ry - (s.size / 2 + 10)) <= 100) return { id: s.id, type: "resize" }
      if (rx >= -s.size / 2 && rx <= s.size / 2 && ry >= -s.size / 2 && ry <= s.size / 2) return { id: s.id, type: "drag" }
    }
    return null
  }

  const onStart = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (clientX - rect.left) * (canvasRef.current.width / rect.width)
    const y = (clientY - rect.top) * (canvasRef.current.height / rect.height)
    const hit = hitTest(x, y)
    setActiveId(hit?.id || null)
    if (!hit) return
    if (hit.type === "delete") { setStickers(prev => prev.filter(s => s.id !== hit.id)); setActiveId(null); return }
    setStartSticker({ ...stickers.find(st => st.id === hit.id)! }); setStartPos({ x, y }); setAction(hit.type as Action)
  }

  const onMove = (clientX: number, clientY: number) => {
    if (!action || !activeId || !startSticker || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (clientX - rect.left) * (canvasRef.current.width / rect.width)
    const y = (clientY - rect.top) * (canvasRef.current.height / rect.height)
    const dx = x - startPos.x; const dy = y - startPos.y
    setStickers(prev => prev.map(s => {
      if (s.id !== activeId) return s
      if (action === "drag") return { ...s, x: startSticker.x + dx, y: startSticker.y + dy }
      if (action === "resize") return { ...s, size: Math.max(30, startSticker.size + dx) }
      if (action === "rotate") return { ...s, rotation: (Math.atan2(y - (startSticker.y + startSticker.size / 2), x - (startSticker.x + startSticker.size / 2)) * 180) / Math.PI - 90 }
      return s
    }))
  }

  const changeZ = (dir: "up" | "down") => {
    if (!activeId) return
    setStickers(prev => {
      const idx = prev.findIndex(s => s.id === activeId)
      if ((dir === "up" && idx === prev.length - 1) || (dir === "down" && idx === 0)) return prev
      const newArr = [...prev]; const [moved] = newArr.splice(idx, 1); newArr.splice(dir === "up" ? idx + 1 : idx - 1, 0, moved); return newArr
    })
  }

  return (
    <div className="flex flex-col items-center w-full max-w-[450px] mx-auto space-y-5">
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 rounded-[2.5rem] shadow-xl shadow-slate-100 dark:shadow-none overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef} className="max-w-full h-auto max-h-[65vh] cursor-crosshair touch-none rounded-3xl"
          onMouseDown={e => onStart(e.clientX, e.clientY)} onMouseMove={e => onMove(e.clientX, e.clientY)} onMouseUp={() => setAction(null)}
          onTouchStart={e => onStart(e.touches[0].clientX, e.touches[0].clientY)} onTouchMove={e => onMove(e.touches[0].clientX, e.touches[0].clientY)} onTouchEnd={() => setAction(null)}
        />
      </div>

      <Card className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-md flex items-center justify-between px-4 relative z-30">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white border-transparent rounded-xl h-11 px-5 font-bold uppercase tracking-wider shadow-md shadow-orange-500/10 transition-all active:scale-95">
              <Plus className="w-4 h-4 mr-2" /> Stiker
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-50 transform origin-bottom" sideOffset={20}>
            <div className="space-y-4">
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-orange-500" /> Stiker Lucu</h4>
                <div className="grid grid-cols-4 gap-2">
                  {DEFAULT_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setStickers(prev => [...prev, { id: crypto.randomUUID(), src: createEmojiSticker(emoji), x: 40, y: 40, size: 250, rotation: 0 }])}
                      className="w-12 h-12 flex items-center justify-center text-3xl hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-300 active:scale-95 hover:scale-110"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <Separator className="bg-slate-100 dark:bg-slate-800" />
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full rounded-xl border-dashed border border-slate-300 dark:border-slate-700 hover:border-orange-500 hover:text-orange-600 text-slate-700 dark:text-slate-355 font-bold h-11 transition-all duration-300 uppercase tracking-wider text-xs bg-transparent">
                <Upload className="w-4 h-4 mr-2" /> Atau Upload Gambar
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Separator orientation="vertical" className="h-6 bg-slate-100 dark:bg-slate-800" />
        <TooltipProvider>
          <div className="flex bg-slate-55/10 dark:bg-white/10 p-1 rounded-xl border border-slate-100 dark:border-slate-850 gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!activeId} onClick={() => changeZ("up")} className="text-slate-750 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  <ArrowUp className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-250">Ke Depan</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" disabled={!activeId} onClick={() => changeZ("down")} className="text-slate-755 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-250">Ke Belakang</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </Card>

      <div className="flex gap-6 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        <span className="flex items-center gap-2"><Move className="w-3 h-3 text-orange-500" /> Geser</span>
        <span className="flex items-center gap-2"><RefreshCw className="w-3 h-3 text-orange-500" /> Putar</span>
        <span className="flex items-center gap-2"><Maximize2 className="w-3 h-3 text-orange-500" /> Ukuran</span>
      </div>
      <input ref={fileInputRef} type="file" accept="image/png" hidden onChange={e => { if (e.target.files?.[0]) { const r = new FileReader(); r.onload = () => setStickers(prev => [...prev, { id: crypto.randomUUID(), src: r.result as string, x: 50, y: 50, size: 250, rotation: 0 }]); r.readAsDataURL(e.target.files[0]) } }} />
    </div>
  )
}