"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Loader2, ArrowLeft, ArrowRight, Lock, Mail, KeyRound, CheckCircle2, Eye, EyeOff, Sparkles, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Suspense } from "react"

function ResetForm() {
  const searchParams = useSearchParams()
  const prefEmail = searchParams.get("email") || ""

  const [email, setEmail] = useState(prefEmail)
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6 || newPassword.length < 8) {
      toast.error("OTP wajib 6 digit dan password minimal 8 karakter")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
          newPassword,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.message || "Gagal")
        return
      }
      toast.success(data.message || "Password berhasil diubah!")
      setSuccess(true)
      setTimeout(() => {
        window.location.href = "/loginUser"
      }, 2500)
    } catch {
      toast.error("Jaringan bermasalah")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="relative w-full max-w-lg z-10">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-2xl shadow-orange-500/10 dark:shadow-orange-500/5 overflow-hidden">
          <div className="px-8 py-16 text-center">
            <div className="mx-auto w-20 h-20 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full flex items-center justify-center mb-8 border border-emerald-100 dark:border-emerald-900/50 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-3">
              Password Diperbarui!
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mb-2">
              Password Anda telah berhasil diubah secara aman.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mb-8 font-medium">
              Mengalihkan Anda ke halaman login dalam beberapa saat...
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-full shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
              <span>Redirecting</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full max-w-lg z-10">
      {/* Back Link */}
      <Link
        href="/forgot-password"
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-orange-500 transition-colors uppercase tracking-widest mb-6 group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Kembali
      </Link>

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-2xl shadow-orange-500/10 dark:shadow-orange-500/5 overflow-hidden">
        {/* Header - Orange to Amber Gradient */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-600 dark:to-amber-600 px-8 py-8 relative overflow-hidden border-b border-slate-100 dark:border-slate-800">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md text-white flex items-center justify-center rounded-2xl">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white dark:text-white uppercase tracking-tight">
                Atur Ulang Password
              </h1>
              <p className="text-xs font-semibold text-orange-100 dark:text-orange-200 mt-1 uppercase tracking-widest flex items-center gap-1">
                <Sparkles size={12} /> Pulihkan akses akun Anda
              </p>
            </div>
          </div>
          {/* Decorative circles */}
          <div className="absolute -top-8 -right-8 w-32 h-32 border border-white/10 rounded-full pointer-events-none" />
        </div>

        {/* Body */}
        <div className="px-8 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">
                Alamat Email Anda
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

            {/* OTP Code */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 block">
                Kode OTP 6 Digit
              </label>
              <div className="flex justify-center bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-2xl py-6">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup className="gap-2">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-2 uppercase tracking-widest text-center">
                Masukkan kode verifikasi yang dikirim ke email
              </p>
            </div>

            {/* New Password */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 block">
                Password Baru
              </label>
              <div className="flex bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-2xl group focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10 dark:focus-within:border-orange-500 transition-all duration-300 overflow-hidden">
                <div className="flex items-center justify-center px-5 border-r border-slate-200 dark:border-slate-800 bg-slate-100/30 dark:bg-slate-800/30 text-slate-400 group-focus-within:text-orange-500 transition-colors">
                  <KeyRound className="text-slate-400 dark:text-slate-555 group-focus-within:text-orange-500 transition-colors" size={18} />
                </div>
                <div className="relative flex-grow flex">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-4 bg-transparent text-slate-800 dark:text-white text-sm font-semibold placeholder:font-medium placeholder:text-slate-400 dark:placeholder:text-slate-655 focus:outline-none disabled:opacity-50 pr-12"
                    placeholder="Minimal 8 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-slate-400 dark:text-slate-555 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition-all focus:outline-none disabled:opacity-50 select-none"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold mt-2 uppercase tracking-widest px-1">
                Gunakan minimal 8 karakter kombinasi huruf & angka
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || otp.length !== 6 || newPassword.length < 8}
                className="w-full relative flex items-center justify-center py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl font-bold uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-[0.97] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Simpan Password Baru</span>
                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800 px-8 py-5 bg-slate-50 dark:bg-slate-800/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <Sparkles size={12} className="text-orange-500" />
              <span>Sistem Keamanan Partner</span>
            </div>
            <Link
              href="/forgot-password"
              className="text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-orange-500 border-b border-transparent hover:border-orange-500 transition-colors uppercase tracking-widest"
            >
              Minta kode baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black flex justify-center items-center p-4 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0"></div>

      <Suspense
        fallback = {
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-16 flex justify-center z-10 shadow-2xl shadow-orange-500/10">
            <Loader2 className="animate-spin text-orange-500" />
          </div>
        }
      >
        <ResetForm />
      </Suspense>
    </div>
  )
}


