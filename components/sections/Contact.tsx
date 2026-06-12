"use client"

import type React from "react"
import { useState } from "react"
import { MapPin, Phone, Mail, Clock, MessageCircle, Loader2, CheckCircle2, ArrowRight, Send, AlertCircle, Sparkles } from "lucide-react"

interface FormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

export default function Contact() {
    const [formData, setFormData] = useState<FormData>({
        name: "", email: "", phone: "", message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitError(null)

        try {
            if (!formData.name || !formData.email || !formData.phone || !formData.message) {
                setSubmitError("Harap isi semua kolom wajib.")
                setIsSubmitting(false)
                return;
            }

            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                setShowSuccessModal(true) 
                setFormData({ name: "", email: "", phone: "", message: "" }) 
            } else {
                const errorData = await response.json();
                setSubmitError(errorData.message || "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.")
            }
        } catch (error) {
            console.error("Submission error:", error)
            setSubmitError("Koneksi bermasalah. Gagal menghubungi server.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    // Modal Sukses Editorial
    const SuccessModal = () => {
        if (!showSuccessModal) return null

        return (
            <div 
                className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300"
                onClick={() => setShowSuccessModal(false)}
            >
                <div 
                    className="bg-white border-2 border-black p-8 md:p-10 w-full max-w-sm shadow-[15px_15px_0px_0px_rgba(0,0,0,1)] animate-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-black flex items-center justify-center mb-6">
                            <CheckCircle2 size={32} className="text-white" /> 
                        </div>
                        <h2 className="text-2xl font-bold text-black mb-2">Pesan Terkirim!</h2>
                        <p className="text-gray-500 mb-8 font-medium text-sm leading-relaxed">
                            Terima kasih telah menghubungi kami. Tim kami akan segera merespon pesan Anda.
                        </p>
                        <button 
                            onClick={() => setShowSuccessModal(false)}
                            className="w-full py-4 bg-black text-white font-bold transition-all hover:bg-gray-800 active:scale-95"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <section id="contact" className="relative py-24 lg:py-32 bg-white dark:bg-black overflow-hidden selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black">
            
            <SuccessModal /> 

            {/* Background Decor (Grid tipis) */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),dark:linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0"></div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
                
                {/* ================= HEADER ================= */}
                <div className="text-center mb-16 md:mb-20 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                        <Sparkles className="w-3.5 h-3.5 text-black dark:text-white" />
                        <span className="text-[10px] font-bold text-black dark:text-white uppercase tracking-widest">
                            Mari Berkolaborasi
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black dark:text-white tracking-tight">
                        Hubungi <span className="text-gray-400 dark:text-gray-500">Kami</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
                        Punya pertanyaan, ide brilian, atau siap memulai project desain Anda? Sapa kami sekarang juga.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start max-w-6xl mx-auto">
                    
                    {/* ================= LEFT: CONTACT INFO (Col-span-2) ================= */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-black p-8 border-l-4 border-black dark:border-white shadow-[10px_10px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.05)] border border-gray-200 dark:border-white/10 border-l-black dark:border-l-white">
                            <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 mb-8 uppercase tracking-widest">Informasi Kontak</h3>
                            <div className="space-y-8">
                                {[
                                    { icon: Phone, title: "WhatsApp", desc: "+62 851-3373-7623", link: "https://wa.me/6285133737623", linkText: "Chat Sekarang" },
                                    { icon: Mail, title: "Email", desc: "arfan.7ovo@gmail.com", link: "mailto:arfan.7ovo@gmail.com", linkText: "Kirim Email" },
                                    { icon: Clock, title: "Jam Operasional", desc: "Senin - Sabtu: 13:00 - 21:00\nMinggu: 10:00 - 18:00" },
                                    { icon: MapPin, title: "Lokasi", desc: "Purwokerto, Jawa Tengah\n(Layanan Online)" },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-5 group">
                                        <div className="w-12 h-12 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors">
                                            <item.icon className="w-5 h-5 current-color" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-black dark:text-white text-sm mb-1">{item.title}</h4>
                                            <p className="text-gray-500 dark:text-gray-400 text-sm whitespace-pre-line leading-relaxed font-medium">{item.desc}</p>
                                            {item.link && (
                                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300 font-bold text-[11px] mt-2 inline-flex items-center gap-1 group/link transition-colors uppercase tracking-widest">
                                                    {item.linkText} <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick WhatsApp Action Card */}
                        <div className="bg-black dark:bg-white text-white dark:text-black p-8 relative overflow-hidden transition-transform hover:-translate-y-1">
                            <div className="relative z-10">
                                <h4 className="font-bold text-xl mb-3">Butuh Respon Kilat?</h4>
                                <p className="text-gray-400 dark:text-gray-500 text-sm mb-6 leading-relaxed font-medium">Tim kami siap melayani konsultasi desain Anda langsung via WhatsApp.</p>
                                <a 
                                    href="https://wa.me/6285133737623?text=Halo,%20saya%20tertarik%20dengan%20layanan%20desain%20poster%20Anda" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="w-full flex items-center justify-center gap-2 bg-white dark:bg-black text-black dark:text-white py-4 font-bold transition-all active:scale-[0.98] border border-transparent hover:border-white dark:hover:border-black hover:bg-transparent dark:hover:bg-transparent hover:text-white dark:hover:text-black"
                                >
                                    <MessageCircle size={20} /> Chat WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* ================= RIGHT: CONTACT FORM (Col-span-3) ================= */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-black border border-gray-200 dark:border-white/10 p-8 md:p-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)] dark:shadow-[20px_20px_0px_0px_rgba(255,255,255,0.05)]">
                            <div className="mb-10">
                                <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Kirim Pesan Langsung</h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Kami akan membalas pesan Anda ke email yang tertera di bawah.</p>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {submitError && (
                                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium flex items-start gap-3 animate-in fade-in">
                                        <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-red-500 dark:text-red-400" />
                                        {submitError}
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Nama Lengkap</label>
                                        <input 
                                            type="text" name="name" value={formData.name} onChange={handleChange} required 
                                            className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:bg-white dark:focus:bg-black focus:border-black dark:focus:border-white transition-all font-medium text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none" 
                                            placeholder="John Doe" 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Email</label>
                                        <input 
                                            type="email" name="email" value={formData.email} onChange={handleChange} required 
                                            className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:bg-white dark:focus:bg-black focus:border-black dark:focus:border-white transition-all font-medium text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none" 
                                            placeholder="john@example.com" 
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Nomor WhatsApp</label>
                                    <input 
                                        type="tel" name="phone" value={formData.phone} onChange={handleChange} required 
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:bg-white dark:focus:bg-black focus:border-black dark:focus:border-white transition-all font-medium text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none" 
                                        placeholder="08xxxxxxxxxx" 
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Pesan Anda</label>
                                    <textarea 
                                        name="message" value={formData.message} onChange={handleChange} required rows={5} 
                                        className="w-full px-5 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 focus:bg-white dark:focus:bg-black focus:border-black dark:focus:border-white transition-all font-medium text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 outline-none resize-none" 
                                        placeholder="Ceritakan detail desain yang Anda butuhkan..." 
                                    />
                                </div>

                                <div className="pt-6">
                                    <button 
                                        type="submit" 
                                        disabled={isSubmitting} 
                                        className={`w-full flex items-center justify-center gap-2 py-4 font-bold transition-all duration-300 border ${
                                            isSubmitting 
                                            ? "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-white/10 cursor-not-allowed" 
                                            : "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white hover:bg-white dark:hover:bg-black hover:text-black dark:hover:text-white active:scale-[0.98]"
                                        }`}
                                    >
                                        {isSubmitting ? (
                                            <><Loader2 size={20} className="animate-spin" /> Mengirim...</>
                                        ) : (
                                            <><Send size={20} /> Kirim Pesan</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}