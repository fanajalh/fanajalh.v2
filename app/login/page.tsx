"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff, Palette, Loader2, ArrowLeft, Mail, Lock } from "lucide-react"
import { toast } from "sonner"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [step, setStep] = useState<"cred" | "otp">("cred")
  const [otpValue, setOtpValue] = useState("")

  const sendOtp = async () => {
    if (!formData.email?.trim() || !formData.password) {
      toast.error("Isi email dan password")
      return
    }
    setSendingOtp(true)
    try {
      const res = await fetch("/api/auth/send-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        }),
      })
      const data = await res.json()
      if (res.status === 429) {
        toast.error(data.message || "Terlalu banyak permintaan")
        return
      }
      if (res.status === 503) {
        toast.error(data.message || "Email tidak dapat dikirim")
        return
      }
      if (!res.ok) {
        toast.error(data.message || "Gagal")
        return
      }
      toast.success(data.message || "Periksa email Anda")
      setStep("otp")
      setOtpValue("")
    } catch {
      toast.error("Jaringan bermasalah")
    } finally {
      setSendingOtp(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === "cred") {
      await sendOtp()
      return
    }

    setLoading(true)
    try {
      const { signIn } = await import("next-auth/react")
      const res = await signIn("credentials", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        otp: otpValue.trim(),
        redirect: false,
      })

      if (res?.error) throw new Error(res.error)

      toast.success("Welcome back!", { description: "Redirecting…" })
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 800)
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error("Login Failed", {
        description: error.message || "Invalid credentials.",
      })
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center relative p-4">
      <div className="w-full max-w-lg bg-white border-4 border-black p-8 md:p-10 shadow-[15px_15px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-center mb-10">
          <div className="mx-auto w-16 h-16 bg-black border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <Palette className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-black uppercase tracking-widest">
            {step === "otp" ? "Verifikasi" : "Admin Login"}
          </h1>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2">
            {step === "otp"
              ? "Masukkan 6 digit dari email"
              : "Masuk untuk kelola pesanan"}
          </p>
        </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {step === "otp" && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => {
                    setStep("cred")
                    setOtpValue("")
                  }}
                  className="flex items-center gap-2 text-xs font-black text-black uppercase tracking-widest hover:translate-x-1 transition-transform"
                >
                  <ArrowLeft size={16} strokeWidth={3} /> Kembali
                </button>
                <div className="flex justify-center py-4">
                  <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot index={0} className="border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-lg font-black" />
                      <InputOTPSlot index={1} className="border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-lg font-black" />
                      <InputOTPSlot index={2} className="border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-lg font-black" />
                      <InputOTPSlot index={3} className="border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-lg font-black" />
                      <InputOTPSlot index={4} className="border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-lg font-black" />
                      <InputOTPSlot index={5} className="border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-lg font-black" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-center mt-2">
                  <button type="button" className="text-xs font-black text-black uppercase tracking-widest border-b-2 border-black hover:bg-black hover:text-white transition-all px-1" onClick={() => void sendOtp()}>
                    Kirim ulang kode
                  </button>
                </p>
              </div>
            )}

            {step === "cred" && (
              <>
                <div className="group flex items-stretch border-2 border-black focus-within:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white">
                  <div className="w-14 flex items-center justify-center bg-gray-100 border-r-2 border-black shrink-0 text-black group-focus-within:bg-black group-focus-within:text-white transition-colors">
                    <Mail size={20} strokeWidth={2.5} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading || sendingOtp}
                    autoComplete="email"
                    className="w-full px-4 py-3.5 bg-transparent text-black font-bold placeholder:font-bold placeholder:text-gray-300 focus:outline-none focus:ring-0 transition-all disabled:opacity-50 text-sm md:text-base"
                    placeholder="ALAMAT EMAIL"
                  />
                </div>

                <div className="group flex items-stretch border-2 border-black focus-within:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all bg-white">
                  <div className="w-14 flex items-center justify-center bg-gray-100 border-r-2 border-black shrink-0 text-black group-focus-within:bg-black group-focus-within:text-white transition-colors">
                    <Lock size={20} strokeWidth={2.5} />
                  </div>
                  <div className="relative flex-1 flex">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loading || sendingOtp}
                      autoComplete="current-password"
                      className="w-full px-4 py-3.5 bg-transparent text-black font-bold placeholder:font-bold placeholder:text-gray-300 focus:outline-none focus:ring-0 transition-all pr-12 disabled:opacity-50 text-sm md:text-base"
                      placeholder="PASSWORD"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading || sendingOtp}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-black hover:scale-110 transition-transform focus:outline-none disabled:opacity-50 select-none bg-white"
                    >
                      {showPassword ? <EyeOff size={20} strokeWidth={2.5} /> : <Eye size={20} strokeWidth={2.5} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <Link
                    href="/forgot-password"
                    className="text-[10px] font-black text-gray-500 hover:text-black uppercase tracking-widest transition-colors border-b border-transparent hover:border-black"
                  >
                    Lupa Password?
                  </Link>
                </div>
              </>
            )}

            <div className="pt-6">
              <button
                type="submit"
                disabled={
                  loading ||
                  sendingOtp ||
                  (step === "otp" && otpValue.length !== 6)
                }
                className="w-full relative flex items-center justify-center py-4 bg-black text-white border-2 border-black rounded-none font-black text-sm uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-70 disabled:cursor-not-allowed select-none"
              >
                {loading || sendingOtp ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    {sendingOtp ? "MENGIRIM…" : "SIGNING IN..."}
                  </>
                ) : step === "cred" ? (
                  "KIRIM KODE KE EMAIL"
                ) : (
                  "SIGN IN"
                )}
              </button>
            </div>
          </form>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center text-[11px] font-black text-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4 select-none transition-all"
          >
            KEMBALI KE BERANDA
          </Link>
        </div>
      </div>
    </div>
  )
}
