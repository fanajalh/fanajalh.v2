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
    <div className="bg-[#f8fafc] dark:bg-slate-950 min-h-screen pb-28 font-sans select-none relative overflow-x-hidden selection:bg-orange-500 selection:text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0"></div>

      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-900 px-5 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-full shadow-sm text-slate-600 dark:text-slate-300 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50 transition-all"
          >
            <ArrowLeft className="w-5 h-5 pr-0.5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-orange-500 p-1.5 rounded-xl">
              <Camera className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-extrabold text-slate-800 dark:text-white text-sm tracking-tight">PhotoStudio</h1>
          </div>
        </div>

        {/* Upload button in header */}
        <button
          onClick={handleUploadClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-sm active:scale-95 transition-all"
        >
          {session ? (
            <>
              <Upload className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload Frame</span>
              <span className="sm:hidden">Upload</span>
            </>
          ) : (
            <>
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Login & Upload</span>
              <span className="sm:hidden">Login</span>
            </>
          )}
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-5 md:p-10 flex flex-col gap-8 relative z-10">
        <div className="text-center mt-2 mb-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl mb-4">
            <Layout className="w-6 h-6" />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
            Pilih <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">Bingkai</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-2 uppercase tracking-wider">
            Pilih desain frame untuk photobooth Anda
          </p>
          {loading && (
            <p className="text-[11px] text-slate-400 mt-4 flex items-center justify-center gap-2 font-bold uppercase tracking-widest">
              <Loader2 className="w-4 h-4 animate-spin text-orange-500" /> Memuat frame…
            </p>
          )}
        </div>

        {/* Upload CTA Banner */}
        <div className="bg-gradient-to-br from-orange-500/5 to-amber-500/5 border border-orange-100/30 dark:border-orange-950/15 rounded-[2rem] shadow-sm p-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-500 text-white rounded-2xl mb-4 shadow-md shadow-orange-500/15">
            <ImagePlus className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-xl md:text-2xl tracking-tight mb-2">Punya desain frame sendiri?</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mb-6">Upload frame kamu dan langsung pakai di PhotoStudio!</p>
          <button
            onClick={handleUploadClick}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-800 rounded-2xl font-bold text-sm hover:border-orange-500 hover:text-orange-600 active:scale-95 transition-all shadow-sm"
          >
            {session ? (
              <>
                <Upload className="w-4 h-4 text-orange-500" /> Upload Sekarang
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-orange-500" /> Login untuk Upload
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {frames.map((frame) => (
            <div
              key={frame.id}
              className={`relative bg-white dark:bg-slate-900/60 p-5 transition-all duration-300 border rounded-[2rem] cursor-pointer flex flex-col justify-between ${
                selectedFrame === frame.id
                  ? "border-orange-500 shadow-xl shadow-orange-500/5 bg-orange-50/10 dark:bg-orange-950/5 -translate-y-1.5"
                  : "border-slate-100 dark:border-slate-900 shadow-sm shadow-slate-100 dark:shadow-none hover:-translate-y-1.5 hover:shadow-lg hover:shadow-slate-150"
              }`}
              onClick={() => setSelectedFrame(frame.id)}
            >
              {/* User upload badge */}
              {frame.uploaderName && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-500 text-white text-[9px] font-extrabold uppercase tracking-wider rounded-xl">
                    <Upload className="w-2.5 h-2.5" /> Community
                  </span>
                </div>
              )}
              <div className="flex xl:flex-col gap-5 items-center xl:items-start text-center xl:text-left h-full">
                <div className="w-24 h-32 xl:w-full xl:h-48 xl:aspect-[3/4] shrink-0 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center justify-center overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={frame.image}
                    alt={frame.name}
                    className="max-w-full max-h-[90%] xl:p-4 object-contain transition-transform duration-700 hover:scale-105"
                  />
                  {selectedFrame === frame.id && (
                    <div className="absolute inset-0 bg-orange-500/10 flex items-center justify-center backdrop-blur-[1px]">
                      <div className="bg-orange-500 text-white p-2.5 rounded-full shadow-lg shadow-orange-500/25 animate-in zoom-in-50">
                        <CheckCircle2 size={24} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between h-full xl:w-full items-start xl:items-center">
                  <div className="xl:text-center">
                    <span className="bg-orange-50 dark:bg-orange-950/45 text-orange-600 dark:text-orange-400 px-3 py-1 text-[10px] font-extrabold uppercase rounded-lg w-max mb-3 inline-block">
                      {frame.slots} Photos
                    </span>
                    <h3 className="font-extrabold text-slate-800 dark:text-white text-lg tracking-tight mb-2 text-left xl:text-center">
                      {frame.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-450 dark:text-slate-400 text-left xl:text-center">
                      {frame.description}
                    </p>
                  </div>
                  {frame.uploaderName && (
                    <p className="text-[10px] text-orange-600 dark:text-orange-400 font-extrabold mt-4 uppercase bg-orange-50 dark:bg-orange-950/20 px-3 py-1.5 rounded-xl xl:mx-auto">
                      by {frame.uploaderName}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 max-w-xl mx-auto w-full flex flex-col sm:flex-row gap-4">
          <Link href="/" className="w-full sm:w-1/3">
            <Button
              variant="ghost"
              className="w-full py-7 border border-slate-200 dark:border-slate-800 rounded-2xl text-[15px] font-bold text-slate-600 dark:text-slate-350 hover:bg-slate-100 transition-all shadow-sm"
            >
              Batalkan
            </Button>
          </Link>
          <Button
            onClick={handleStartStudio}
            disabled={!selectedFrame}
            className="w-full sm:w-2/3 py-7 bg-gradient-to-r from-orange-500 to-amber-500 hover:opacity-95 text-white rounded-2xl text-[15px] font-extrabold shadow-md shadow-orange-500/15 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
          >
            Lanjut ke Studio <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-6 pt-4 pb-6">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <Layout className="w-3.5 h-3.5 text-orange-500" /> Auto Crop
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <Monitor className="w-3.5 h-3.5 text-orange-500" /> Export HQ
          </div>
        </div>
      </main>

      {/* ============== UPLOAD MODAL ============== */}
      {showUpload && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-300">
            <div className="p-8 relative z-10">
              <button
                type="button"
                onClick={() => { setShowUpload(false); resetUploadForm() }}
                className="absolute top-6 right-6 p-2 rounded-full border border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 hover:text-slate-850"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-orange-500 text-white rounded-2xl flex items-center justify-center shadow-md shadow-orange-500/15">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">Upload Frame</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">Frame akan langsung tampil di halaman</p>
                </div>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-6">
                {/* Nama Frame */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Nama Frame *</label>
                  <input
                    required
                    value={uploadForm.name}
                    onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                    className="w-full px-4 py-3.5 border border-slate-200/80 dark:border-slate-850 rounded-2xl text-sm font-semibold text-slate-800 dark:text-slate-200 bg-[#f8fafc] dark:bg-slate-950 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:outline-none transition-all placeholder:text-gray-405"
                    placeholder="Contoh: Cherry Blossom Pink"
                    disabled={uploading}
                  />
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Deskripsi</label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    className="w-full px-4 py-3.5 border border-slate-200/80 dark:border-slate-850 rounded-2xl text-sm font-semibold text-slate-800 dark:text-slate-200 bg-[#f8fafc] dark:bg-slate-950 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:outline-none transition-all min-h-[90px] resize-none placeholder:text-gray-405"
                    placeholder="Deskripsi singkat frame..."
                    disabled={uploading}
                  />
                </div>

                {/* Image Mode Toggle */}
                <div>
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-3">Gambar Frame *</label>
                  <div className="flex gap-3 mb-4 bg-slate-50 dark:bg-slate-950 p-1 rounded-2xl border border-slate-100 dark:border-slate-900">
                    <button
                      type="button"
                      onClick={() => setUploadMode("file")}
                      className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold transition-all rounded-xl ${
                        uploadMode === "file"
                          ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-100 dark:border-slate-800"
                          : "bg-transparent text-slate-500 hover:text-slate-950"
                      }`}
                    >
                      <FileImage size={16} className="text-orange-500" /> Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode("url")}
                      className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold transition-all rounded-xl ${
                        uploadMode === "url"
                          ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm border border-slate-100 dark:border-slate-800"
                          : "bg-transparent text-slate-500 hover:text-slate-950"
                      }`}
                    >
                      <Link2 size={16} className="text-orange-500" /> Pakai URL
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
                          <div className="w-full h-48 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-center justify-center overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={previewFile} alt="Preview" className="max-w-full max-h-full object-contain p-4" />
                          </div>
                          <button
                            type="button"
                            onClick={() => { setPreviewFile(null); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = "" }}
                            className="absolute top-2.5 right-2.5 p-2 bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800 rounded-full hover:text-red-500 shadow-sm"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-40 border border-dashed border-slate-200 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-950/40 rounded-2xl flex flex-col items-center justify-center gap-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <ImagePlus size={36} className="text-slate-350" />
                          <span className="text-xs font-bold text-slate-500">Klik untuk pilih gambar</span>
                          <span className="text-[10px] font-semibold text-slate-400 opacity-70">PNG, JPG, WebP • Maks 2MB</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        value={uploadForm.image_url}
                        onChange={(e) => setUploadForm({ ...uploadForm, image_url: e.target.value })}
                        className="w-full px-4 py-3.5 border border-slate-200/80 dark:border-slate-850 rounded-2xl text-xs font-mono text-slate-800 dark:text-slate-200 bg-[#f8fafc] dark:bg-slate-950 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:outline-none transition-all"
                        placeholder="https://cdn.example.com/frame.png"
                        disabled={uploading}
                      />
                      {uploadForm.image_url && (
                        <div className="mt-2 w-full h-36 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 flex items-center justify-center overflow-hidden">
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
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Jumlah Foto (Slots)</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={uploadForm.slots}
                    onChange={(e) => setUploadForm({ ...uploadForm, slots: parseInt(e.target.value, 10) || 4 })}
                    className="w-full px-4 py-3.5 border border-slate-200/80 dark:border-slate-850 rounded-2xl text-sm font-semibold text-slate-800 dark:text-slate-200 bg-[#f8fafc] dark:bg-slate-950 focus:bg-white focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:outline-none transition-all"
                    disabled={uploading}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-extrabold text-sm uppercase tracking-wider transition-all shadow-md shadow-orange-500/15 hover:opacity-95 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2"
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
