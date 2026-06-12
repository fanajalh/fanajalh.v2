"use client";

import { useState } from "react";

import { Send, User, Mail, Tag, FileText, CheckCircle, X, Sparkles, Loader2, MessageSquare } from "lucide-react";
import Swal from "sweetalert2";

const categories = [
  { value: "Desain UI/UX", icon: "🎨" },
  { value: "Fitur Baru", icon: "✨" },
  { value: "Perbaikan Bug", icon: "🐛" },
  { value: "Performa", icon: "⚡" },
  { value: "Dokumentasi", icon: "📚" },
  { value: "Lainnya", icon: "💡" },
];

export default function SuggestionForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!category.trim()) {
      Swal.fire({ icon: 'warning', title: 'Oops...', text: 'Category wajib diisi!' });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, category, message }),
      });

      const result = await res.json();

      if (!res.ok) {
        Swal.fire({ icon: 'error', title: 'Gagal', text: result.error || "Gagal mengirim saran." });
        return;
      }

      setShowSuccessPopup(true);
      setName("");
      setEmail("");
      setCategory("");
      setMessage("");

      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);

    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Terjadi kesalahan saat mengirim saran. Silakan coba lagi.' });
      console.error("Submission error:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section id="kirim-saran" className="py-20 relative overflow-hidden bg-[#FAFAFA] selection:bg-orange-100 selection:text-orange-900">
        
        {/* Dekorasi Background Oranye (Glow Orbs) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          
          {/* --- HEADER --- */}
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full mb-6 shadow-sm">
              <Sparkles size={14} className="text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">Suara Pengguna</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.1] mb-4">
              Punya Ide Brilian? <br />
              <span className="text-orange-500">Ayo Sampaikan.</span>
            </h2>
            <p className="text-lg text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
              JokiPoster terus berkembang berkat masukan komunitas. Kritik, saran, atau request fitur baru—kami siap mendengarkan.
            </p>
          </div>

          {/* --- FORM CONTAINER --- */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-gray-100 p-8 md:p-12 shadow-2xl shadow-orange-900/5 relative">
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Input Nama */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                    Nama <span className="font-medium text-gray-300">(Opsional)</span>
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Anonim"
                      className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Input Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                    Email <span className="font-medium text-gray-300">(Opsional)</span>
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@contoh.com"
                      className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Select Kategori */}
              <div className="space-y-1.5">
                <label htmlFor="category" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                  Kategori <span className="text-orange-500">*</span>
                </label>
                <div className="relative group">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className={`w-full pl-11 pr-12 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium outline-none appearance-none cursor-pointer ${
                      !category ? "text-gray-400" : "text-gray-900"
                    }`}
                  >
                    <option value="" disabled>Pilih topik saran Anda...</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value} className="text-gray-900">
                        {cat.icon} {cat.value}
                      </option>
                    ))}
                  </select>
                  {/* Custom Chevron Arrow */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Textarea Pesan */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                  Pesan & Detail <span className="text-orange-500">*</span>
                </label>
                <div className="relative group">
                  <FileText className="absolute left-4 top-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    placeholder="Ceritakan secara detail ide, fitur, atau masalah yang Anda temukan..."
                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm font-medium outline-none placeholder:text-gray-400 resize-none custom-scrollbar"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-xl shadow-orange-500/25 active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <span>Kirim Saran</span>
                    <Send size={18} className="ml-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* --- SUCCESS POPUP MODAL --- */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setShowSuccessPopup(false)}
          />

          <div className="relative bg-white rounded-[2.5rem] shadow-2xl p-8 max-w-sm w-full text-center transform transition-all border border-gray-100 animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex justify-center mb-6 mt-4">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping" />
                <div className="relative w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>

            <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Terima Kasih!</h3>
            <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
              Masukan kamu sudah kami terima dan akan segera masuk dapur evaluasi tim JokiPoster.
            </p>
            
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full animate-[shrink_3s_linear_forwards]" />
            </div>
            <p className="text-[10px] font-bold text-gray-400 mt-3 uppercase tracking-widest">
              Menutup otomatis
            </p>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      `}</style>
    </>
  );
}