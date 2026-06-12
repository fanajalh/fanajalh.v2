"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Layout,
  ArrowRight,
  Monitor,
  Loader2,
  Upload,
  X,
  ImagePlus,
  Link2,
  FileImage,
  LogIn,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

type FrameItem = {
  id: string
  name: string
  image: string
  description: string
  slots: number
  uploaderName?: string
}

const DEFAULT_FRAMES: FrameItem[] = []

export default function FrameSelectionPage() {
  const { data: session, status: authStatus } = useSession()
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null)
  const [frames, setFrames] = useState<FrameItem[]>(DEFAULT_FRAMES)
  const [loading, setLoading] = useState(true)

  // Upload modal
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadMode, setUploadMode] = useState<"url" | "file">("file")
  const [uploadForm, setUploadForm] = useState({
    name: "",
    description: "",
    image_url: "",
    slots: 4,
  })
  const [previewFile, setPreviewFile] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null) // base64 data URL
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch("/api/frames")
        const json = await res.json()
        if (!cancelled && json.success && Array.isArray(json.data) && json.data.length > 0) {
          setFrames(
            json.data.map((r: { slug: string; name: string; image_url: string; description: string | null; slots: number; uploader_name?: string }) => ({
              id: r.slug,
              name: r.name,
              image: r.image_url,
              description: r.description || "",
              slots: r.slots ?? 4,
              uploaderName: r.uploader_name || null,
            }))
          )
        }
      } catch {
        /* fallback DEFAULT_FRAMES */
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const fetchFrames = async () => {
    try {
      const res = await fetch("/api/frames")
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setFrames(
          json.data.map((r: any) => ({
            id: r.slug,
            name: r.name,
            image: r.image_url,
            description: r.description || "",
            slots: r.slots ?? 4,
            uploaderName: r.uploader_name || null,
          }))
        )
      }
    } catch { /* ignore */ }
  }

  const handleStartStudio = () => {
    if (selectedFrame) {
      window.location.href = `/studio?frameId=${encodeURIComponent(selectedFrame)}`
    }
  }

  const handleUploadClick = () => {
    if (authStatus === "loading") return
    if (!session) {
      // Redirect to login
      window.location.href = `/loginUser?callbackUrl=${encodeURIComponent("/frames")}`
      return
    }
    setShowUpload(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar. Maksimal 2MB.")
      return
    }
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa gambar (PNG, JPG, WebP, dll).")
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setPreviewFile(result)
      setSelectedFile(result)
    }
    reader.readAsDataURL(file)
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)
    try {
      const payload: any = {
        name: uploadForm.name,
        description: uploadForm.description,
        slots: uploadForm.slots,
      }

      if (uploadMode === "file" && selectedFile) {
        payload.image_file = selectedFile
      } else if (uploadMode === "url" && uploadForm.image_url) {
        payload.image_url = uploadForm.image_url
      } else {
        toast.error("Pilih gambar terlebih dahulu")
        setUploading(false)
        return
      }

      const res = await fetch("/api/frames/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const json = await res.json()

      if (!res.ok) {
        toast.error(json.message || "Gagal mengupload frame")
        return
      }

      toast.success("Frame berhasil diupload! 🎉", {
        description: "Frame kamu langsung tampil di halaman ini.",
      })
      setShowUpload(false)
      resetUploadForm()
      fetchFrames()
    } catch {
      toast.error("Jaringan bermasalah, coba lagi.")
    } finally {
      setUploading(false)
    }
  }

  const resetUploadForm = () => {
    setUploadForm({ name: "", description: "", image_url: "", slots: 4 })
    setPreviewFile(null)
    setSelectedFile(null)
    setUploadMode("file")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="bg-white dark:bg-black min-h-screen pb-28 font-sans select-none relative overflow-x-hidden selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Background Decor (Grid) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),dark:linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0"></div>

      <header className="sticky top-0 z-50 w-full bg-white dark:bg-black border-b-2 border-black dark:border-white px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center bg-transparent border-2 border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-black dark:bg-white p-1.5 border border-black dark:border-white">
              <Camera className="w-4 h-4 text-white dark:text-black" />
            </div>
            <h1 className="font-black text-black dark:text-white text-[15px] uppercase tracking-widest">PhotoStudio</h1>
          </div>
        </div>

        {/* Upload button in header */}
        <button
          onClick={handleUploadClick}
          className="inline-flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-white font-bold text-xs uppercase tracking-widest hover:bg-transparent dark:hover:bg-transparent hover:text-black dark:hover:text-white transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
        >
          {session ? (
            <>
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Frame</span>
              <span className="sm:hidden">Upload</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Login & Upload</span>
              <span className="sm:hidden">Login</span>
            </>
          )}
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-5 md:p-10 flex flex-col gap-8 relative z-10">
        <div className="text-center mt-2 mb-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-transparent border-2 border-black dark:border-white mb-4">
            <Layout className="w-6 h-6 text-black dark:text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white tracking-tight uppercase">
            Pilih <span className="text-orange-500">Bingkai</span>
          </h2>
          <p className="text-[12px] text-gray-500 dark:text-gray-400 font-bold mt-2 uppercase tracking-widest">
            Pilih desain frame untuk photobooth Anda
          </p>
          {loading && (
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-4 flex items-center justify-center gap-2 font-bold uppercase tracking-widest">
              <Loader2 className="w-4 h-4 animate-spin" /> Memuat frame…
            </p>
          )}
        </div>

        {/* Upload CTA Banner */}
        <div className="bg-white dark:bg-black border-2 border-black dark:border-white shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] p-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-black dark:bg-white border-2 border-black dark:border-white mb-4">
            <ImagePlus className="w-6 h-6 text-white dark:text-black" />
          </div>
          <h3 className="font-black text-black dark:text-white text-xl md:text-2xl uppercase tracking-widest mb-2">Punya desain frame sendiri?</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-6 uppercase tracking-wider">Upload frame kamu dan langsung pakai di PhotoStudio!</p>
          <button
            onClick={handleUploadClick}
            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-black dark:border-white text-black dark:text-white font-black text-sm uppercase tracking-widest hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all active:scale-95 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
          >
            {session ? (
              <>
                <Upload className="w-4 h-4" /> Upload Sekarang
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Login untuk Upload
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {frames.map((frame) => (
            <div
              key={frame.id}
              className={`relative bg-white dark:bg-black p-5 transition-all duration-300 border-2 border-black dark:border-white cursor-pointer ${
                selectedFrame === frame.id
                  ? "shadow-[10px_10px_0px_0px_rgba(249,115,22,1)] -translate-y-1"
                  : "shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]"
              }`}
              onClick={() => setSelectedFrame(frame.id)}
            >
              {/* User upload badge */}
              {frame.uploaderName && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black dark:bg-white text-white dark:text-black text-[9px] font-black uppercase tracking-wider border-2 border-black dark:border-white">
                    <Upload className="w-2.5 h-2.5" /> Community
                  </span>
                </div>
              )}
              <div className="flex xl:flex-col gap-5 items-center xl:items-start text-center xl:text-left">
                <div className="w-24 h-32 xl:w-full xl:h-48 xl:aspect-[3/4] shrink-0 bg-gray-50 dark:bg-white/5 border-2 border-black dark:border-white flex items-center justify-center overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={frame.image}
                    alt={frame.name}
                    className="max-w-full max-h-[90%] xl:p-4 object-contain transition-transform duration-700 hover:scale-110"
                  />
                  {selectedFrame === frame.id && (
                    <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-orange-500 text-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-50">
                        <CheckCircle2 size={32} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center xl:w-full items-start xl:items-center">
                  <span className="bg-transparent border-b-2 border-black dark:border-white text-black dark:text-white px-2 py-1 text-[10px] font-black uppercase tracking-widest w-max mb-3">
                    {frame.slots} Photos
                  </span>
                  <h3 className="font-black text-black dark:text-white text-xl uppercase tracking-widest leading-tight mb-2 text-left xl:text-center">
                    {frame.name}
                  </h3>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 text-left xl:text-center uppercase tracking-wider">
                    {frame.description}
                  </p>
                  {frame.uploaderName && (
                    <p className="text-[10px] text-black dark:text-white font-bold mt-2 uppercase tracking-widest bg-gray-100 dark:bg-white/10 px-2 py-1">
                      by {frame.uploaderName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-xl mx-auto w-full flex flex-col sm:flex-row gap-6">
          <Link href="/" className="w-full sm:w-1/3">
            <Button
              variant="ghost"
              className="w-full py-8 border-2 border-black dark:border-white rounded-none text-[15px] font-black text-black dark:text-white uppercase tracking-widest hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)]"
            >
              Batalkan
            </Button>
          </Link>
          <Button
            onClick={handleStartStudio}
            disabled={!selectedFrame}
            className="w-full sm:w-2/3 py-8 bg-orange-500 hover:bg-orange-600 text-black border-2 border-black dark:border-white rounded-none text-[15px] font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
          >
            Lanjut ke Studio <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4 pb-6">
          <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-300 uppercase tracking-widest">
            <Layout className="w-3 h-3 text-orange-400" /> Auto Crop
          </div>
          <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-300 uppercase tracking-widest">
            <Monitor className="w-3 h-3 text-blue-400" /> Export HQ
          </div>
        </div>
      </main>

      {/* ============== UPLOAD MODAL ============== */}
      {showUpload && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-white/80 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-black border-4 border-black dark:border-white shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] dark:shadow-[15px_15px_0px_0px_rgba(255,255,255,1)] w-full max-w-lg max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-300">
            {/* Header pattern */}
            <div className="absolute top-0 left-0 w-full h-12 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.1)_25%,rgba(0,0,0,0.1)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.1)_75%,rgba(0,0,0,0.1)_100%)] dark:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%,rgba(255,255,255,0.1)_100%)] bg-[length:10px_10px] pointer-events-none" />

            <div className="p-8 relative z-10 mt-6">
              <button
                type="button"
                onClick={() => { setShowUpload(false); resetUploadForm() }}
                className="absolute top-0 right-4 p-2 border-2 border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-black dark:bg-white border-2 border-black dark:border-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                  <Upload className="w-7 h-7 text-white dark:text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-black dark:text-white uppercase tracking-widest leading-none">Upload Frame</h3>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mt-1">Frame akan langsung tampil di halaman</p>
                </div>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-6">
                {/* Nama Frame */}
                <div>
                  <label className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest border-b-2 border-black dark:border-white inline-block mb-2">Nama Frame *</label>
                  <input
                    required
                    value={uploadForm.name}
                    onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                    className="w-full px-4 py-4 border-2 border-black dark:border-white text-sm font-bold text-black dark:text-white bg-transparent focus:bg-gray-50 dark:focus:bg-white/5 focus:outline-none transition-all placeholder:text-gray-400"
                    placeholder="CONTOH: CHERRY BLOSSOM PINK"
                    disabled={uploading}
                  />
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest border-b-2 border-black dark:border-white inline-block mb-2">Deskripsi</label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    className="w-full px-4 py-4 border-2 border-black dark:border-white text-sm font-bold text-black dark:text-white bg-transparent focus:bg-gray-50 dark:focus:bg-white/5 focus:outline-none transition-all min-h-[90px] resize-none placeholder:text-gray-400"
                    placeholder="Deskripsi singkat frame kamu..."
                    disabled={uploading}
                  />
                </div>

                {/* Image Mode Toggle */}
                <div>
                  <label className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest border-b-2 border-black dark:border-white inline-block mb-3">Gambar Frame *</label>
                  <div className="flex gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setUploadMode("file")}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] uppercase tracking-widest font-black transition-all border-2 border-black dark:border-white ${
                        uploadMode === "file"
                          ? "bg-black text-white dark:bg-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                          : "bg-transparent text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                      }`}
                    >
                      <FileImage size={16} /> Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode("url")}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] uppercase tracking-widest font-black transition-all border-2 border-black dark:border-white ${
                        uploadMode === "url"
                          ? "bg-black text-white dark:bg-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]"
                          : "bg-transparent text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/10"
                      }`}
                    >
                      <Link2 size={16} /> Pakai URL
                    </button>
                  </div>

                  {uploadMode === "file" ? (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={uploading}
                      />
                      {previewFile ? (
                        <div className="relative">
                          <div className="w-full h-48 bg-gray-50 dark:bg-white/5 border-2 border-black dark:border-white flex items-center justify-center overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={previewFile} alt="Preview" className="max-w-full max-h-full object-contain p-4" />
                          </div>
                          <button
                            type="button"
                            onClick={() => { setPreviewFile(null); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = "" }}
                            className="absolute top-2 right-2 p-2 border-2 border-black bg-white text-black hover:bg-black hover:text-white transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-40 border-2 border-dashed border-black dark:border-white bg-transparent flex flex-col items-center justify-center gap-3 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                        >
                          <ImagePlus size={36} />
                          <span className="text-[11px] font-black uppercase tracking-widest">Klik untuk pilih gambar</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">PNG, JPG, WebP • Maks 2MB</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        value={uploadForm.image_url}
                        onChange={(e) => setUploadForm({ ...uploadForm, image_url: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-mono text-slate-900 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-orange-500/15 focus:border-orange-500 transition-all outline-none"
                        placeholder="https://cdn.example.com/frame.png"
                        disabled={uploading}
                      />
                      {uploadForm.image_url && (
                        <div className="mt-2 w-full h-36 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={uploadForm.image_url}
                            alt="Preview URL"
                            className="max-w-full max-h-full object-contain p-4"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                  {/* Slots */}
                  <div>
                    <label className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest border-b-2 border-black dark:border-white inline-block mb-2">Jumlah Foto (Slots)</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={uploadForm.slots}
                      onChange={(e) => setUploadForm({ ...uploadForm, slots: parseInt(e.target.value, 10) || 4 })}
                      className="w-full px-4 py-4 border-2 border-black dark:border-white text-sm font-bold text-black dark:text-white bg-transparent focus:bg-gray-50 dark:focus:bg-white/5 focus:outline-none transition-all"
                      disabled={uploading}
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full py-5 bg-black dark:bg-white text-white dark:text-black font-black text-[13px] uppercase tracking-widest border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-4"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Mengupload...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" /> Upload Frame
                      </>
                    )}
                  </button>
                </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
