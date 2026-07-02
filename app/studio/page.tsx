"use client"

import { useState, useRef, useEffect, useCallback, Suspense } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  ArrowRight,
  Trash2,
  MoveUp,
  MoveDown,
  Image as ImageIcon,
  Sparkles,
  Layers,
  Loader2,
  Camera,
  Settings2,
  X,
  Mail,
  Download,
  Film,
  QrCode,
  CheckCircle2,
  Share2,
  Plus,
  Eye,
  Wand2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import PhotoUploader from "@/components/photo-uploader"
import CanvasComposer from "@/components/canvas-composer"
import PhotoEditor from "@/components/photo-editor"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import QRCode from "qrcode"
import { loadImage, encodeGifWithDelays } from "@/lib/gif-encoder"

// --- Interfaces ---
interface Photo {
  id: string
  src: string
  boxIndex: number
}

interface Sticker {
  id: string
  src: string
  x: number
  y: number
  size: number
  rotation: number
}

interface TransparentBox {
  x: number
  y: number
  width: number
  height: number
  index: number
}

interface PhotoAdjustment {
  offsetX: number
  offsetY: number
  scale: number
  filter?: string
}

const FALLBACK_FRAMES: Record<string, string> = {}

// ============================================================
// STEP INDICATOR COMPONENT
// ============================================================
function StepIndicator({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  const steps = [
    { num: 1, label: "Ambil Foto", icon: Camera },
    { num: 2, label: "Edit Foto", icon: Wand2 },
    { num: 3, label: "Hasil Akhir", icon: Download },
  ]

  return (
    <div className="flex flex-wrap items-center border-b-2 border-black dark:border-white bg-white dark:bg-black">
      {steps.map((step, idx) => {
        const Icon = step.icon
        const isActive = currentStep === step.num
        const isDone = currentStep > step.num

        return (
          <div key={step.num} className={`flex-1 flex items-center justify-center p-3 sm:p-4 border-r-2 last:border-r-0 border-black dark:border-white transition-colors ${isActive ? 'bg-black text-white dark:bg-white dark:text-black' : isDone ? 'bg-gray-100 text-black dark:bg-white/10 dark:text-white' : 'bg-white text-gray-400 dark:bg-black dark:text-gray-600'}`}>
            <div className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest hidden sm:block">
                {step.num}. {step.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ============================================================
// MAIN STUDIO CONTENT
// ============================================================
function StudioPageContent() {
  const searchParams = useSearchParams()
  const frameId = searchParams.get("frameId") || "good-vibes"
  const [frameMap, setFrameMap] = useState<Record<string, string>>(FALLBACK_FRAMES)

  useEffect(() => {
    let cancelled = false
    fetch("/api/frames")
      .then((r) => r.json())
      .then((json) => {
        if (cancelled || !json.success || !Array.isArray(json.data)) return
        const next = { ...FALLBACK_FRAMES }
        for (const row of json.data) {
          if (row.slug && row.image_url) next[row.slug] = row.image_url
        }
        setFrameMap(next)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const frameImage = frameMap[frameId] || frameMap["good-vibes"]

  // --- Core States ---
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [transparentBoxes, setTransparentBoxes] = useState<TransparentBox[]>([])
  const [isProcessing, setIsProcessing] = useState(true)
  const [photoAdjustments, setPhotoAdjustments] = useState<Record<string, PhotoAdjustment>>({})
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null)

  // --- Email ---
  const [emailInput, setEmailInput] = useState("")
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailSuccess, setEmailSuccess] = useState(false)

  // --- QR Code ---
  const [showQrModal, setShowQrModal] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [qrShareUrl, setQrShareUrl] = useState<string | null>(null)
  const [isGeneratingQr, setIsGeneratingQr] = useState(false)

  // --- GIF ---
  const [showGifModal, setShowGifModal] = useState(false)
  const [gifDataUrl, setGifDataUrl] = useState<string | null>(null)
  const [isGeneratingGif, setIsGeneratingGif] = useState(false)
  const [gifProgress, setGifProgress] = useState(0)

  const getGifLoadingText = (p: number) => {
    if (p < 20) return "Memproses gambar dasar..."
    if (p < 60) return "Menambahkan efek animasi..."
    if (p < 90) return "Menyatukan frame (encoding)..."
    return "Menyelesaikan file final..."
  }

  // --- Step transition animation ---
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goToStep = (step: 1 | 2 | 3) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentStep(step)
      setIsTransitioning(false)
    }, 200)
  }

  // --- Deteksi Area Transparan ---
  useEffect(() => {
    detectTransparentAreas(frameImage)
  }, [frameImage])

  const detectTransparentAreas = (imageSrc: string) => {
    setIsProcessing(true)
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      const boxes: TransparentBox[] = []
      const visited = new Set<number>()
      let boxIndex = 0

      for (let i = 3; i < data.length; i += 4) {
        const pixelIndex = (i - 3) / 4
        if (data[i] < 128 && !visited.has(pixelIndex)) {
          const { x, y, width, height } = floodFill(data, canvas.width, canvas.height, pixelIndex, visited)
          if (width > 30 && height > 30) {
            boxes.push({ x, y, width, height, index: boxIndex })
            boxIndex++
          }
        }
      }
      setTransparentBoxes(boxes)
      setIsProcessing(false)
    }
    img.src = imageSrc
  }

  const floodFill = (data: Uint8ClampedArray, width: number, height: number, startPixel: number, visited: Set<number>) => {
    const startY = Math.floor(startPixel / width)
    const startX = startPixel % width
    let minX = startX, maxX = startX, minY = startY, maxY = startY
    const stack = [startPixel]

    while (stack.length > 0) {
      const pixel = stack.pop()!
      if (visited.has(pixel)) continue
      visited.add(pixel)
      const y = Math.floor(pixel / width)
      const x = pixel % width
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)

      const neighbors = [pixel - width, pixel + width, pixel - 1, pixel + 1]
      for (const neighbor of neighbors) {
        if (neighbor >= 0 && neighbor < data.length / 4 && !visited.has(neighbor)) {
          if (data[neighbor * 4 + 3] < 128) stack.push(neighbor)
        }
      }
    }
    return { x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1 }
  }

  // --- Handlers ---
  const addPhoto = (photo: Photo) => setPhotos([...photos, photo])

  const removePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id))
    const newAdjustments = { ...photoAdjustments }
    delete newAdjustments[id]
    setPhotoAdjustments(newAdjustments)
  }

  const clearAllPhotos = () => {
    if (confirm("Hapus semua foto?")) {
      setPhotos([])
      setPhotoAdjustments({})
    }
  }

  const movePhoto = (fromIndex: number, toIndex: number) => {
    const newPhotos = [...photos]
    const [movedPhoto] = newPhotos.splice(fromIndex, 1)
    newPhotos.splice(toIndex, 0, movedPhoto)
    setPhotos(newPhotos.map((p, i) => ({ ...p, boxIndex: i })))
  }

  const handleAdjustmentSave = (adjustment: PhotoAdjustment) => {
    if (editingPhotoId) {
      setPhotoAdjustments(prev => ({
        ...prev,
        [editingPhotoId]: adjustment
      }))
      setEditingPhotoId(null)
    }
  }

  // Action: Download
  const downloadComposite = () => {
    if (!canvasRef.current) return
    const link = document.createElement("a")
    link.href = canvasRef.current.toDataURL("image/png", 1.0)
    link.download = `fanajah-photobooth-${Date.now()}.png`
    link.click()
  }

  // Action: Send Email
  const handleSendEmail = async () => {
    if (!emailInput) {
      alert("Masukkan alamat emailmu dulu ya!")
      return
    }
    const canvas = canvasRef.current
    if (!canvas) return

    const base64Image = canvas.toDataURL("image/png", 1.0)

    setIsSendingEmail(true)
    try {
      const response = await fetch('/api/send-photobooth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, image: base64Image })
      })

      if (response.ok) {
        setEmailSuccess(true)
        setTimeout(() => setEmailSuccess(false), 4000)
        setEmailInput("")
      } else {
        alert("Gagal mengirim email. Coba lagi nanti.")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Terjadi kesalahan jaringan.")
    } finally {
      setIsSendingEmail(false)
    }
  }

  // ========== QR CODE ==========
  const handleGenerateQr = async () => {
    if (!canvasRef.current) return
    setIsGeneratingQr(true)
    setShowQrModal(true)
    setQrDataUrl(null)
    setQrShareUrl(null)

    try {
      const base64Image = canvasRef.current.toDataURL("image/png", 0.8)

      const res = await fetch("/api/photobooth-share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image }),
      })
      const json = await res.json()

      if (!json.success) throw new Error(json.message)

      const qrPng = await QRCode.toDataURL(json.shareUrl, {
        width: 400,
        margin: 2,
        color: { dark: "#1e293b", light: "#ffffff" },
        errorCorrectionLevel: "M",
      })
      setQrDataUrl(qrPng)
      setQrShareUrl(json.shareUrl)
    } catch (err) {
      console.error("QR Generation error:", err)
      alert("Gagal membuat QR Code. Coba lagi.")
      setShowQrModal(false)
    } finally {
      setIsGeneratingQr(false)
    }
  }

  const downloadQr = () => {
    if (!qrDataUrl) return
    const link = document.createElement("a")
    link.href = qrDataUrl
    link.download = `fanajah-qr-${Date.now()}.png`
    link.click()
  }

  // ========== GIF GENERATOR (Live Photo — NO TEMPLATE) ==========
  const handleGenerateGif = useCallback(async () => {
    if (photos.length === 0) return
    setIsGeneratingGif(true)
    setShowGifModal(true)
    setGifDataUrl(null)
    setGifProgress(0)

    try {
      // Load all photo images
      const photoImgs: HTMLImageElement[] = []
      for (const photo of photos) {
        const img = await loadImage(photo.src)
        photoImgs.push(img)
      }

      // Standard GIF canvas size (portrait oriented)
      const W = 600
      const H = 800

      const gifCanvas = document.createElement("canvas")
      gifCanvas.width = W
      gifCanvas.height = H
      const gifCtx = gifCanvas.getContext("2d")!

      // Helper: Draw a photo cover-fit into the full canvas
      const drawPhotoCoverFit = (
        ctx: CanvasRenderingContext2D,
        img: HTMLImageElement,
        bounceScale: number = 1
      ) => {
        ctx.save()
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, W, H)

        const coverScale = Math.max(W / img.width, H / img.height) * bounceScale
        const fw = img.width * coverScale
        const fh = img.height * coverScale
        const dx = (W - fw) / 2
        const dy = (H - fh) / 2
        ctx.drawImage(img, dx, dy, fw, fh)
        ctx.restore()
      }

      // Bounce easing
      const bounceEase = (t: number): number => {
        if (t < 0.4) return 1.15 - 0.15 * (t / 0.4)
        if (t < 0.7) return 1.0 - 0.03 * ((t - 0.4) / 0.3)
        return 0.97 + 0.03 * ((t - 0.7) / 0.3)
      }

      const allFrames: { data: ImageData; delay: number }[] = []

      // Frame 0: White intro
      gifCtx.fillStyle = "#ffffff"
      gifCtx.fillRect(0, 0, W, H)
      allFrames.push({ data: gifCtx.getImageData(0, 0, W, H), delay: 300 })
      setGifProgress(5)

      // Each photo: bounce animation
      const bounceSteps = 5
      for (let i = 0; i < photoImgs.length; i++) {
        for (let step = 0; step < bounceSteps; step++) {
          const t = step / (bounceSteps - 1)
          const scale = bounceEase(t)
          drawPhotoCoverFit(gifCtx, photoImgs[i], scale)
          allFrames.push({
            data: gifCtx.getImageData(0, 0, W, H),
            delay: step === bounceSteps - 1 ? 500 : 60,
          })
        }
        setGifProgress(5 + Math.round(((i + 1) / photoImgs.length) * 65))
      }

      // Hold last photo
      drawPhotoCoverFit(gifCtx, photoImgs[photoImgs.length - 1], 1)
      allFrames.push({ data: gifCtx.getImageData(0, 0, W, H), delay: 1500 })
      setGifProgress(75)

      // Encode GIF
      const gifBlob = await encodeGifWithDelays(allFrames, W, H, (p) => setGifProgress(75 + Math.round(p * 25)))
      const gifUrl = URL.createObjectURL(gifBlob)
      setGifDataUrl(gifUrl)
      setGifProgress(100)
    } catch (err) {
      console.error("GIF generation error:", err)
      alert("Gagal membuat GIF. Coba lagi.")
      setShowGifModal(false)
    } finally {
      setIsGeneratingGif(false)
    }
  }, [photos])

  const downloadGif = () => {
    if (!gifDataUrl) return
    const link = document.createElement("a")
    link.href = gifDataUrl
    link.download = `fanajah-livephoto-${Date.now()}.gif`
    link.click()
  }

  const photoToEdit = photos.find(p => p.id === editingPhotoId)

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen font-sans select-none w-full relative overflow-x-hidden selection:bg-orange-500 selection:text-white">
      {/* Background Decor (Grid tipis) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0"></div>

      {/* HEADER */}
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-900 px-5 h-16 flex items-center justify-between select-none">
        <div className="flex items-center gap-3">
          {currentStep === 1 ? (
            <Link href="/frames" className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-xl transition-all active:scale-95 shadow-sm">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          ) : (
            <button
              onClick={() => goToStep((currentStep - 1) as 1 | 2)}
              className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50 dark:hover:bg-orange-950/20 rounded-xl transition-all active:scale-95 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="bg-orange-50 dark:bg-orange-950/20 p-2 text-orange-500 border border-orange-100/50 dark:border-orange-900/30 rounded-lg">
              <Camera className="w-4 h-4" />
            </div>
            <h1 className="font-extrabold text-slate-800 dark:text-white text-sm uppercase tracking-wider">Studio</h1>
          </div>
        </div>

        {/* Step-specific header button */}
        {currentStep === 1 && (
          <button
            onClick={() => goToStep(2)}
            disabled={photos.length === 0}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white active:scale-95 text-[10px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-orange-500/10 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
          >
            Lanjut <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
        {currentStep === 2 && (
          <button
            onClick={() => goToStep(3)}
            disabled={photos.length === 0}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white active:scale-95 text-[10px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-orange-500/10 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
          >
            Selesai <CheckCircle2 className="w-3.5 h-3.5" />
          </button>
        )}
        {currentStep === 3 && (
          <button
            onClick={() => goToStep(2)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-orange-500 hover:border-orange-200 active:scale-95 text-[10px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Wand2 className="w-3.5 h-3.5 text-orange-500" /> Edit Lagi
          </button>
        )}
      </header>

      {/* STEP INDICATOR */}
      <StepIndicator currentStep={currentStep} />

      {/* CONTENT AREA with transition */}
      <div
        className={`transition-all duration-300 ease-out origin-top ${
          isTransitioning ? "opacity-0 scale-[0.98] -translate-y-2" : "opacity-100 scale-100 translate-y-0 animate-in slide-in-from-right-4 fade-in duration-500"
        }`}
      >
        {/* ==================== STEP 1: TAKE ==================== */}
        {currentStep === 1 && (
          <main className="max-w-2xl mx-auto p-4 md:p-8 pb-32 space-y-6">

            {/* Title */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white uppercase tracking-tight">📸 Ambil Foto</h2>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Gunakan kamera atau upload foto dari galeri</p>
            </div>

            {isProcessing ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center space-y-4 p-12 rounded-[2.5rem] shadow-sm shadow-slate-100 dark:shadow-none">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                <div className="text-center">
                  <h3 className="font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">Menyiapkan Studio</h3>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">Sedang memproses frame...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Progress */}
                <div className="bg-white dark:bg-slate-900 p-5 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm shadow-slate-100 dark:shadow-none hover:shadow-lg hover:shadow-orange-500/5">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Progress Foto
                    </span>
                    <span className="text-sm font-black text-slate-800 dark:text-white">
                      {photos.length} <span className="text-gray-400">/</span> {transparentBoxes.length || "?"}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${transparentBoxes.length ? (photos.length / transparentBoxes.length) * 100 : 0}%` }}
                    />
                  </div>
                  {photos.length >= transparentBoxes.length && transparentBoxes.length > 0 && (
                    <div className="flex items-center gap-2 mt-4 text-emerald-800 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-2 bg-emerald-50 dark:bg-emerald-950/20 p-3.5 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Semua slot terisi! Klik &quot;Lanjut&quot; untuk edit.</span>
                    </div>
                  )}
                </div>

                {/* Uploader */}
                <PhotoUploader
                  onPhotoAdd={addPhoto}
                  boxCount={transparentBoxes.length}
                  uploadedPhotos={photos.length}
                  photos={photos}
                  onNextStep={() => goToStep(2)}
                  onPhotoRemove={removePhoto}
                />

                {/* Photo Grid Preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-orange-500" /> Foto yang Diambil
                    </h3>
                    {photos.length > 0 && (
                      <button onClick={clearAllPhotos} className="text-[10px] items-center gap-1 font-bold uppercase tracking-wider text-rose-500 hover:text-rose-600 border border-rose-100 dark:border-rose-900/30 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl px-2.5 py-1 transition-all">
                        <Trash2 className="w-3 h-3" /> Hapus Semua
                      </button>
                    )}
                  </div>
                  
                  {photos.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {photos.map((photo, idx) => (
                         <div
                          key={photo.id}
                          className="relative group bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-slate-800 rounded-2xl w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                        >
                          <img
                            src={photo.src}
                            alt={`Foto ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {/* Overlay badge */}
                          <div className="absolute top-1.5 left-1.5 bg-slate-950/80 backdrop-blur text-white text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-lg">
                            Slot {idx + 1}
                          </div>
                          {/* Delete button */}
                          <button
                            onClick={() => removePhoto(photo.id)}
                            className="absolute top-1.5 right-1.5 w-6 h-6 bg-slate-950/80 backdrop-blur text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 rounded-[2rem] flex flex-col items-center justify-center py-10 px-4 text-center">
                      <ImageIcon className="w-8 h-8 text-slate-400 mb-2 animate-pulse" />
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Belum ada foto</p>
                      <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">Gunakan kamera atau upload untuk mulai.</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Bottom CTA */}
            {photos.length > 0 && (
              <button
                onClick={() => goToStep(2)}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/15 transition-all duration-300 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
              >
                Lanjut ke Edit <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </main>
        )}

        {/* ==================== STEP 2: EDIT ==================== */}
        {currentStep === 2 && (
          <main className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start pb-32">

            {/* CANVAS AREA */}
            <section className="relative z-10 w-full lg:col-span-7 order-1">
              {isProcessing ? (
                <div className="w-full aspect-[3/4] flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-lg">
                  <Loader2 className="w-8 h-8 text-orange-500 animate-spin mb-3" />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Menganalisa Frame...</p>
                </div>
              ) : (
                <div className="w-full bg-slate-50/10 dark:bg-white/5 p-4 md:p-6 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] relative flex flex-col items-center justify-center min-h-[400px]">
                  <CanvasComposer
                    canvasRef={canvasRef}
                    frameImage={frameImage}
                    photos={photos}
                    transparentBoxes={transparentBoxes}
                    photoAdjustments={photoAdjustments}
                    stickers={stickers}
                    setStickers={setStickers}
                  />
                  <div className="mt-6 flex flex-wrap justify-center gap-4 md:gap-6 text-[9px] md:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pb-1">
                    <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-orange-500" /> Layer Stiker</span>
                    <span className="flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-orange-500" /> Filter Canggih</span>
                  </div>
                </div>
              )}
            </section>

            {/* TOOLS COLUMN */}
            <div className="flex flex-col gap-5 lg:col-span-5 order-2">
              {/* LAYER MANAGEMENT */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 px-1">
                  <Settings2 className="w-5 h-5 text-orange-500" />
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Pengaturan Foto</h3>
                </div>
                
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-[2rem] shadow-sm shadow-slate-100 dark:shadow-none">
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mb-4 uppercase tracking-wider leading-relaxed">
                    Gunakan tombol <strong className="text-orange-500">Edit</strong> untuk geser, zoom, dan memberi filter warna pada masing-masing foto.
                  </p>

                  <ScrollArea className="h-[300px] md:h-[400px] pr-3">
                    {photos.length > 0 ? (
                      <div className="space-y-3">
                        {photos.map((photo, idx) => (
                          <div key={photo.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:shadow-md hover:border-orange-200 transition-all duration-300">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <img src={photo.src} alt="Uploaded" className="w-12 h-12 md:w-14 md:h-14 border border-slate-200 dark:border-slate-800 rounded-xl object-cover bg-slate-50 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-800 dark:text-white truncate">Slot {idx + 1}</p>
                                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 truncate">Foto {idx + 1}</p>
                              </div>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                              <button
                                onClick={() => setEditingPhotoId(photo.id)}
                                className="flex-1 sm:flex-none px-3 h-9 flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white rounded-xl active:scale-95 transition-all duration-300 text-[10px] font-bold uppercase tracking-wider gap-1.5"
                                title="Edit Foto & Filter"
                              >
                                <Settings2 size={14} strokeWidth={2.5} />
                                <span>Edit</span>
                              </button>
                              <button
                                onClick={() => movePhoto(idx, idx - 1)}
                                disabled={idx === 0}
                                className="w-9 h-9 flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-orange-200 hover:text-orange-500 active:scale-95 disabled:opacity-30 rounded-xl transition-all duration-300"
                                title="Pindah ke Atas"
                              >
                                <MoveUp size={14} strokeWidth={2.5} />
                              </button>
                              <button
                                onClick={() => movePhoto(idx, idx + 1)}
                                disabled={idx === photos.length - 1}
                                className="w-9 h-9 flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-orange-200 hover:text-orange-500 active:scale-95 disabled:opacity-30 rounded-xl transition-all duration-300"
                                title="Pindah ke Bawah"
                              >
                                <MoveDown size={14} strokeWidth={2.5} />
                              </button>
                              <button
                                onClick={() => removePhoto(photo.id)}
                                className="w-9 h-9 flex items-center justify-center bg-red-50 dark:bg-red-950/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl border border-red-100 dark:border-red-900/30 active:scale-95 transition-all duration-300"
                                title="Hapus"
                              >
                                <Trash2 size={14} strokeWidth={2.5} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full opacity-40 bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-slate-800 py-12 rounded-2xl">
                        <ImageIcon size={32} className="mb-3 text-slate-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Belum ada foto</span>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </section>

              {/* AMBIL FOTO ULANG */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2 px-1">
                  <Camera className="w-5 h-5 text-orange-500" />
                  <h3 className="font-extrabold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Ambil Foto Ulang</h3>
                </div>
                <PhotoUploader
                  onPhotoAdd={addPhoto}
                  boxCount={transparentBoxes.length}
                  uploadedPhotos={photos.length}
                  photos={photos}
                  onNextStep={() => goToStep(2)}
                  onPhotoRemove={removePhoto}
                />
              </section>

              {/* FINISH BUTTON */}
              <button
                onClick={() => goToStep(3)}
                disabled={photos.length === 0}
                className="w-full py-4 mt-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/15 transition-all duration-300 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-40 disabled:scale-100 disabled:shadow-none"
              >
                <CheckCircle2 className="w-4 h-4" /> Selesai — Lihat Hasil
              </button>
            </div>
          </main>
        )}

        {/* ==================== STEP 3: RESULT ==================== */}
        {currentStep === 3 && (
          <main className="max-w-4xl mx-auto p-4 md:p-8 pb-32 space-y-6 relative z-10">

            {/* Title */}
            <div className="text-center space-y-2 border border-slate-100 dark:border-slate-800 p-6 bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm shadow-slate-100 dark:shadow-none">
              <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight uppercase">🎉 Foto Kamu Sudah Jadi!</h2>
              <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Simpan, bagikan, atau buat GIF dari foto-foto kamu</p>
            </div>

            {/* Canvas Preview (read-only) */}
            <div className="w-full bg-slate-50/10 dark:bg-white/5 p-4 md:p-6 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] relative flex items-center justify-center min-h-[300px]">
              <CanvasComposer
                canvasRef={canvasRef}
                frameImage={frameImage}
                photos={photos}
                transparentBoxes={transparentBoxes}
                photoAdjustments={photoAdjustments}
                stickers={stickers}
                setStickers={setStickers}
              />
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button
                onClick={downloadComposite}
                className="flex flex-col items-center justify-center gap-3 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm shadow-slate-100 dark:shadow-none hover:border-orange-300 hover:shadow-md hover:shadow-orange-500/5 transition-all duration-300 active:scale-95 group"
              >
                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/20 border border-orange-100/50 dark:border-orange-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Download className="text-orange-600 dark:text-orange-400" size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Download</span>
              </button>

              <button
                onClick={handleGenerateGif}
                disabled={photos.length === 0}
                className="flex flex-col items-center justify-center gap-3 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm shadow-slate-100 dark:shadow-none hover:border-orange-300 hover:shadow-md hover:shadow-orange-500/5 transition-all duration-300 active:scale-95 group disabled:opacity-40"
              >
                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/20 border border-orange-100/50 dark:border-orange-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Film className="text-orange-600 dark:text-orange-400" size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Live Photo</span>
              </button>

              <button
                onClick={handleGenerateQr}
                className="flex flex-col items-center justify-center gap-3 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm shadow-slate-100 dark:shadow-none hover:border-orange-300 hover:shadow-md hover:shadow-orange-500/5 transition-all duration-300 active:scale-95 group"
              >
                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/20 border border-orange-100/50 dark:border-orange-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <QrCode className="text-orange-600 dark:text-orange-400" size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Scan QR</span>
              </button>

              <button
                onClick={() => goToStep(2)}
                className="flex flex-col items-center justify-center gap-3 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm shadow-slate-100 dark:shadow-none hover:border-orange-300 hover:shadow-md hover:shadow-orange-500/5 transition-all duration-300 active:scale-95 group"
              >
                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/20 border border-orange-100/50 dark:border-orange-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wand2 className="text-orange-600 dark:text-orange-400" size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Edit Lagi</span>
              </button>
            </div>

            {/* Email Section */}
            <div className="bg-white dark:bg-slate-900 p-6 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm shadow-slate-100 dark:shadow-none space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <Mail className="w-4 h-4 text-orange-500" />
                <h3 className="font-bold text-[13px] text-slate-800 dark:text-white uppercase tracking-wider">Kirim ke Email</h3>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="email"
                    placeholder="Masukkan alamat email..."
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl text-slate-800 dark:text-white pl-10 pr-4 py-3.5 outline-none focus:border-orange-500 transition-all text-sm font-bold placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                <button
                  onClick={handleSendEmail}
                  disabled={isSendingEmail}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white px-6 font-bold uppercase tracking-wider text-xs rounded-2xl shadow-md shadow-orange-500/10 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50 flex items-center justify-center min-w-[90px]"
                >
                  {isSendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : "Kirim"}
                </button>
              </div>

              {emailSuccess && (
                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/20 p-3.5 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Foto berhasil dikirim ke emailmu!</span>
                </div>
              )}
            </div>

            {/* Selesai Button */}
            <div className="pt-4">
              <Link
                href="/frames"
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/15 hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
              >
                Selesai & Kembali ke Awal <CheckCircle2 size={18} />
              </Link>
            </div>
          </main>
        )}
      </div>

      {/* ================= MODAL EDITOR FOTO ================= */}
      {editingPhotoId && photoToEdit && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-[400px] md:max-w-4xl animate-in zoom-in-95 duration-300 relative border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-0 md:p-4">
            <button
              onClick={() => setEditingPhotoId(null)}
              className="absolute -top-3 -right-3 w-9 h-9 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white hover:text-orange-500 rounded-full flex items-center justify-center transition-colors shadow-md z-10"
            >
              <X size={18} strokeWidth={2.5} />
            </button>
            <PhotoEditor
              photoId={photoToEdit.id}
              photoSrc={photoToEdit.src}
              onAdjustment={handleAdjustmentSave}
            />
          </div>
        </div>
      )}

      {/* ================= MODAL QR CODE ================= */}
      {showQrModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 p-8 border border-slate-100 dark:border-slate-800 w-full max-w-sm text-center shadow-2xl rounded-[2.5rem] relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg transition-colors"
            >
              <X size={16} strokeWidth={3} />
            </button>

            <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/20 border border-orange-100/50 dark:border-orange-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <QrCode size={24} className="text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1 uppercase tracking-wider">Scan QR Code</h3>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-6">Scan dengan HP untuk download foto langsung</p>

            {isGeneratingQr ? (
              <div className="py-12 flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Membuat QR Code...</p>
              </div>
            ) : qrDataUrl ? (
              <div className="space-y-4">
                <div className="bg-white p-4 border border-slate-200 inline-block rounded-2xl shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrDataUrl} alt="QR Code" className="w-52 h-52 mx-auto" />
                </div>
                {qrShareUrl && (
                  <div className="bg-slate-50 dark:bg-white/5 p-3.5 border border-slate-100 dark:border-slate-800 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 border-b border-slate-100 dark:border-slate-800 pb-1">Link Share</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 font-bold break-all mt-2">{qrShareUrl}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={downloadQr}
                    className="flex-1 py-3 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-[11px] uppercase tracking-wider hover:text-orange-500 hover:border-orange-200 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download size={14} /> Simpan QR
                  </button>
                  <button
                    onClick={() => { if (qrShareUrl) navigator.clipboard.writeText(qrShareUrl).then(() => alert("Link disalin!")) }}
                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-[11px] uppercase tracking-wider hover:opacity-95 rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <Share2 size={14} /> Salin Link
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-bold uppercase tracking-wider">Link berlaku 24 jam</p>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ================= MODAL GIF ================= */}
      {showGifModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 p-6 md:p-8 border border-slate-100 dark:border-slate-800 w-full max-w-sm md:max-w-3xl text-center md:text-left shadow-2xl rounded-[2.5rem] relative animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowGifModal(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg transition-colors z-10"
            >
              <X size={16} strokeWidth={3} />
            </button>

            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center">
              
              {/* LEFT COLUMN: PREVIEW/LOADING */}
              <div className="w-full md:w-1/2 flex items-center justify-center">
                {isGeneratingGif ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-6 w-full min-h-[300px] bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                    <div className="w-full max-w-[200px]">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{getGifLoadingText(gifProgress)}</span>
                        <span className="text-[10px] font-bold text-slate-800 dark:text-white">{gifProgress}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                          style={{ width: `${gifProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : gifDataUrl ? (
                  <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-slate-800 overflow-hidden p-2 w-full rounded-2xl shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={gifDataUrl} alt="GIF Preview" className="w-full border border-slate-200 dark:border-slate-800 rounded-xl object-contain" />
                  </div>
                ) : (
                  <div className="w-full aspect-[3/4] bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center">
                    <Film className="w-8 h-8 opacity-20" />
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: INFO & ACTIONS */}
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-start mt-2 md:mt-0">
                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-950/20 border border-orange-100/50 dark:border-orange-900/30 rounded-2xl flex items-center justify-center mb-5 mx-auto md:mx-0">
                  <Film size={24} className="text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2 uppercase tracking-wider">Live Photo GIF</h3>
                <p className="text-slate-400 dark:text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-8 text-center md:text-left leading-relaxed max-w-sm">
                  Foto-foto kamu kini jadi animasi keren! Simpan dan bagikan momen seru ini.
                </p>

                {gifDataUrl && !isGeneratingGif && (
                  <button
                    onClick={downloadGif}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-500/15 transition-all duration-300 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Download size={18} /> Download GIF
                  </button>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default function StudioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950 m-4 flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-orange-500" /></div>}>
      <StudioPageContent />
    </Suspense>
  )
}