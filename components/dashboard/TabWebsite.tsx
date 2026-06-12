"use client"

import { Save, Edit, Globe, Instagram, Phone, Mail, Link as LinkIcon, Palette, MessageSquare } from "lucide-react"
import type { WebsiteSettings } from "./types"

interface Props {
  settings: WebsiteSettings
  setSettings: (s: WebsiteSettings) => void
  editing: boolean
  setEditing: (e: boolean) => void
  onSave: () => void
}

export function TabWebsite({ settings, setSettings, editing, setEditing, onSave }: Props) {
  const update = (key: keyof WebsiteSettings, value: any) => {
    setSettings({ ...settings, [key]: value })
  }

  const inputClass = `w-full pl-11 pr-4 py-3.5 bg-white border-2 border-black rounded-none text-sm font-black text-black outline-none focus:bg-black focus:text-white transition-all placeholder:text-gray-400 focus:placeholder:text-gray-500 uppercase tracking-widest ${!editing ? "opacity-50 cursor-not-allowed bg-gray-200" : ""}`

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-black text-white rounded-none flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Globe size={24} strokeWidth={3} />
          </div>
          <div>
            <h2 className="text-xl font-black text-black uppercase tracking-widest leading-none">IDENTITAS WEBSITE</h2>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">INFORMASI PUBLIK</p>
          </div>
        </div>
        
        {editing ? (
          <button onClick={onSave} className="flex items-center justify-center gap-2 px-6 py-3 bg-green-400 text-black border-2 border-black font-black uppercase tracking-widest rounded-none text-xs hover:bg-white active:translate-y-0.5 active:shadow-none transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none shrink-0">
            <Save size={16} strokeWidth={3} /> SIMPAN
          </button>
        ) : (
          <button onClick={() => setEditing(true)} className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white border-2 border-black font-black uppercase tracking-widest rounded-none text-xs hover:bg-white hover:text-black active:translate-y-0.5 active:shadow-none transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none shrink-0">
            <Edit size={16} strokeWidth={3} /> EDIT
          </button>
        )}
      </div>

      <div className="bg-white rounded-none border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8">
        
        {/* General Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-black uppercase tracking-widest">NAMA BRAND / SITUS</label>
            <div className="relative">
              <Globe size={18} strokeWidth={3} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={settings.siteName} onChange={(e) => update("siteName", e.target.value)} disabled={!editing} className={inputClass} placeholder="NAMA WEBSITE" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[11px] font-black text-black uppercase tracking-widest">TEMA WARNA UTAMA</label>
            <div className="flex items-center gap-3">
              {/* Color Picker Box */}
              <div className="relative w-12 h-12 rounded-none overflow-hidden border-2 border-black shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <input type="color" value={settings.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} disabled={!editing} className="absolute -top-2 -left-2 w-20 h-20 cursor-pointer" />
              </div>
              <div className="relative flex-1">
                <Palette size={18} strokeWidth={3} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={settings.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} disabled={!editing} className={inputClass} placeholder="#000000" />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[11px] font-black text-black uppercase tracking-widest">SLOGAN / TAGLINE</label>
            <div className="relative">
              <MessageSquare size={18} strokeWidth={3} className="absolute left-4 top-4 text-gray-400" />
              <textarea rows={2} value={settings.tagline} onChange={(e) => update("tagline", e.target.value)} disabled={!editing} className={`${inputClass} resize-none pt-4`} placeholder="TAGLINE BRAND ANDA..." />
            </div>
          </div>
        </div>

        <hr className="border-t-4 border-black border-dashed" />

        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-2">
            <label className="text-[11px] font-black text-black uppercase tracking-widest">NOMOR WHATSAPP</label>
            <div className="relative">
              <Phone size={18} strokeWidth={3} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={settings.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} disabled={!editing} className={inputClass} placeholder="628123456789" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black text-black uppercase tracking-widest">ALAMAT EMAIL</label>
            <div className="relative">
              <Mail size={18} strokeWidth={3} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" value={settings.email} onChange={(e) => update("email", e.target.value)} disabled={!editing} className={inputClass} placeholder="ADMIN@DOMAIN.COM" />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[11px] font-black text-black uppercase tracking-widest">USERNAME INSTAGRAM</label>
            <div className="relative">
              <Instagram size={18} strokeWidth={3} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={settings.instagram} onChange={(e) => update("instagram", e.target.value)} disabled={!editing} className={inputClass} placeholder="@USERNAME_IG" />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  )
}