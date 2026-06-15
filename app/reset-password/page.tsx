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
        <div className="bg-white dark:bg-black border-2 border-black dark:border-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]">
          <div className="px-8 py-16 text-center">
            <div className="mx-auto w-20 h-20 bg-green-300 dark:bg-green-400 border-2 border-black dark:border-white flex items-center justify-center mb-8 transform rotate-3 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
              <CheckCircle2 className="w-10 h-10 text-black" />
            </div>
            <h2 className="text-2xl font-black text-black dark:text-white uppercase tracking-tight mb-3">
              Password Diperbarui!
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-bold mb-2">
              Password Anda telah berhasil diubah secara aman.
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-8 font-medium">
              Mengalihkan Anda ke halaman login dalam beberapa saat...
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-gray-50 dark:bg-white/5 text-xs font-black text-black dark:text-white uppercase tracking-widest shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Loader2 className="w-4 h-4 animate-spin" />
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
        className="inline-flex items-center gap-2 text-xs font-black text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors uppercase tracking-widest mb-6 group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Kembali
      </Link>

      {/* Main Card */}
      <div className="bg-white dark:bg-black border-2 border-black dark:border-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)] overflow-hidden">
        {/* Header - Neon Orange to Pink Gradient */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-600 dark:from-orange-600 dark:to-pink-700 px-8 py-8 relative overflow-hidden border-b-2 border-black dark:border-white">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 border-2 border-black bg-yellow-300 dark:bg-yellow-400 text-black flex items-center justify-center transform rotate-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:rotate-0 transition-transform duration-300">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white dark:text-white uppercase tracking-tight">
                Atur Ulang Password
              </h1>
              <p className="text-xs font-black text-yellow-300 dark:text-yellow-200 mt-1 uppercase tracking-widest flex items-center gap-1">
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
              <label className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest mb-2 block">
                Alamat Email Anda
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

            {/* OTP Code */}
            <div>
              <label className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest mb-3 block">
                Kode OTP 6 Digit
              </label>
              <div className="flex justify-center bg-gray-50 dark:bg-white/5 border-2 border-black dark:border-white py-6">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="border-black dark:border-white border-y border-r first:border-l" />
                    <InputOTPSlot index={1} className="border-black dark:border-white border-y border-r" />
                    <InputOTPSlot index={2} className="border-black dark:border-white border-y border-r" />
                    <InputOTPSlot index={3} className="border-black dark:border-white border-y border-r" />
                    <InputOTPSlot index={4} className="border-black dark:border-white border-y border-r" />
                    <InputOTPSlot index={5} className="border-black dark:border-white border-y border-r" />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black mt-2 uppercase tracking-widest text-center">
                Masukkan kode verifikasi yang dikirim ke email
              </p>
            </div>

            {/* New Password */}
            <div>
              <label className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest mb-2 block">
                Password Baru
              </label>
              <div className="flex bg-white dark:bg-black border-2 border-black dark:border-white group focus-within:translate-x-[-2px] focus-within:translate-y-[-2px] focus-within:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:focus-within:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] transition-all duration-200">
                <div className="flex items-center justify-center px-5 border-r-2 border-black dark:border-white bg-gray-50 dark:bg-white/5">
                  <KeyRound className="text-black dark:text-white" size={18} />
                </div>
                <div className="relative flex-grow flex">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-4 bg-transparent text-black dark:text-white text-sm font-bold placeholder:font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none disabled:opacity-50 pr-12"
                    placeholder="Minimal 8 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all focus:outline-none disabled:opacity-50 select-none"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black mt-2 uppercase tracking-widest px-1">
                Gunakan minimal 8 karakter kombinasi huruf & angka
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || otp.length !== 6 || newPassword.length < 8}
                className="w-full relative flex items-center justify-center py-4 bg-yellow-300 dark:bg-yellow-400 text-black font-black uppercase tracking-widest border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[7px_7px_0px_0px_rgba(255,255,255,1)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group"
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
        <div className="border-t-2 border-black dark:border-white px-8 py-5 bg-gray-50 dark:bg-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              <Sparkles size={12} className="text-yellow-500" />
              <span>Sistem Keamanan Partner</span>
            </div>
            <Link
              href="/forgot-password"
              className="text-[10px] font-black text-black dark:text-white border-b-2 border-black dark:border-white hover:text-gray-500 dark:hover:text-gray-300 transition-colors uppercase tracking-widest"
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
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),dark:linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0"></div>

      <Suspense
        fallback = {
          <div className="w-full max-w-lg bg-white dark:bg-black border-2 border-black dark:border-white p-16 flex justify-center z-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <Loader2 className="animate-spin text-black dark:text-white" />
          </div>
        }
      >
        <ResetForm />
      </Suspense>
    </div>
  )
}
