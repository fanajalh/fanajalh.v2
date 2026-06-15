"use client"

import { useState, useEffect, Suspense } from "react"
import { Mail, Settings, Users, FileText, Send, Loader2, CheckCircle2, X, Eye, ChevronRight, AlertCircle, Upload } from "lucide-react"
import EcosystemNav from "@/components/sections/EcosystemNav"
import Swal from "sweetalert2"
import { useEcosystemAccess } from "@/lib/ecosystem-access-hook"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"

interface Contact { id: string; name: string; email: string; category: string; status: string }
interface Campaign { id: number; name: string; subject: string; status: string; total_recipients: number; sent_count: number; open_count: number; reply_count: number; sent_at: string }

const EMAIL_TEMPLATES = [
  {
    name: "Penawaran Bisnis",
    subject: "Penawaran Kerjasama — {{name}}",
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:30px;background:#fff;border:2px solid #000;"><h1 style="font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:2px;border-bottom:4px solid #000;padding-bottom:12px;">Penawaran Kerjasama</h1><p style="color:#333;line-height:1.8;margin:20px 0;">Halo <strong>{{name}}</strong>,</p><p style="color:#333;line-height:1.8;">Kami ingin memperkenalkan layanan kami yang dapat membantu bisnis Anda tumbuh lebih cepat. Dengan pengalaman kami di industri ini, kami yakin dapat memberikan solusi terbaik.</p><div style="background:#000;color:#fff;padding:16px 24px;text-align:center;margin:24px 0;font-weight:900;text-transform:uppercase;letter-spacing:2px;font-size:14px;">Hubungi Kami Untuk Demo Gratis</div><p style="color:#888;font-size:12px;margin-top:24px;">Email ini dikirim secara otomatis. Jika tidak relevan, abaikan saja.</p></div>`,
  },
  {
    name: "Follow-up",
    subject: "Follow Up Penawaran — {{name}}",
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:30px;background:#fff;border:2px solid #000;"><h1 style="font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:2px;border-bottom:4px solid #000;padding-bottom:12px;">Follow Up</h1><p style="color:#333;line-height:1.8;margin:20px 0;">Halo <strong>{{name}}</strong>,</p><p style="color:#333;line-height:1.8;">Beberapa waktu lalu kami mengirimkan penawaran kerjasama. Apakah Anda memiliki waktu untuk mendiskusikan lebih lanjut?</p><p style="color:#333;line-height:1.8;">Kami senang bisa menjawab pertanyaan apapun yang Anda miliki.</p><div style="background:#000;color:#fff;padding:16px 24px;text-align:center;margin:24px 0;font-weight:900;text-transform:uppercase;letter-spacing:2px;font-size:14px;">Balas Email Ini</div></div>`,
  },
  {
    name: "Promosi Produk",
    subject: "Promo Spesial Untuk {{name}}! 🎉",
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:30px;background:#fff;border:2px solid #000;"><h1 style="font-size:24px;font-weight:900;text-transform:uppercase;letter-spacing:2px;border-bottom:4px solid #000;padding-bottom:12px;">🎉 Promo Spesial</h1><p style="color:#333;line-height:1.8;margin:20px 0;">Halo <strong>{{name}}</strong>,</p><p style="color:#333;line-height:1.8;">Kami punya penawaran spesial yang tidak boleh Anda lewatkan! Dapatkan diskon eksklusif untuk layanan premium kami.</p><div style="background:#000;color:#fff;padding:20px;text-align:center;margin:24px 0;"><p style="font-size:32px;font-weight:900;margin:0;">DISKON 30%</p><p style="font-size:12px;margin-top:8px;text-transform:uppercase;letter-spacing:2px;">Berlaku hingga akhir bulan ini</p></div><p style="color:#888;font-size:12px;margin-top:24px;">Klik tombol di atas untuk klaim promo Anda.</p></div>`,
  },
]

function BlastPageContent() {
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
          const matched = filtered.find((c: Contact) => c.id === contactParam)
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
      Swal.fire({ icon: "warning", text: "Email dan password wajib diisi!" })
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
        Swal.fire({ icon: "error", text: data.message })
      }
    } catch { Swal.fire({ icon: "error", text: "Gagal menyimpan SMTP" }) }
    setSavingSmtp(false)
  }

  const selectTemplate = (idx: number) => {
    setSelectedTemplate(idx)
    setSubject(EMAIL_TEMPLATES[idx].subject)
    setTemplateHtml(EMAIL_TEMPLATES[idx].html)
  }

  const handleSend = async () => {
    if (!campaignName || !subject || !templateHtml) {
      Swal.fire({ icon: "warning", text: "Lengkapi semua data campaign!" })
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
      Swal.fire({ icon: "warning", text: "Pilih minimal 1 penerima!" })
      return
    }

    const confirm = await Swal.fire({
      title: "Kirim Blast?",
      text: `${recipients.length} email akan dikirim dari ${smtp.smtp_email}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Kirim!",
    })
    if (!confirm.isConfirmed) return

    setSending(true)
    try {
      // 1. Create campaign
      const campRes = await fetch("/api/blast/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: campaignName, subject, template_html: templateHtml, total_recipients: recipients.length }),
      })
      const campData = await campRes.json()
      if (!campData.success) throw new Error(campData.message)

      // 2. Send blast
      const sendRes = await fetch("/api/blast/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_id: campData.campaign.id, recipients }),
      })
      const sendData = await sendRes.json()

      if (sendData.success) {
        Swal.fire({ icon: "success", title: "Blast Selesai!", text: sendData.message })
        fetchCampaigns()
        setStep(1)
        setCampaignName("")
        setSubject("")
        setTemplateHtml("")
        setSelectedContacts([])
      } else {
        Swal.fire({ icon: "error", text: sendData.message })
      }
    } catch (e: any) {
      Swal.fire({ icon: "error", text: e.message || "Gagal mengirim blast" })
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
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-black dark:text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {!SelectorModal && <EcosystemNav />}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {SelectorModal ? (
          <div className="py-12">
            {SelectorModal}
          </div>
        ) : (
          <>
            <div className="mb-8 border-l-8 border-black dark:border-white pl-4">
              <h2 className="text-3xl font-black text-black dark:text-white uppercase tracking-widest">Blast Email</h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Kirim email massal dari alamat email Anda sendiri</p>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar">
              {STEPS.map((s, i) => (
                <div key={s.num} className="flex items-center">
                  <button
                    onClick={() => s.num <= step && setStep(s.num)}
                    className={`flex items-center gap-2 px-4 py-2.5 border-2 font-black uppercase tracking-widest text-xs transition-all ${
                      step === s.num
                        ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                        : step > s.num
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700"
                        : "bg-white dark:bg-black text-gray-400 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {step > s.num ? <CheckCircle2 size={14} /> : <s.icon size={14} />}
                    <span className="hidden sm:inline">{s.label}</span>
                  </button>
                  {i < STEPS.length - 1 && <ChevronRight size={16} className="text-gray-300 mx-1" />}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <div className="bg-white dark:bg-white/5 border-4 border-black dark:border-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)]">

              {/* Step 1: SMTP Setup */}
              {step === 1 && (
                <div>
                  <h3 className="text-lg font-black uppercase tracking-widest text-black dark:text-white mb-1">Konfigurasi SMTP</h3>
                  <p className="text-xs font-bold text-gray-500 mb-6">Email akan dikirim dari alamat email Anda sendiri</p>
                  {smtpLoading ? (
                    <div className="py-10 flex justify-center"><Loader2 size={24} className="animate-spin text-gray-400" /></div>
                  ) : (
                    <div className="space-y-4 max-w-lg">
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Email Address *</label>
                        <input value={smtp.smtp_email} onChange={(e) => setSmtp(p => ({ ...p, smtp_email: e.target.value }))} placeholder="email@gmail.com" className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">App Password *</label>
                        <input type="password" value={smtp.smtp_password} onChange={(e) => setSmtp(p => ({ ...p, smtp_password: e.target.value }))} placeholder="App password dari Google" className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none" />
                        <p className="text-[10px] font-bold text-gray-400 mt-1">Google Account → Security → 2-Step Verification → App Passwords</p>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Nama Pengirim</label>
                        <input value={smtp.display_name} onChange={(e) => setSmtp(p => ({ ...p, display_name: e.target.value }))} placeholder="Nama Bisnis Anda" className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none" />
                      </div>
                      <div className="flex gap-3 pt-4">
                        <button onClick={saveSmtp} disabled={savingSmtp} className="flex-1 flex items-center justify-center gap-2 py-3 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-sm border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50">
                          {savingSmtp ? <Loader2 size={16} className="animate-spin" /> : <Settings size={16} />}
                          {smtpConfigured ? "Update SMTP" : "Simpan SMTP"}
                        </button>
                        {smtpConfigured && (
                          <button onClick={() => setStep(2)} className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white font-black uppercase tracking-widest text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                            Lanjut <ChevronRight size={16} />
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
                  <h3 className="text-lg font-black uppercase tracking-widest text-black dark:text-white mb-1">Pilih Target</h3>
                  <div className="flex gap-2 mb-4">
                    <button onClick={() => setInputMode("crm")} className={`px-4 py-2 text-xs font-black uppercase tracking-widest border-2 transition-all ${inputMode === "crm" ? "bg-black dark:bg-white text-white dark:text-black border-black" : "bg-white text-gray-500 border-gray-300 hover:border-black"}`}>
                      Dari CRM
                    </button>
                    <button onClick={() => setInputMode("manual")} className={`px-4 py-2 text-xs font-black uppercase tracking-widest border-2 transition-all ${inputMode === "manual" ? "bg-black dark:bg-white text-white dark:text-black border-black" : "bg-white text-gray-500 border-gray-300 hover:border-black"}`}>
                      Input Manual
                    </button>
                  </div>

                  {inputMode === "crm" ? (
                    <div>
                      <p className="text-xs font-bold text-gray-500 mb-4">{selectedContacts.length} dipilih dari {contacts.length} kontak (hanya yang punya email)</p>
                      <div className="max-h-[400px] overflow-y-auto border-2 border-black dark:border-white">
                        {contacts.map(c => (
                          <div key={c.id} onClick={() => toggleContact(c.id)} className={`flex items-center gap-3 p-3 border-b border-gray-200 dark:border-white/10 cursor-pointer transition-colors ${selectedContacts.includes(c.id) ? "bg-emerald-50 dark:bg-emerald-900/20" : "hover:bg-gray-50 dark:hover:bg-white/5"}`}>
                            <div className={`w-5 h-5 border-2 border-black dark:border-white flex items-center justify-center ${selectedContacts.includes(c.id) ? "bg-emerald-500" : ""}`}>
                              {selectedContacts.includes(c.id) && <CheckCircle2 size={12} className="text-white" />}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-black text-sm text-black dark:text-white truncate">{c.name}</p>
                              <p className="text-[10px] font-bold text-gray-400 truncate">{c.email}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold text-gray-500 mb-2">Satu email per baris. Format: email,nama (nama opsional)</p>
                      <textarea value={manualEmails} onChange={(e) => setManualEmails(e.target.value)} rows={8} placeholder={`john@example.com,John Doe\njane@example.com,Jane`} className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-mono focus:outline-none" />
                    </div>
                  )}
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(1)} className="px-6 py-3 border-2 border-black dark:border-white font-black uppercase tracking-widest text-xs hover:bg-gray-100 dark:hover:bg-white/10 transition-all">Kembali</button>
                    <button onClick={() => setStep(3)} className="flex-1 py-3 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-sm border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2">
                      Lanjut <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Template */}
              {step === 3 && (
                <div>
                  <h3 className="text-lg font-black uppercase tracking-widest text-black dark:text-white mb-1">Template Email</h3>
                  <p className="text-xs font-bold text-gray-500 mb-4">Pilih template atau buat custom. Gunakan {"{{name}}"} untuk nama penerima.</p>

                  <div className="grid sm:grid-cols-3 gap-3 mb-6">
                    {EMAIL_TEMPLATES.map((t, i) => (
                      <button key={i} onClick={() => selectTemplate(i)} className={`p-4 border-2 text-left transition-all ${selectedTemplate === i ? "border-black dark:border-white bg-gray-50 dark:bg-white/10 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" : "border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white"}`}>
                        <p className="font-black text-sm text-black dark:text-white uppercase tracking-wider">{t.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 mt-1 truncate">{t.subject}</p>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Nama Campaign</label>
                      <input value={campaignName} onChange={(e) => setCampaignName(e.target.value)} placeholder="Campaign Q1 2025" className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Subject Email</label>
                      <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject email..." className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-sm font-bold focus:outline-none" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Template HTML</label>
                        <button onClick={() => setShowPreview(true)} className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-700 flex items-center gap-1">
                          <Eye size={12} /> Preview
                        </button>
                      </div>
                      <textarea value={templateHtml} onChange={(e) => setTemplateHtml(e.target.value)} rows={10} className="w-full px-4 py-3 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white text-xs font-mono focus:outline-none" />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(2)} className="px-6 py-3 border-2 border-black dark:border-white font-black uppercase tracking-widest text-xs hover:bg-gray-100 dark:hover:bg-white/10 transition-all">Kembali</button>
                    <button onClick={() => setStep(4)} className="flex-1 py-3 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest text-sm border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2">
                      Review & Kirim <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Send */}
              {step === 4 && (
                <div>
                  <h3 className="text-lg font-black uppercase tracking-widest text-black dark:text-white mb-1">Review & Kirim</h3>
                  <div className="space-y-4 mt-6">
                    <div className="p-4 border-2 border-black dark:border-white">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Campaign</p>
                      <p className="font-black text-black dark:text-white">{campaignName || "—"}</p>
                    </div>
                    <div className="p-4 border-2 border-black dark:border-white">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Subject</p>
                      <p className="font-black text-black dark:text-white">{subject || "—"}</p>
                    </div>
                    <div className="p-4 border-2 border-black dark:border-white">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Dari</p>
                      <p className="font-black text-black dark:text-white">{smtp.display_name ? `${smtp.display_name} <${smtp.smtp_email}>` : smtp.smtp_email}</p>
                    </div>
                    <div className="p-4 border-2 border-black dark:border-white">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Penerima</p>
                      <p className="font-black text-black dark:text-white text-2xl">{inputMode === "crm" ? selectedContacts.length : manualEmails.split("\n").filter(e => e.trim()).length} orang</p>
                    </div>
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700">
                      <div className="flex items-start gap-2">
                        <AlertCircle size={16} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs font-bold text-yellow-700 dark:text-yellow-300">Email dikirim 1 per detik untuk menghindari spam flag. Proses mungkin memakan waktu beberapa menit.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setStep(3)} className="px-6 py-3 border-2 border-black dark:border-white font-black uppercase tracking-widest text-xs hover:bg-gray-100 dark:hover:bg-white/10 transition-all">Kembali</button>
                    <button onClick={handleSend} disabled={sending} className="flex-1 py-3 bg-emerald-500 text-white font-black uppercase tracking-widest text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                      {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      {sending ? "Mengirim..." : "Kirim Blast Sekarang"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Campaign History */}
            {campaigns.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-black uppercase tracking-widest text-black dark:text-white mb-4">Riwayat Campaign</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-black dark:border-white">
                  {campaigns.map(c => (
                    <div key={c.id} className="p-4 border-r border-b border-black dark:border-white bg-white dark:bg-black">
                      <p className="font-black text-sm text-black dark:text-white uppercase tracking-wider truncate">{c.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 mt-1">{c.subject}</p>
                      <div className="flex gap-4 mt-3">
                        <div><p className="text-lg font-black text-black dark:text-white">{c.sent_count}</p><p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Sent</p></div>
                        <div><p className="text-lg font-black text-emerald-500">{c.open_count}</p><p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Open</p></div>
                        <div><p className="text-lg font-black text-blue-500">{c.reply_count}</p><p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Reply</p></div>
                      </div>
                      <div className="mt-2 h-2 bg-gray-100 dark:bg-white/10 border border-black dark:border-white">
                        <div className="h-full bg-emerald-500" style={{ width: `${c.sent_count > 0 ? (c.open_count / c.sent_count * 100) : 0}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-black border-4 border-black dark:border-white p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 border-b-4 border-black dark:border-white pb-4">
              <h3 className="font-black uppercase tracking-widest text-black dark:text-white">Preview Email</h3>
              <button onClick={() => setShowPreview(false)} className="p-2 border-2 border-black dark:border-white hover:bg-black hover:text-white transition-all"><X size={18} /></button>
            </div>
            <div className="border-2 border-gray-200 p-4" dangerouslySetInnerHTML={{ __html: templateHtml.replace(/\{\{name\}\}/g, "John Doe") }} />
          </div>
        </div>
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}

export default function BlastPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-black dark:text-white" />
      </div>
    }>
      <BlastPageContent />
    </Suspense>
  )
}
