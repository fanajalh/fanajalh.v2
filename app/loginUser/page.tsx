"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Palette, Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

type AuthStep = "form" | "otp"

function AuthFormContent() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<AuthStep>("form")
  const [otpValue, setOtpValue] = useState("")
  
  const { status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode")

  useEffect(() => {
    if (mode === "register") {
      setIsLogin(false)
    } else if (mode === "login") {
      setIsLogin(true)
    }
  }, [mode])

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/")
    }
  }, [status, router])

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  })

  // ─── LOGIN: Direct sign in (no OTP) ─────────────────────
  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      toast.error("Isi email dan password")
      return
    }
    setLoading(true)
    try {
      const { signIn } = await import("next-auth/react")
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (res?.error) throw new Error(res.error)

      toast.success("Welcome Back!", {
        description: "Sedang mengalihkan…",
      })
      setTimeout(() => {
        window.location.href = "/"
      }, 800)
    } catch (err: any) {
      toast.error("Login Gagal", { description: err.message || "Email atau password salah." })
    } finally {
      setLoading(false)
    }
  }

  // ─── REGISTER: Create Account + Send OTP ───────────────
  const handleRegister = async () => {
    if (!formData.email || !formData.password || !formData.username) {
      toast.error("Isi semua data terlebih dahulu")
      return
    }
    if (formData.password.length < 6) {
      toast.error("Password minimal 6 karakter")
      return
    }
    setSendingOtp(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.username,
        }),
      })
      const data = await res.json()
      if (res.status === 429) {
        toast.error(data.message || "Terlalu banyak permintaan")
        return
      }
      if (res.status === 503) {
        toast.error(data.message || "Kode OTP gagal dikirim")
        return
      }
      if (!res.ok) {
        toast.error(data.message || "Gagal membuat akun")
        return
      }
      toast.success("Akun berhasil dibuat!", { description: "Periksa email untuk kode verifikasi." })
      setStep("otp")
      setOtpValue("")
    } catch {
      toast.error("Jaringan bermasalah")
    } finally {
      setSendingOtp(false)
    }
  }

  // ─── Resend OTP (for register) ─────────────────────────
  const resendRegisterOtp = async () => {
    setSendingOtp(true)
    try {
      const res = await fetch("/api/auth/send-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      })
      const data = await res.json()
      if (res.status === 429) {
        toast.error(data.message || "Terlalu banyak permintaan")
        return
      }
      if (!res.ok) {
        toast.error(data.message || "Gagal mengirim ulang kode")
        return
      }
      toast.success("Kode baru telah dikirim!")
      setOtpValue("")
    } catch {
      toast.error("Jaringan bermasalah")
    } finally {
      setSendingOtp(false)
    }
  }

  // ─── VERIFY OTP & Sign In (register only) ─────────────
  const verifyOtpAndLogin = async () => {
    setLoading(true)
    try {
      // First verify the OTP via the verify endpoint
      const verifyRes = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otpValue.trim() }),
      })
      if (!verifyRes.ok) {
        const data = await verifyRes.json()
        throw new Error(data.message || "Kode OTP salah atau kedaluwarsa.")
      }

      // Then sign in directly
      const { signIn } = await import("next-auth/react")
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (res?.error) throw new Error(res.error)

      toast.success("Akun Berhasil Dibuat!", {
        description: "Selamat bergabung!",
      })
      setTimeout(() => {
        window.location.href = "/"
      }, 800)
    } catch (err: any) {
      toast.error("Verifikasi Gagal", { description: err.message || "Kode OTP salah atau kedaluwarsa." })
    } finally {
      setLoading(false)
    }
  }

  // ─── Form Submit Handler ───────────────────────────────
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLogin) {
      // Login: direct sign in, no OTP
      await handleLogin()
      return
    }

    // Register flow
    if (step === "form") {
      await handleRegister()
      return
    }

    if (step === "otp") {
      await verifyOtpAndLogin()
    }
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
    setFormData({ email: "", password: "", username: "" })
    setShowPassword(false)
    setStep("form")
    setOtpValue("")
  }

  // ─── Dynamic text helpers ──────────────────────────────
  const headingText =
    step === "otp"
      ? "Kode Verifikasi"
      : isLogin
        ? "Welcome Back!"
        : "Buat Akun"

  const subtitleText =
    step === "otp"
      ? "Masukkan 6 digit kode yang dikirim ke email Anda."
      : isLogin
        ? "Masuk ke akun Anda untuk melanjutkan."
        : "Bergabung dengan kami sekarang."

  const buttonText =
    step === "otp"
      ? "Verifikasi & Masuk"
      : isLogin
        ? "Masuk"
        : "Daftar & Kirim Kode OTP"

  return (
    <div className="min-h-screen bg-white dark:bg-black flex justify-center items-center p-4 selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Background Decor (Grid tipis) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0"></div>

      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 flex flex-col md:flex-row overflow-hidden rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl shadow-orange-500/10 dark:shadow-orange-500/5 min-h-[550px] z-10">
        
        {/* Left Side: Branding Banner */}
        <div className="hidden md:flex flex-col flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-black dark:from-white dark:via-slate-50 dark:to-slate-100 p-10 justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
          {/* Grid bg inside banner */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 border border-white/10 dark:border-black/10 flex items-center justify-center bg-white/5 dark:bg-black/5 overflow-hidden rounded-xl shrink-0">
                <img src="/feed arfan (20).png" alt="AllFanajalh Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-black text-white dark:text-black tracking-widest uppercase">AllFanajalh</span>
            </Link>
          </div>

          <div className="relative z-10 mt-20">
            <h2 className="text-4xl lg:text-5xl font-black text-white dark:text-black leading-[1.1] uppercase tracking-tight">
              Template Poster &amp; <br /> SaaS Ecosystem.
            </h2>
            <p className="mt-6 text-sm text-gray-400 dark:text-gray-555 font-medium max-w-sm leading-relaxed">
              Platform lengkap untuk template desain poster profesional dan SaaS Business Ecosystem (CRM, Lead Finder, Email Blast, SEO Planner &amp; Web Audit).
            </p>
          </div>

          {/* Abstract circles */}
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] border border-white/5 dark:border-black/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-[400px] h-[400px] border border-white/10 dark:border-black/10 rounded-full pointer-events-none" />
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full md:w-[420px] px-8 py-10 flex flex-col justify-between shrink-0 bg-white dark:bg-slate-900 relative">
          {/* Back button for desktop */}
          <Link
            href="/"
            className="absolute top-4 right-4 hidden md:flex items-center gap-1.5 text-[10px] font-black text-gray-400 dark:text-gray-555 hover:text-orange-500 transition-colors uppercase tracking-widest group"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-0.5 transition-transform" />
            Kembali
          </Link>
          <div className="flex flex-col justify-center flex-grow">
            <div className="text-center mb-8">
              <div className="md:hidden mx-auto w-12 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mb-4 overflow-hidden rounded-2xl shadow-md">
                {step === "otp" ? (
                  <CheckCircle2 className="w-6 h-6 text-orange-500" />
                ) : (
                  <img src="/feed arfan (20).png" alt="AllFanajalh Logo" className="w-full h-full object-cover" />
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white tracking-tight uppercase">
                {headingText}
              </h1>
              <p className="text-slate-400 dark:text-slate-500 mt-2 font-semibold text-xs md:text-sm">
                {subtitleText}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {/* ─── OTP INPUT STEP (register only) ─── */}
              {step === "otp" && !isLogin && (
                <div className="space-y-4 py-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("form")
                      setOtpValue("")
                    }}
                    className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-350 hover:text-orange-500 dark:hover:text-orange-500 transition-colors uppercase tracking-widest"
                  >
                    <ArrowLeft size={16} /> Kembali
                  </button>

                  {/* Email info pill */}
                  <div className="flex justify-center">
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                      <Mail size={14} className="text-orange-500" />
                      <span className="text-xs font-bold text-slate-750 dark:text-slate-300">{formData.email}</span>
                    </div>
                  </div>

                  <div className="flex justify-center py-2">
                    <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <p className="text-center text-xs text-slate-400 dark:text-slate-555 font-semibold">
                    Tidak masuk? Periksa spam atau{" "}
                    <button
                      type="button"
                      className="text-orange-500 border-b border-orange-500 font-bold hover:text-orange-600 transition-colors uppercase tracking-widest"
                      disabled={sendingOtp}
                      onClick={() => void resendRegisterOtp()}
                    >
                      {sendingOtp ? "Mengirim…" : "Kirim Ulang"}
                    </button>
                  </p>
                </div>
              )}

              {/* ─── FORM INPUTS STEP ─── */}
              {step === "form" && (
                <>
                  {/* Username (register only) */}
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      !isLogin ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="flex bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-2xl group focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10 dark:focus-within:border-orange-500 transition-all duration-300">
                      <div className="flex items-center justify-center px-5 border-r border-slate-200 dark:border-slate-800">
                        <User
                          className="text-slate-400 dark:text-slate-500 group-focus-within:text-orange-500 dark:group-focus-within:text-orange-400 transition-colors"
                          size={18}
                        />
                      </div>
                      <input
                        id="username"
                        type="text"
                        required={!isLogin}
                        placeholder="Username (e.g. ArfanDesign)"
                        disabled={loading || sendingOtp}
                        className="w-full px-4 py-4 bg-transparent text-slate-800 dark:text-white text-sm font-semibold placeholder:font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none disabled:opacity-50"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-2xl group focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10 dark:focus-within:border-orange-500 transition-all duration-300">
                    <div className="flex items-center justify-center px-5 border-r border-slate-200 dark:border-slate-800">
                      <Mail
                        className="text-slate-400 dark:text-slate-500 group-focus-within:text-orange-500 dark:group-focus-within:text-orange-400 transition-colors"
                        size={18}
                      />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="Email Address"
                      disabled={loading || sendingOtp}
                      className="w-full px-4 py-4 bg-transparent text-slate-800 dark:text-white text-sm font-semibold placeholder:font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none disabled:opacity-50"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-2">
                    <div className="flex bg-slate-50/50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800/80 rounded-2xl group focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10 dark:focus-within:border-orange-500 transition-all duration-300">
                      <div className="flex items-center justify-center px-5 border-r border-slate-200 dark:border-slate-800">
                        <Lock
                          className="text-slate-400 dark:text-slate-500 group-focus-within:text-orange-500 dark:group-focus-within:text-orange-400 transition-colors"
                          size={18}
                        />
                      </div>
                      <div className="relative flex-grow flex">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          required
                          placeholder="Password"
                          disabled={loading || sendingOtp}
                          className="w-full px-4 py-4 bg-transparent text-slate-800 dark:text-white text-sm font-semibold placeholder:font-medium placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none disabled:opacity-50 pr-12"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={loading || sendingOtp}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 text-slate-400 dark:text-slate-500 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition-all focus:outline-none disabled:opacity-50 select-none"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    
                    {/* Password Helpers (Forgot Password / Min 6 chars) */}
                    <div className="flex justify-between items-center px-1">
                      {!isLogin ? (
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-widest">
                          Minimal 6 karakter
                        </span>
                      ) : (
                        <span /> /* Empty span to keep layout */
                      )}

                      {isLogin && (
                        <Link
                          href="/forgot-password"
                          className="text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-orange-500 border-b border-transparent hover:border-orange-500 transition-colors uppercase tracking-widest"
                        >
                          Lupa Password?
                        </Link>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ─── SUBMIT BUTTON ─── */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading || sendingOtp || (step === "otp" && otpValue.length !== 6)}
                  className="w-full relative flex items-center justify-center py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-[0.97] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {loading || sendingOtp ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{buttonText}</span>
                      <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* ─── TOGGLE AUTH MODE ─── */}
            {step === "form" && (
              <>
                <div className="mt-8 text-center relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-white dark:bg-slate-900 px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Atau</span>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-4 text-center">
                  <Link
                    href="/frames"
                    className="w-full flex items-center justify-center py-4 bg-slate-50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 border border-slate-200 dark:border-slate-800 hover:border-orange-500/50 dark:hover:border-orange-500/30 rounded-2xl font-bold text-sm transition-all duration-300 active:scale-[0.97] uppercase tracking-widest group"
                  >
                    <span>Lanjut sebagai Tamu</span>
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-orange-500 transition-colors mt-2 uppercase tracking-widest"
                  >
                    {isLogin ? (
                      <p>
                        Belum punya akun?{" "}
                        <span className="text-orange-500 border-b border-orange-500 ml-1">Daftar gratis</span>
                      </p>
                    ) : (
                      <p>
                        Sudah punya akun?{" "}
                        <span className="text-orange-500 border-b border-orange-500 ml-1">Masuk di sini</span>
                      </p>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="inline-flex items-center text-[10px] font-bold text-slate-400 dark:text-slate-555 hover:text-orange-500 transition-colors uppercase tracking-widest select-none group"
            >
              <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Kembali
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-black flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin text-black dark:text-white" strokeWidth={3} />
      </div>
    }>
      <AuthFormContent />
    </Suspense>
  )
}
