"use client"

import { useState, useEffect, Suspense } from "react"
import { Mail, Settings, Users, FileText, Send, Loader2, CheckCircle2, X, Eye, ChevronRight, AlertCircle, ChevronLeft } from "lucide-react"
import Link from "next/link"
import Swal from "@/lib/custom-alert"
import { useEcosystemAccess } from "@/lib/ecosystem-access-hook"
import EcosystemMobileNav from "@/components/sections/EcosystemMobileNav"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"

interface Contact { id: string; name: string; email: string; category: string; status: string }
interface Campaign { id: number; name: string; subject: string; status: string; total_recipients: number; sent_count: number; open_count: number; reply_count: number; sent_at: string }

const EMAIL_TEMPLATES = [
  {
    name: "Penawaran Bisnis",
    subject: "Penawaran Kerjasama — {{name}}",
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:35px;background:#f8fafc;border-radius:24px;border:1px solid #e2e8f0;"><h1 style="font-size:20px;font-weight:900;text-transform:uppercase;color:#ea580c;border-bottom:3px solid #ea580c;padding-bottom:10px;">Penawaran Kerjasama</h1><p style="color:#475569;line-height:1.7;margin:20px 0;">Halo <strong>{{name}}</strong>,</p><p style="color:#475569;line-height:1.7;">Kami ingin memperkenalkan layanan kami yang dapat membantu bisnis Anda tumbuh lebih cepat. Dengan pengalaman kami di industri ini, kami yakin dapat memberikan solusi terbaik.</p><div style="background:#ea580c;color:#fff;padding:14px 20px;text-align:center;margin:24px 0;font-weight:800;border-radius:12px;font-size:13px;">Hubungi Kami Untuk Demo Gratis</div><p style="color:#94a3b8;font-size:11px;margin-top:24px;text-align:center;">Email ini dikirim secara otomatis. Jika tidak relevan, abaikan saja.</p></div>`,
  },
  {
    name: "Follow-up",
    subject: "Follow Up Penawaran — {{name}}",
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:35px;background:#f8fafc;border-radius:24px;border:1px solid #e2e8f0;"><h1 style="font-size:20px;font-weight:900;text-transform:uppercase;color:#ea580c;border-bottom:3px solid #ea580c;padding-bottom:10px;">Follow Up Penawaran</h1><p style="color:#475569;line-height:1.7;margin:20px 0;">Halo <strong>{{name}}</strong>,</p><p style="color:#475569;line-height:1.7;">Beberapa waktu lalu kami mengirimkan penawaran kerjasama. Apakah Anda memiliki waktu untuk mendiskusikan lebih lanjut?</p><p style="color:#475569;line-height:1.7;">Kami senang bisa menjawab pertanyaan apapun yang Anda miliki.</p><div style="background:#0f172a;color:#fff;padding:14px 20px;text-align:center;margin:24px 0;font-weight:800;border-radius:12px;font-size:13px;">Balas Email Ini</div></div>`,
  },
  {
    name: "Promosi Produk",
    subject: "Promo Spesial Untuk {{name}}! 🎉",
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:35px;background:#f8fafc;border-radius:24px;border:1px solid #e2e8f0;"><h1 style="font-size:20px;font-weight:900;text-transform:uppercase;color:#ea580c;border-bottom:3px solid #ea580c;padding-bottom:10px;">🎉 Promo Spesial</h1><p style="color:#475569;line-height:1.7;margin:20px 0;">Halo <strong>{{name}}</strong>,</p><p style="color:#475569;line-height:1.7;">Kami punya penawaran spesial yang tidak boleh Anda lewatkan! Dapatkan diskon eksklusif untuk layanan premium kami.</p><div style="background:#ea580c;color:#fff;padding:20px;text-align:center;margin:24px 0;border-radius:16px;"><p style="font-size:28px;font-weight:900;margin:0;">DISKON 30%</p><p style="font-size:11px;margin-top:6px;text-transform:uppercase;letter-spacing:1px;opacity:0.9;">Berlaku hingga akhir bulan ini</p></div><p style="color:#94a3b8;font-size:11px;margin-top:24px;text-align:center;">Klik tombol di atas untuk klaim promo Anda.</p></div>`,
  },
]

function MobileBlastPageContent() {
  const { loading: accessLoading, allowed, SelectorModal } = useEcosystemAccess("blast")
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const contactParam = searchParams?.get("contact")

  const [step, setStep] = useState(1)
  const [smtpConfigured, setSmtpConfigured] = useState(false)
  const [smtpLoading, setSmtpLoading] = useState(true)
  const [smtp, setSmtp] = useState({ smtp_email: "", smtp_password: "", smtp_host: "smtp.gmail.com", smtp_port: 587, display_name: "" })
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContacts, setSelectedContacts] = useState<string[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [campaignName, setCampaignName] = useState("")
  const [subject, setSubject] = useState("")
  const [templateHtml, setTemplateHtml] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState(-1)
  const [sending, setSending] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [savingSmtp, setSavingSmtp] = useState(false)
  const [manualEmails, setManualEmails] = useState("")
  const [inputMode, setInputMode] = useState<"crm" | "manual">("crm")

  useEffect(() => {
    fetchSmtp()
    fetchContacts()
    fetchCampaigns()
  }, [session, contactParam])

  const fetchSmtp = async () => {
    setSmtpLoading(true)
    try {
      const res = await fetch(`/api/blast/smtp`)
      const data = await res.json()
      if (data.configured) {
        setSmtpConfigured(true)
        setSmtp(prev => ({ ...prev, smtp_email: data.settings.smtp_email, smtp_host: data.settings.smtp_host, smtp_port: data.settings.smtp_port, display_name: data.settings.display_name || "" }))
      }
    } catch { }
    setSmtpLoading(false)
  }

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/crm?limit=100")
      const data = await res.json()
      if (data.success) {
        const filtered = data.contacts.filter((c: Contact) => c.email)
        setContacts(filtered)

        // Pre-select contact from URL parameter
        if (contactParam) {
          const matched = filtered.find(c => c.id === contactParam)
          if (matched) {
            setSelectedContacts([matched.id])
            setInputMode("crm")
            setStep(2) // Jump directly to target step
          }
        }
      }
    } catch { }
  }

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/blast/campaign")
      const data = await res.json()
      if (data.success) setCampaigns(data.campaigns)
    } catch { }
  }

  const saveSmtp = async () => {
    if (!smtp.smtp_email || !smtp.smtp_password) {
      Swal.fire({ icon: "warning", text: "Email dan password wajib diisi!", confirmButtonColor: "#ea580c" })
      return
    }
    setSavingSmtp(true)
    try {
      const res = await fetch("/api/blast/smtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(smtp),
      })
      const data = await res.json()
      if (data.success) {
        setSmtpConfigured(true)
        Swal.fire({ icon: "success", text: "SMTP berhasil disimpan!", timer: 1500, showConfirmButton: false })
      } else {
        Swal.fire({ icon: "error", text: data.message, confirmButtonColor: "#ea580c" })
      }
    } catch { Swal.fire({ icon: "error", text: "Gagal menyimpan SMTP", confirmButtonColor: "#ea580c" }) }
    setSavingSmtp(false)
  }

  const selectTemplate = (idx: number) => {
    setSelectedTemplate(idx)
    setSubject(EMAIL_TEMPLATES[idx].subject)
    setTemplateHtml(EMAIL_TEMPLATES[idx].html)
  }

  const handleSend = async () => {
    if (!campaignName || !subject || !templateHtml) {
      Swal.fire({ icon: "warning", text: "Lengkapi semua data campaign!", confirmButtonColor: "#ea580c" })
      return
    }

    let recipients: any[] = []
    if (inputMode === "crm") {
      recipients = contacts
        .filter(c => selectedContacts.includes(c.id))
        .map(c => ({ contact_id: c.id, email: c.email, name: c.name }))
    } else {
      recipients = manualEmails.split("\n").filter(e => e.trim()).map(line => {
        const [email, name] = line.split(",").map(s => s.trim())
        return { email, name: name || email }
      })
    }

    if (recipients.length === 0) {
      Swal.fire({ icon: "warning", text: "Pilih minimal 1 penerima!", confirmButtonColor: "#ea580c" })
      return
    }

    const confirm = await Swal.fire({
      title: "Kirim Blast?",
      text: `${recipients.length} email akan dikirim dari ${smtp.smtp_email}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Kirim!",
      confirmButtonColor: "#ea580c",
      cancelButtonColor: "#64748b"
    })
    if (!confirm.isConfirmed) return

    setSending(true)
    try {
      const campRes = await fetch("/api/blast/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: campaignName, subject, template_html: templateHtml, total_recipients: recipients.length }),
      })
      const campData = await campRes.json()
      if (!campData.success) throw new Error(campData.message)

      const sendRes = await fetch("/api/blast/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_id: campData.campaign.id, recipients }),
      })
      const sendData = await sendRes.json()

      if (sendData.success) {
        Swal.fire({ icon: "success", title: "Blast Selesai!", text: sendData.message, confirmButtonColor: "#ea580c" })
        fetchCampaigns()
        setStep(1)
        setCampaignName("")
        setSubject("")
        setTemplateHtml("")
        setSelectedContacts([])
      } else {
        Swal.fire({ icon: "error", text: sendData.message, confirmButtonColor: "#ea580c" })
      }
    } catch (e: any) {
      Swal.fire({ icon: "error", text: e.message || "Gagal mengirim blast", confirmButtonColor: "#ea580c" })
    }
    setSending(false)
  }

  const toggleContact = (id: string) => setSelectedContacts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const STEPS = [
    { num: 1, label: "SMTP", icon: Settings },
    { num: 2, label: "Target", icon: Users },
    { num: 3, label: "Template", icon: FileText },
    { num: 4, label: "Kirim", icon: Send },
  ]

  if (accessLoading || !allowed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-orange-600" />
      </div>
    )
  }

  if (SelectorModal) {
    return SelectorModal
  }

  return (
    <div className="bg-[#f4f6f9] min-h-screen pb-24 font-sans select-none w-full flex flex-col items-center">
      <div className="w-full max-w-md bg-[#f4f6f9] min-h-screen flex flex-col">
        {/* 1. SUPER APP HEADER */}
        <div className="bg-orange-600 pt-12 pb-6 px-4 rounded-b-[2rem] shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <Link href="/home" className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors active:scale-95">
              <ChevronLeft size={24} strokeWidth={2.5} />
            </Link>
            <div className="flex-1">
              <h1 className="text-white text-lg font-extrabold tracking-tight">Blast Email</h1>
              <p className="text-orange-100 text-xs font-medium">Kirim Email Massal Mandiri</p>
            </div>
          </div>
        </div>

        {/* 2. PROGRESSION TABS SUBHEADER */}
        <EcosystemMobileNav />

        {/* 3. STEPPER INDICATOR */}
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between bg-white rounded-full px-2 py-1.5 border border-slate-100 shadow-sm">
            {STEPS.map((s, i) => (
              <button
                key={s.num}
                onClick={() => s.num <= step && setStep(s.num)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 ${
                  step === s.num
                    ? "bg-slate-900 text-white shadow-sm"
                    : step > s.num
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {step > s.num ? <CheckCircle2 size={12} /> : <s.icon size={12} />}
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. STEP CONTENT CARD */}
        <div className="px-4 mt-4">
          <div className="bg-white rounded-[2rem] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100">
            {/* Step 1: SMTP Settings */}
            {step === 1 && (
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide mb-1">Pengaturan SMTP</h3>
                <p className="text-[11px] font-semibold text-slate-400 mb-5">Email akan terkirim dengan alamat personal SMTP Anda.</p>
                {smtpLoading ? (
                  <div className="py-10 flex justify-center"><Loader2 size={24} className="animate-spin text-orange-500" /></div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Alamat Email *</label>
                      <input value={smtp.smtp_email} onChange={(e) => setSmtp(p => ({ ...p, smtp_email: e.target.value }))} placeholder="email@gmail.com" className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">App Password *</label>
                      <input type="password" value={smtp.smtp_password} onChange={(e) => setSmtp(p => ({ ...p, smtp_password: e.target.value }))} placeholder="App password dari akun Google" className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-colors" />
                      <p className="text-[9px] font-bold text-slate-400 mt-1 pl-1 leading-normal">Google Account → Security → 2-Step Verification → App Passwords</p>
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Nama Tampilan</label>
                      <input value={smtp.display_name} onChange={(e) => setSmtp(p => ({ ...p, display_name: e.target.value }))} placeholder="Nama pengirim (e.g. Fanz Brand)" className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-colors" />
                    </div>
                    <div className="flex gap-2.5 pt-4">
                      <button onClick={saveSmtp} disabled={savingSmtp} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-colors active:scale-95 flex items-center justify-center gap-1.5 disabled:opacity-50">
                        {savingSmtp ? <Loader2 size={14} className="animate-spin" /> : <Settings size={14} />}
                        {smtpConfigured ? "Update SMTP" : "Simpan SMTP"}
                      </button>
                      {smtpConfigured && (
                        <button onClick={() => setStep(2)} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-colors active:scale-95 flex items-center justify-center gap-1">
                          Lanjut <ChevronRight size={14} strokeWidth={3} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Target */}
            {step === 2 && (
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide mb-4">Pilih Penerima</h3>
                <div className="flex gap-2 mb-4 bg-slate-50 p-1 rounded-full border border-slate-200/80">
                  <button onClick={() => setInputMode("crm")} className={`flex-1 py-2 rounded-full text-[11px] font-extrabold uppercase transition-all ${inputMode === "crm" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"}`}>
                    Dari CRM
                  </button>
                  <button onClick={() => setInputMode("manual")} className={`flex-1 py-2 rounded-full text-[11px] font-extrabold uppercase transition-all ${inputMode === "manual" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400"}`}>
                    Input Manual
                  </button>
                </div>

                {inputMode === "crm" ? (
                  <div className="flex flex-col">
                    <p className="text-[11px] font-bold text-slate-400 mb-3">{selectedContacts.length} dipilih dari {contacts.length} kontak ber-email.</p>
                    <div className="max-h-[300px] overflow-y-auto border border-slate-200/80 rounded-2xl bg-slate-50 p-2 flex flex-col gap-1.5">
                      {contacts.map(c => (
                        <div key={c.id} onClick={() => toggleContact(c.id)} className={`flex items-center gap-3 p-2.5 rounded-xl bg-white border border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${selectedContacts.includes(c.id) ? 'bg-emerald-50/50 border-emerald-200' : ''}`}>
                          <div className={`w-5 h-5 border rounded-md flex items-center justify-center shrink-0 transition-colors ${selectedContacts.includes(c.id) ? "bg-emerald-600 border-emerald-600" : "bg-white border-slate-300"}`}>
                            {selectedContacts.includes(c.id) && <CheckCircle2 size={12} className="text-white" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-extrabold text-xs text-slate-800 truncate">{c.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 truncate">{c.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 mb-2">Format: email,nama (satu per baris, nama opsional)</p>
                    <textarea value={manualEmails} onChange={(e) => setManualEmails(e.target.value)} rows={7} placeholder={`budi@gmail.com,Budi\nani@gmail.com`} className="w-full px-4 py-3 bg-slate-50 text-slate-850 border border-slate-200/80 rounded-2xl text-xs font-mono outline-none focus:border-orange-500 transition-colors" />
                  </div>
                )}

                <div className="flex gap-2.5 mt-6">
                  <button onClick={() => setStep(1)} className="px-5 py-3 border border-slate-200 rounded-full font-extrabold text-xs text-slate-500 hover:bg-slate-50 transition-all">Kembali</button>
                  <button onClick={() => setStep(3)} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-full text-xs font-extrabold uppercase tracking-widest transition-colors active:scale-95 flex items-center justify-center gap-1 shadow-sm shadow-orange-600/30">
                    Lanjut <ChevronRight size={14} strokeWidth={3} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Template */}
            {step === 3 && (
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide mb-1.5">Template & Konten</h3>
                <p className="text-[11px] font-semibold text-slate-400 mb-4">Gunakan {"{{name}}"} untuk menyisipkan nama penerima.</p>

                <div className="flex gap-2 overflow-x-auto snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mb-5 py-1">
                  {EMAIL_TEMPLATES.map((t, i) => (
                    <button key={i} onClick={() => selectTemplate(i)} className={`snap-center px-4 py-2.5 rounded-2xl border text-left shrink-0 transition-all ${selectedTemplate === i ? "border-slate-800 bg-slate-900 text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-slate-400"}`}>
                      <p className="font-extrabold text-xs">{t.name}</p>
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Nama Campaign</label>
                    <input value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="e.g. Campaign Followup Juni" className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Subject Email</label>
                    <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject pesan..." className="w-full px-4 py-3 bg-slate-50 text-slate-800 border border-slate-200/80 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500 transition-colors" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Konten HTML</label>
                      <button onClick={() => setShowPreview(true)} className="text-[10px] font-extrabold uppercase text-orange-600 hover:underline flex items-center gap-1">
                        <Eye size={12} /> Preview HTML
                      </button>
                    </div>
                    <textarea value={templateHtml} onChange={(e) => setTemplateHtml(e.target.value)} rows={9} className="w-full px-4 py-3 bg-slate-50 text-slate-850 border border-slate-200/80 rounded-2xl text-xs font-mono outline-none focus:border-orange-500 transition-colors" />
                  </div>
                </div>

                <div className="flex gap-2.5 mt-6">
                  <button onClick={() => setStep(2)} className="px-5 py-3 border border-slate-200 rounded-full font-extrabold text-xs text-slate-500 hover:bg-slate-50 transition-all">Kembali</button>
                  <button onClick={() => setStep(4)} className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-full text-xs font-extrabold uppercase tracking-widest transition-colors active:scale-95 flex items-center justify-center gap-1 shadow-sm shadow-orange-600/30">
                    Review <ChevronRight size={14} strokeWidth={3} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Kirim */}
            {step === 4 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide mb-2">Review Campaign</h3>
                
                <div className="flex flex-col gap-3">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-450 mb-0.5">Campaign Name</p>
                    <p className="font-extrabold text-xs text-slate-800">{campaignName || "—"}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-450 mb-0.5">Subject</p>
                    <p className="font-extrabold text-xs text-slate-800">{subject || "—"}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-450 mb-0.5">Alamat Pengirim</p>
                    <p className="font-extrabold text-xs text-slate-800">{smtp.display_name ? `${smtp.display_name} <${smtp.smtp_email}>` : smtp.smtp_email}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-450 mb-0.5">Jumlah Penerima</p>
                    <p className="font-black text-2xl text-slate-800">{inputMode === "crm" ? selectedContacts.length : manualEmails.split("\n").filter(e => e.trim()).length} Orang</p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-2">
                  <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-semibold text-amber-700 leading-normal">Email dikirim secara bertahap (1 email/detik) demi mencegah masuk ke folder spam. Harap tidak menutup halaman ini selama proses berjalan.</p>
                </div>

                <div className="flex gap-2.5 mt-6">
                  <button onClick={() => setStep(3)} className="px-5 py-3 border border-slate-200 rounded-full font-extrabold text-xs text-slate-500 hover:bg-slate-50 transition-all">Kembali</button>
                  <button onClick={handleSend} disabled={sending} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-colors active:scale-95 flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-600/20 disabled:opacity-50">
                    {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {sending ? "Mengirim..." : "Kirim Blast Sekarang"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 5. CAMPAIGN HISTORY CARD LIST */}
        {campaigns.length > 0 && (
          <div className="px-4 mt-8 flex flex-col gap-4">
            <h3 className="text-sm font-extrabold text-slate-850 uppercase tracking-wider pl-1">Riwayat Pengiriman</h3>
            
            <div className="flex flex-col gap-3">
              {campaigns.map(c => (
                <div key={c.id} className="p-5 rounded-[1.8rem] border border-slate-100 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  <h4 className="font-extrabold text-[13px] text-slate-855 truncate">{c.name}</h4>
                  <p className="text-[11px] font-semibold text-slate-400 mt-1 truncate">{c.subject}</p>
                  
                  <div className="flex gap-6 mt-4 border-t border-slate-100 pt-3.5">
                    <div>
                      <p className="text-lg font-black text-slate-800">{c.sent_count}</p>
                      <p className="text-[9px] font-extrabold text-slate-450 uppercase tracking-widest mt-0.5">Terkirim</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-emerald-600">{c.open_count}</p>
                      <p className="text-[9px] font-extrabold text-slate-450 uppercase tracking-widest mt-0.5">Dibuka</p>
                    </div>
                    <div>
                      <p className="text-lg font-black text-blue-600">{c.reply_count}</p>
                      <p className="text-[9px] font-extrabold text-slate-450 uppercase tracking-widest mt-0.5">Dibalas</p>
                    </div>
                  </div>

                  <div className="mt-3.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${c.sent_count > 0 ? (c.open_count / c.sent_count * 100) : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* HTML PREVIEW MODAL */}
      {showPreview && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] p-6 shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-855 uppercase tracking-wide">Pratinjau Email</h3>
              <button onClick={() => setShowPreview(false)} className="bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500 rounded-full p-2 transition-all"><X size={16} /></button>
            </div>
            <div className="border border-slate-200/80 rounded-2xl p-4 overflow-x-hidden bg-slate-50" dangerouslySetInnerHTML={{ __html: templateHtml.replace(/\{\{name\}\}/g, "John Doe") }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function MobileBlastPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-orange-600" />
      </div>
    }>
      <MobileBlastPageContent />
    </Suspense>
  )
}
