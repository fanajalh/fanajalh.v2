"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, Mail, ArrowLeft, ArrowRight, KeyRound, ShieldCheck, Sparkles, AlertCircle } from "lucide-react"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })
      const data = await res.json()
      if (res.status === 429) {
        toast.error(data.message || "Terlalu banyak permintaan")
        return
      }
      if (!res.ok) {
        toast.error(data.message || "Gagal")
        return
      }
      toast.success(data.message || "Kode telah dikirim!")
      setSent(true)
    } catch {
      toast.error("Jaringan bermasalah")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex justify-center items-center p-4 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Background Decor (Grid tipis) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),dark:linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0"></div>

      <div className="relative w-full max-w-lg z-10">
        {/* Back Link */}
        <Link
          href="/loginUser"
          className="inline-flex items-center gap-2 text-xs font-black text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest mb-6 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Login
        </Link>

        {/* Main Card */}
        <div className="bg-white dark:bg-black border-2 border-black dark:border-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] transition-all duration-300">
          {/* Header Banner - Neon Orange to Pink Gradient */}
          <div className="bg-gradient-to-r from-orange-500 to-pink-600 dark:from-orange-600 dark:to-pink-700 px-8 py-8 relative overflow-hidden border-b-2 border-black dark:border-white">
            {/* Grid bg inside header */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
            
            <div className="relative z-10 flex items-center gap-5">
              <div className="w-14 h-14 border-2 border-black bg-yellow-300 dark:bg-yellow-400 text-black flex items-center justify-center transform -rotate-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:rotate-0 transition-transform duration-300">
                <KeyRound className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white dark:text-white uppercase tracking-tight">
                  Lupa Password
                </h1>
                <p className="text-xs font-black text-yellow-300 dark:text-yellow-200 mt-1 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles size={12} /> Reset via kode verifikasi email
                </p>
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-32 h-32 border-2 border-white/10 rounded-full pointer-events-none" />
            <div className="absolute -bottom-6 -right-6 w-24 h-24 border-2 border-white/5 rounded-full pointer-events-none" />
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            {!sent ? (
              <>
                <div className="bg-yellow-50 dark:bg-yellow-950/20 border-2 border-black dark:border-yellow-900/50 p-4 mb-6 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-black dark:text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-black dark:text-gray-300 font-bold leading-relaxed uppercase tracking-wider">
                    Masukkan alamat email Anda yang terdaftar. Kami akan mengirimkan 6 digit kode OTP untuk memverifikasi kepemilikan akun.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div>
                    <label className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest mb-2.5 block">
                      Alamat Email Terdaftar
                    </label>
                    <div className="flex bg-white dark:bg-black border-2 border-black dark:border-white group focus-within:translate-x-[-2px] focus-within:translate-y-[-2px] focus-within:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus-within:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all duration-200">
                      <div className="flex items-center justify-center px-5 border-r-2 border-black dark:border-white bg-gray-50 dark:bg-white/5">
                        <Mail className="text-black dark:text-white" size={18} />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        className="w-full px-4 py-4 bg-transparent text-black dark:text-white text-sm font-bold placeholder:font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none disabled:opacity-50"
                        placeholder="email@contoh.com"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full relative flex items-center justify-center py-4 bg-yellow-300 dark:bg-yellow-400 text-black font-black uppercase tracking-widest border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[7px_7px_0px_0px_rgba(255,255,255,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Kirim Kode Reset</span>
                        <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Success State */
              <div className="text-center py-4">
                <div className="mx-auto w-16 h-16 bg-green-300 dark:bg-green-400 border-2 border-black dark:border-white flex items-center justify-center mb-6 transform rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <ShieldCheck className="w-8 h-8 text-black" />
                </div>
                <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-tight mb-3">
                  Kode Terkirim!
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-bold mb-4">
                  Kami telah mengirimkan kode OTP reset ke:
                </p>
                <div className="bg-gray-100 dark:bg-white/5 border-2 border-black dark:border-white py-3 px-4 inline-block font-black text-black dark:text-white text-sm mb-4 tracking-wider uppercase">
                  {email}
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-8 max-w-xs mx-auto leading-relaxed">
                  Periksa folder Inbox atau folder Spam Anda dalam beberapa saat ke depan.
                </p>

                <div className="flex flex-col gap-4">
                  <Link
                    href={`/reset-password?email=${encodeURIComponent(email)}`}
                    className="w-full relative flex items-center justify-center py-4 bg-yellow-300 dark:bg-yellow-400 text-black font-black uppercase tracking-widest border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[7px_7px_0px_0px_rgba(255,255,255,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 group"
                  >
                    <span>Masukkan Kode Reset</span>
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="text-xs font-black text-gray-400 hover:text-black dark:hover:text-white border-b-2 border-transparent hover:border-black dark:hover:border-white py-1 transition-all uppercase tracking-widest self-center"
                  >
                    Kirim ulang ke email lain
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t-2 border-black dark:border-white px-8 py-5 bg-gray-50 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                <Sparkles size={12} className="text-yellow-500" />
                <span>Sistem Keamanan Partner</span>
              </div>
              {!sent && (
                <Link
                  href="/reset-password"
                  className="text-[10px] font-black text-black dark:text-white border-b-2 border-black dark:border-white hover:text-gray-500 dark:hover:text-gray-300 transition-colors uppercase tracking-widest"
                >
                  Sudah punya kode?
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
