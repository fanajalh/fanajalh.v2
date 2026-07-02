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
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0"></div>
      <div className="relative w-full max-w-lg z-10">
        {/* Back Link */}
        <Link
          href="/loginUser"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-orange-500 transition-colors uppercase tracking-widest mb-6 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Login
        </Link>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-2xl shadow-orange-500/10 dark:shadow-orange-500/5 transition-all duration-300 overflow-hidden">
          {/* Header Banner - Orange to Amber Gradient */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-600 dark:to-amber-600 px-8 py-8 relative overflow-hidden border-b border-slate-100 dark:border-slate-800">
            {/* Grid bg inside header */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
            
            <div className="relative z-10 flex items-center gap-5">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md text-white flex items-center justify-center rounded-2xl">
                <KeyRound className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white dark:text-white uppercase tracking-tight">
                  Lupa Password
                </h1>
                <p className="text-xs font-semibold text-orange-105 dark:text-orange-200 mt-1 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles size={12} /> Reset via kode verifikasi email
                </p>
              </div>
            </div>
            {/* Decorative circles */}
            <div className="absolute -top-8 -right-8 w-32 h-32 border border-white/10 rounded-full pointer-events-none" />
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            {!sent ? (
              <>
                <div className="bg-orange-50/50 dark:bg-orange-950/10 border border-orange-200/50 dark:border-orange-900/30 rounded-2xl p-4 mb-6 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 dark:text-slate-350 font-semibold leading-relaxed uppercase tracking-wider">
                    Masukkan alamat email Anda yang terdaftar. Kami akan mengirimkan 6 digit kode OTP untuk memverifikasi kepemilikan akun.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email Input */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5 block">
                      Alamat Email Terdaftar
                    </label>
                    <div className="flex bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-2xl group focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10 dark:focus-within:border-orange-500 transition-all duration-300 overflow-hidden">
                      <div className="flex items-center justify-center px-5 border-r border-slate-200 dark:border-slate-800 bg-slate-100/30 dark:bg-slate-800/30 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                        <Mail className="text-slate-400 dark:text-slate-500 group-focus-within:text-orange-500 transition-colors" size={18} />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        className="w-full px-4 py-4 bg-transparent text-slate-800 dark:text-white text-sm font-semibold placeholder:font-medium placeholder:text-slate-400 dark:placeholder:text-slate-655 focus:outline-none disabled:opacity-50"
                        placeholder="email@contoh.com"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full relative flex items-center justify-center py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-[0.97] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
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
                <div className="mx-auto w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-100 dark:border-emerald-900/50 shadow-sm">
                  <ShieldCheck className="w-8 h-8 text-emerald-555" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-3">
                  Kode Terkirim!
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mb-4">
                  Kami telah mengirimkan kode OTP reset ke:
                </p>
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-3 px-4 rounded-2xl inline-block font-bold text-slate-800 dark:text-white text-sm mb-4 tracking-wider">
                  {email}
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-8 max-w-xs mx-auto leading-relaxed">
                  Periksa folder Inbox atau folder Spam Anda dalam beberapa saat ke depan.
                </p>

                <div className="flex flex-col gap-4">
                  <Link
                    href={`/reset-password?email=${encodeURIComponent(email)}`}
                    className="w-full relative flex items-center justify-center py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-[0.97] transition-all duration-300 group"
                  >
                    <span>Masukkan Kode Reset</span>
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="text-xs font-bold text-slate-400 hover:text-orange-500 border-b border-transparent hover:border-orange-500 py-1 transition-all uppercase tracking-widest self-center"
                  >
                    Kirim ulang ke email lain
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 dark:border-slate-800 px-8 py-5 bg-slate-50 dark:bg-slate-800/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                <Sparkles size={12} className="text-orange-500" />
                <span>Sistem Keamanan Partner</span>
              </div>
              {!sent && (
                <Link
                  href="/reset-password"
                  className="text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-orange-500 border-b border-transparent hover:border-orange-500 transition-colors uppercase tracking-widest"
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
