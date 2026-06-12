"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Camera, 
  Upload, 
  X, 
  FlipHorizontal, 
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Timer,
  ArrowRight,
} from "lucide-react"

interface PhotoUploaderProps {
  onPhotoAdd: (photo: { id: string; src: string; boxIndex: number }) => void
  boxCount: number
  uploadedPhotos: number
  photos?: { id: string; src: string; boxIndex: number }[]
  onNextStep?: () => void
  onPhotoRemove?: (id: string) => void
}

export default function PhotoUploader({ onPhotoAdd, boxCount, uploadedPhotos, photos, onNextStep, onPhotoRemove }: PhotoUploaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [mirror, setMirror] = useState(false)
  const [cameraError, setCameraError] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null)

  // Timer states
  const [timerDuration, setTimerDuration] = useState(3) // 3 detik default
  const [countdown, setCountdown] = useState<number | null>(null)
  const [flashEffect, setFlashEffect] = useState(false)
  const countdownRef = useRef<NodeJS.Timeout | null>(null)

  const remainingSlots = boxCount - uploadedPhotos
  const progressValue = (uploadedPhotos / boxCount) * 100

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    return () => {
      stopCamera()
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [])

  const startCamera = async () => {
    if (remainingSlots <= 0) return
    setCameraError("")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      })
      streamRef.current = stream
      setShowCamera(true)

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch((err) => {
            console.error("Video play failed:", err)
            setCameraError("Gagal memutar video. Silakan coba lagi.")
          })
        }
      }, 100)
    } catch (err) {
      console.error("Camera error:", err)
      setCameraError("Akses kamera ditolak. Periksa izin browser Anda.")
    }
  }

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setShowCamera(false)
    setCameraError("")
    setCountdown(null)
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
  }

  const doCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")!

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    ctx.save()
    if (mirror) {
      ctx.translate(canvas.width, 0)
      ctx.scale(-1, 1)
    }
    ctx.drawImage(video, 0, 0)
    ctx.restore()

    // Flash effect
    setFlashEffect(true)
    setTimeout(() => setFlashEffect(false), 400)

    const src = canvas.toDataURL("image/png")
    onPhotoAdd({
      id: `camera_${Date.now()}`,
      src,
      boxIndex: uploadedPhotos,
    })

    // Don't close camera automatically so user can keep taking photos
    // stopCamera()
  }, [mirror, onPhotoAdd, uploadedPhotos])

  const startCountdown = useCallback(() => {
    if (countdown !== null) return // already counting

    if (timerDuration === 0) {
      // Instant capture
      doCapture()
      return
    }

    setCountdown(timerDuration)
    let remaining = timerDuration

    countdownRef.current = setInterval(() => {
      remaining -= 1
      if (remaining <= 0) {
        if (countdownRef.current) clearInterval(countdownRef.current)
        countdownRef.current = null
        setCountdown(null)
        doCapture()
      } else {
        setCountdown(remaining)
      }
    }, 1000)
  }, [timerDuration, countdown, doCapture])

  const cancelCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current)
      countdownRef.current = null
    }
    setCountdown(null)
  }

  const uploadFile = (file: File) => {
    if (!(file instanceof Blob)) return
    if (remainingSlots <= 0) return

    const reader = new FileReader()
    reader.onload = () => {
      onPhotoAdd({
        id: `upload_${Date.now()}`,
        src: reader.result as string,
        boxIndex: uploadedPhotos,
      })
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (remainingSlots > 0 && !showCamera) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadFile(e.dataTransfer.files[0])
    }
  }

  if (showCamera && mounted) {
    const modalContent = (
      <div className="fixed inset-0 z-[99999] bg-black/95 flex flex-col items-center justify-center p-0 md:p-10 animate-in fade-in duration-300">
        <div className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-7xl bg-white dark:bg-black md:border-4 border-black dark:border-white md:rounded-none flex flex-col overflow-hidden relative">
          
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
            {/* Viewfinder Area */}
          <div className="relative flex-none h-[45vh] md:h-auto md:flex-1 bg-black flex items-center justify-center overflow-hidden">
            <video 
              ref={videoRef} 
              className={`w-full h-full object-cover md:object-contain ${mirror ? "-scale-x-100" : ""}`} 
              playsInline 
              muted 
            />
            
            {/* Viewfinder Overlays */}
            <div className="absolute inset-0 border-[8px] md:border-[16px] border-black pointer-events-none" />
            
            {/* Live Badge */}
            <div className="absolute top-4 md:top-8 left-4 md:left-8 flex items-center gap-2 bg-black border-2 border-white px-3 py-1.5 text-white text-[10px] font-black uppercase tracking-widest">
              <div className="w-2 h-2 bg-red-500 animate-pulse" />
              Live View
            </div>

            {/* Timer Badge */}
            <div className="absolute top-4 md:top-8 right-4 md:right-8 flex items-center gap-1.5 bg-black border-2 border-white px-3 py-1.5 text-white text-[10px] font-black">
              <Timer className="w-3 h-3" />
              {timerDuration}s
            </div>

            {/* Flash Effect */}
            {flashEffect && (
              <div className="absolute inset-0 bg-white animate-out fade-out duration-400 pointer-events-none z-50" />
            )}

            {/* Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-40">
                <div className="relative">
                  {/* Pulse ring */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-36 h-36 md:w-56 md:h-56 border-4 border-white/30 rounded-full animate-ping" />
                  </div>
                  {/* Ring progress */}
                  <svg className="w-36 h-36 md:w-56 md:h-56 -rotate-90" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="60" fill="none" stroke="white" strokeOpacity="0.15" strokeWidth="6" />
                    <circle 
                      cx="70" cy="70" r="60" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 60}`}
                      strokeDashoffset={`${2 * Math.PI * 60 * (1 - countdown / timerDuration)}`}
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  {/* Number */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl md:text-9xl font-black text-white drop-shadow-2xl animate-in zoom-in-50 duration-300" key={countdown}>
                      {countdown}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />

          {/* Controls Area */}
          <div className="w-full md:w-80 lg:w-96 p-4 md:p-8 space-y-4 md:space-y-6 bg-white dark:bg-black border-t-4 md:border-t-0 md:border-l-4 border-black dark:border-white flex-1 md:flex-none flex flex-col justify-start md:justify-center overflow-y-auto min-h-0">
            <div className="hidden md:block text-center border-b-4 border-black dark:border-white pb-4 shrink-0">
              <h3 className="text-2xl font-black uppercase tracking-widest text-black dark:text-white">Studio</h3>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Camera Mode</p>
            </div>

            {cameraError && (
              <div className="flex items-center gap-2 bg-gray-100 border-2 border-black p-3 text-black text-xs font-bold uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {cameraError}
              </div>
            )}

            {/* Timer Selection */}
            <div className="flex flex-wrap items-center justify-center gap-2 border-b-4 border-black dark:border-white pb-4 md:pb-6 shrink-0">
              <span className="w-full text-center text-[10px] font-black text-black dark:text-white uppercase tracking-widest mr-1 mb-1 md:mb-2">
                <Timer className="w-3 h-3 inline mr-1" />Timer Set
              </span>
              {[0, 3, 5, 10].map((t) => (
                <button
                  key={t}
                  onClick={() => { setTimerDuration(t); cancelCountdown() }}
                  disabled={countdown !== null}
                  className={`flex-1 min-w-[50px] py-2 border-2 border-black dark:border-white text-xs font-black transition-all ${
                    timerDuration === t
                      ? "bg-black text-white dark:bg-white dark:text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] translate-y-[2px]"
                      : "bg-transparent text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                  } disabled:opacity-50`}
                >
                  {t === 0 ? "Off" : `${t}s`}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 md:gap-4 shrink-0">
              {countdown !== null ? (
                <Button 
                  onClick={cancelCountdown} 
                  className="w-full h-16 bg-white dark:bg-black text-black dark:text-white border-4 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-none text-lg font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-colors uppercase tracking-widest hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]"
                >
                  <X className="w-5 h-5 mr-2" />
                  Batal ({countdown})
                </Button>
              ) : (
                <Button 
                  onClick={startCountdown} 
                  disabled={photos && photos.length >= boxCount}
                  className="w-full h-16 bg-black dark:bg-white text-white dark:text-black border-4 border-black dark:border-white rounded-none text-lg font-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all uppercase tracking-widest hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:disabled:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
                >
                  <Camera className="w-6 h-6 mr-2" />
                  {photos && photos.length >= boxCount ? "Slot Penuh" : (timerDuration === 0 ? "Jepret" : `Mulai (${timerDuration}s)`)}
                </Button>
              )}
              
              <div className="flex gap-3 md:gap-4 mt-1 md:mt-2">
                <Button
                  onClick={() => setMirror((m) => !m)}
                  variant="outline"
                  disabled={countdown !== null}
                  className={`flex-1 h-14 rounded-none border-2 border-black dark:border-white transition-colors font-black uppercase tracking-widest ${mirror ? "bg-black text-white dark:bg-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]" : "bg-white text-black dark:bg-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"}`}
                >
                  <FlipHorizontal className="w-4 h-4 mr-2" />
                  Mirror
                </Button>
                <Button 
                  onClick={stopCamera} 
                  variant="ghost" 
                  className="flex-1 h-14 rounded-none border-2 border-black dark:border-white bg-white text-black dark:bg-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-black uppercase tracking-widest transition-colors"
                >
                  <X className="w-4 h-4 mr-2" />
                  Tutup
                </Button>
              </div>
            </div>
          </div>
          </div> {/* Closes flex-row wrapper */}

          {/* Bottom Bar: Thumbnails & Next Step */}
          {photos && photos.length > 0 && (
            <div className="bg-gray-100 dark:bg-white/5 border-t-4 border-black dark:border-white p-4 flex items-center justify-between shrink-0 overflow-hidden">
              <div className="flex items-center gap-3 overflow-x-auto overflow-y-hidden pr-4 flex-1">
                {photos.map((p, i) => (
                  <div key={p.id} className="relative shrink-0 group cursor-pointer" onClick={() => setPreviewPhoto(p.src)}>
                    <img src={p.src} alt={`Slot ${i + 1}`} className="w-14 h-14 md:w-16 md:h-16 object-cover border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]" />
                    <div className="absolute -top-2 -right-2 bg-black text-white dark:bg-white dark:text-black w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-black border border-white dark:border-black group-hover:opacity-0 transition-opacity">
                      {i + 1}
                    </div>
                    {onPhotoRemove && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onPhotoRemove(p.id); }} 
                        className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-full text-[9px] font-black border border-black dark:border-white transition-opacity z-10 hover:scale-110"
                        title="Hapus / Retake"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
                {photos.length < boxCount && (
                  <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 border-2 border-dashed border-black/30 dark:border-white/30 flex items-center justify-center bg-white/50 dark:bg-black/50">
                    <span className="text-xs font-black opacity-50">{photos.length + 1}</span>
                  </div>
                )}
              </div>
              
              {onNextStep && photos.length > 0 && (
                <Button 
                  onClick={() => { stopCamera(); onNextStep(); }}
                  className="shrink-0 bg-black dark:bg-white text-white dark:text-black hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white border-2 border-black dark:border-white hover:translate-y-1 transition-all rounded-none uppercase tracking-widest font-black text-[10px] md:text-xs h-12 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none whitespace-nowrap"
                >
                  <span className="hidden md:inline">Lanjut Edit</span>
                  <span className="md:hidden">Lanjut</span> 
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              )}
            </div>
          )}

          {/* Large Preview Overlay */}
          {previewPhoto && (
            <div 
              className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 md:p-8 animate-in zoom-in-95 duration-200" 
              onClick={() => setPreviewPhoto(null)}
            >
              <div className="relative max-w-full max-h-[85vh] flex flex-col items-center group cursor-pointer">
                <img 
                  src={previewPhoto} 
                  className="max-w-full max-h-[75vh] object-contain border-4 border-white dark:border-white bg-black" 
                  alt="Preview"
                />
                <Button 
                  className="mt-6 uppercase font-black tracking-widest rounded-none border-2 border-white bg-transparent hover:bg-white hover:text-black text-white px-8"
                  onClick={(e) => { e.stopPropagation(); setPreviewPhoto(null); }}
                >
                  <X className="w-4 h-4 mr-2" /> Tutup Preview
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    )
    
    return createPortal(modalContent, document.body)
  }

  return (
    <Card 
      className={`p-6 rounded-none space-y-6 transition-all duration-300 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] ${
        isDragging 
          ? "bg-gray-100 dark:bg-white/10 scale-[1.01]" 
          : "bg-white dark:bg-black"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Slot Status Section */}
      <div className="space-y-3 pointer-events-none">
        <div className="flex justify-between items-end px-1 border-b-2 border-black dark:border-white pb-2">
          <span className="text-xs font-black text-black dark:text-white uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-black dark:text-white" />
            Sisa Slot
          </span>
          <span className="text-sm font-black text-black dark:text-white">
            {uploadedPhotos} <span className="text-gray-400">/</span> {boxCount}
          </span>
        </div>
        <div className="h-3 w-full bg-gray-100 dark:bg-white/10 border-2 border-black dark:border-white overflow-hidden p-[1px]">
          <div 
            className="h-full bg-black dark:bg-white transition-all duration-500 ease-out"
            style={{ width: `${progressValue}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={startCamera}
          className="w-full bg-transparent hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black border-2 border-black dark:border-white text-black dark:text-white rounded-none py-7 text-sm font-black uppercase tracking-widest transition-all active:translate-y-1 disabled:opacity-50"
          disabled={remainingSlots <= 0}
        >
          <Camera className="w-5 h-5 mr-2" />
          Gunakan Kamera
        </Button>

        <label className="w-full block group relative">
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => e.target.files && uploadFile(e.target.files[0])}
            disabled={remainingSlots <= 0}
          />
          <div className={`absolute inset-0 z-0 bg-gray-100 dark:bg-white/10 transition-transform duration-300 ${isDragging ? "scale-105 opacity-100" : "opacity-0"}`} />
          <Button
            asChild
            disabled={remainingSlots <= 0}
            className={`w-full relative z-10 rounded-none py-4 md:py-7 h-auto text-[10px] md:text-sm font-black uppercase tracking-widest transition-all active:translate-y-1 disabled:opacity-50 whitespace-normal leading-tight ${
              isDragging 
                ? "bg-black text-white dark:bg-white dark:text-black pointer-events-none" 
                : "bg-black hover:bg-white hover:text-black dark:bg-white dark:text-black dark:hover:bg-black dark:hover:text-white text-white border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
            }`}
          >
            <div className="cursor-pointer flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-2 text-center w-full">
              <Upload className="w-5 h-5 shrink-0" />
              <span>{isDragging ? "Lepaskan Foto..." : "Unggah / Drag Foto"}</span>
            </div>
          </Button>
        </label>
      </div>

      {remainingSlots === 0 && (
        <div className="flex items-center gap-3 bg-gray-100 dark:bg-white/10 border-2 border-black dark:border-white p-4 text-black dark:text-white animate-in slide-in-from-top-2 duration-500">
          <div className="bg-black dark:bg-white text-white dark:text-black p-1 border-2 border-black dark:border-white">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-black uppercase tracking-widest">Siap Export!</span>
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Semua slot sudah terisi penuh.</span>
          </div>
        </div>
      )}
    </Card>
  )
}