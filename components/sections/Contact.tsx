"use client"

import type React from "react"
import { useState } from "react"
import { MapPin, Phone, Mail, Clock, MessageCircle, Loader2, CheckCircle2, ArrowRight, Send, AlertCircle, Sparkles } from "lucide-react"
import { headersConfig } from "./headersConfig"

interface FormData {
    name: string;
    email: string;
    phone: string;
    message: string;
}

interface ContactProps {
    orderPageOpen?: boolean;
    websiteSettings?: any;
}

export default function Contact({ orderPageOpen = true, websiteSettings }: ContactProps) {
    const whatsappNumber = websiteSettings?.whatsapp || "6285133737623"
    const emailAddress = websiteSettings?.email || "arfan.7ovo@gmail.com"
    const formatWA = (num: string) => {
        const clean = num.replace(/\D/g, "");
        if (clean.startsWith("62")) {
            return `+62 ${clean.slice(2, 5)}-${clean.slice(5, 9)}-${clean.slice(9)}`;
        }
        return num;
    };
    const displayPhone = formatWA(whatsappNumber)
    const [formData, setFormData] = useState<FormData>({
        name: "", email: "", phone: "", message: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [isSuccess, setIsSuccess] = useState(false)

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
                setIsSuccess(true)
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

    return (
        <section id="contact" className="relative py-24 lg:py-32 overflow-hidden selection:bg-orange-500 selection:text-white dark:selection:bg-orange-500 dark:selection:text-white">
            {/* Clean subtle background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none z-0 opacity-70"></div>

            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
                
                {/* Header */}
                <div className="text-center mb-16 md:mb-20 space-y-4">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {headersConfig.contact.title}
                    </h2>
                    <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                        {headersConfig.contact.subtitle}
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
                    
                    {/* LEFT COLUMN: Contact Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-[#0B0F19] p-8 md:p-10 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-8 uppercase tracking-widest">{headersConfig.contact.infoTitle}</h3>
                            <div className="space-y-8">
                                {[
                                    { 
                                        icon: Phone, 
                                        title: "WhatsApp", 
                                        desc: orderPageOpen ? displayPhone : `${displayPhone}\n(Slow Response — Layanan Tutup)`, 
                                        link: `https://wa.me/${whatsappNumber}`, 
                                        linkText: orderPageOpen ? "Chat Sekarang" : "Hubungi (Slow Response)" 
                                    },
                                    { icon: Mail, title: "Email", desc: emailAddress, link: `mailto:${emailAddress}`, linkText: "Kirim Email" },
                                    { icon: Clock, title: "Jam Operasional", desc: "Senin - Sabtu: 13:00 - 21:00\nMinggu: 10:00 - 18:00" },
                                    { icon: MapPin, title: "Lokasi", desc: "Purwokerto, Jawa Tengah\n(Layanan Online)" },
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 text-orange-500 flex items-center justify-center flex-shrink-0 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{item.title}</h4>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm whitespace-pre-line leading-relaxed">{item.desc}</p>
                                            {item.link && (
                                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 font-bold text-xs mt-2 inline-flex items-center gap-1.5 group/link transition-colors uppercase tracking-wider">
                                                    {item.linkText} <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Clean Quick Action Card */}
                        <div className="bg-gradient-to-br from-orange-500 to-amber-500 text-white p-8 md:p-10 rounded-3xl relative overflow-hidden shadow-lg shadow-orange-500/20 transition-transform hover:-translate-y-1 duration-300">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl pointer-events-none" />
                            <div className="relative z-10">
                                <h4 className="font-bold text-xl mb-3">{orderPageOpen ? headersConfig.contact.quickActionTitleOpen : headersConfig.contact.quickActionTitleClosed}</h4>
                                <p className="text-orange-50 text-sm mb-6 leading-relaxed">
                                    {orderPageOpen 
                                        ? headersConfig.contact.quickActionDescOpen 
                                        : headersConfig.contact.quickActionDescClosed}
                                </p>
                                <a 
                                    href={`https://wa.me/${whatsappNumber}?text=Halo,%20saya%20tertarik%20menghubungi%20${encodeURIComponent(websiteSettings?.siteName || "AllFanajalh")}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="w-full flex items-center justify-center gap-2 bg-white text-orange-600 py-3.5 font-bold text-sm rounded-xl transition-all active:scale-[0.98] hover:bg-orange-50 duration-200"
                                >
                                    <MessageCircle size={18} /> {orderPageOpen ? "Chat WhatsApp" : "Hubungi Admin"}
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-[#0B0F19] border border-slate-100 dark:border-white/5 p-8 md:p-12 rounded-3xl shadow-sm">
                            
                            {isSuccess ? (
                                /* Clean Success Message */
                                <div className="flex flex-col items-center text-center py-12 space-y-5 animate-in fade-in zoom-in-95 duration-500">
                                    <div className="w-16 h-16 bg-green-50 dark:bg-green-500/10 text-green-500 flex items-center justify-center rounded-2xl mb-2">
                                        <CheckCircle2 size={32} /> 
                                    </div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pesan Terkirim!</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-sm">
                                        Terima kasih telah menghubungi kami. Tim kami akan segera merespon pesan Anda secepatnya.
                                    </p>
                                    <button 
                                        onClick={() => setIsSuccess(false)}
                                        className="mt-4 px-8 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-white font-bold text-sm rounded-xl transition-colors duration-200"
                                    >
                                        Kirim Pesan Baru
                                    </button>
                                </div>
                            ) : (
                                /* Clean Form */
                                <>
                                    <div className="mb-8">
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                                            {orderPageOpen ? headersConfig.contact.formTitleOpen : headersConfig.contact.formTitleClosed}
                                        </h3>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                                            {orderPageOpen 
                                                ? headersConfig.contact.formDescOpen 
                                                : headersConfig.contact.formDescClosed}
                                        </p>
                                    </div>
                                    
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {!orderPageOpen && (
                                            <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider flex items-start gap-3 rounded-xl animate-in fade-in">
                                                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                                                <span>Layanan desain sedang tutup sementara. Anda tetap dapat mengirim pesan untuk notifikasi.</span>
                                            </div>
                                        )}

                                        {submitError && (
                                            <div className="p-4 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm flex items-start gap-3 rounded-xl animate-in fade-in">
                                                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                                                {submitError}
                                            </div>
                                        )}

                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">Nama Lengkap</label>
                                                <input 
                                                    type="text" name="name" value={formData.name} onChange={handleChange} required 
                                                    className="w-full px-4 py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border-none focus:bg-white dark:focus:bg-transparent focus:ring-2 focus:ring-orange-500/50 rounded-xl transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none" 
                                                    placeholder="John Doe" 
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">Email</label>
                                                <input 
                                                    type="email" name="email" value={formData.email} onChange={handleChange} required 
                                                    className="w-full px-4 py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border-none focus:bg-white dark:focus:bg-transparent focus:ring-2 focus:ring-orange-500/50 rounded-xl transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none" 
                                                    placeholder="john@example.com" 
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">Nomor WhatsApp</label>
                                            <input 
                                                type="tel" name="phone" value={formData.phone} onChange={handleChange} required 
                                                className="w-full px-4 py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border-none focus:bg-white dark:focus:bg-transparent focus:ring-2 focus:ring-orange-500/50 rounded-xl transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none" 
                                                placeholder="08xxxxxxxxxx" 
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">Pesan</label>
                                            <textarea 
                                                name="message" value={formData.message} onChange={handleChange} required rows={4} 
                                                className="w-full px-4 py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10 border-none focus:bg-white dark:focus:bg-transparent focus:ring-2 focus:ring-orange-500/50 rounded-xl transition-all text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none resize-none" 
                                                placeholder="Tulis detail kebutuhan Anda di sini..." 
                                            />
                                        </div>

                                        <div className="pt-2">
                                            <button 
                                                type="submit" 
                                                disabled={isSubmitting} 
                                                className={`w-full flex items-center justify-center gap-2 py-4 font-bold text-sm transition-all duration-300 rounded-xl ${
                                                    isSubmitting 
                                                    ? "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-600 cursor-not-allowed" 
                                                    : "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 active:scale-[0.98]"
                                                }`}
                                            >
                                                {isSubmitting ? (
                                                    <><Loader2 size={18} className="animate-spin" /> Mengirim...</>
                                                ) : (
                                                    <><Send size={18} /> {orderPageOpen ? "Kirim Pesan" : "Kirim Pesan & Notifikasi"}</>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}