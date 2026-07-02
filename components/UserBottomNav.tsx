"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Compass, ShoppingBag, User, Briefcase, Crown } from "lucide-react"
// Mock useCart hook to replace deleted cart component
function useCart() {
  return {
    totalItems: 0,
    setIsOpen: (isOpen: boolean) => {}
  }
}

export function UserBottomNav() {
  const pathname = usePathname()
  const { totalItems, setIsOpen } = useCart()

  return (
    <>
      {/* Tambahan animasi CSS Inline khusus untuk nav ini */}
      <style>{`
        @keyframes nav-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .animate-nav-float { animation: nav-float 3s ease-in-out infinite; }
      `}</style>
      
      <div className="fixed bottom-0 left-0 right-0 w-full max-w-[480px] mx-auto bg-white/90 backdrop-blur-xl border-t border-slate-100 flex justify-around items-center px-1 py-2 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-[90] pb-safe rounded-t-[1.5rem] select-none">
        
        {/* Kiri 1: Layanan */}
        <Link href="/layanan" className="flex flex-col items-center justify-center w-full py-1 group active:scale-95 transition-transform">
          <div className={`p-1.5 rounded-[1.2rem] transition-all duration-300 ${pathname === '/layanan' ? 'bg-orange-50 text-orange-600' : 'text-slate-400 group-hover:text-slate-700'}`}>
            <Compass size={24} strokeWidth={pathname === '/layanan' ? 2.5 : 2} />
          </div>
          <span className={`text-[10px] mt-1 font-bold ${pathname === '/layanan' ? 'text-orange-600' : 'text-slate-500'}`}>Layanan</span>
        </Link>

        {/* Kanan 1: Premium */}
        <Link href="/premium" className="flex flex-col items-center justify-center w-full py-1 group active:scale-95 transition-transform">
          <div className={`p-1.5 rounded-[1.2rem] transition-all duration-300 ${pathname === '/premium' ? 'bg-orange-50 text-orange-600' : 'text-slate-400 group-hover:text-slate-700'}`}>
            <Crown size={24} strokeWidth={pathname === '/premium' ? 2.5 : 2} />
          </div>
          <span className={`text-[10px] mt-1 font-bold ${pathname === '/premium' ? 'text-orange-600' : 'text-slate-500'}`}>Premium</span>
        </Link>

        {/* TENGAH: Floating Home Button */}
        <Link href="/home" className="flex flex-col items-center justify-center w-full group relative -top-7 active:scale-90 transition-transform z-50">
          <div className="w-[60px] h-[60px] bg-orange-600 rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_rgba(234,88,12,0.4)] border-[6px] border-white transition-colors animate-nav-float group-hover:bg-orange-700">
            <Home size={26} strokeWidth={2.5} />
          </div>
        </Link>

        {/* Kanan 1: Keranjang (dengan badge) */}
        <button
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center justify-center w-full py-1 group active:scale-95 transition-transform relative outline-none"
        >
          <div className="p-1.5 rounded-[1.2rem] transition-all duration-300 text-slate-400 group-hover:text-slate-700 relative">
            <ShoppingBag size={24} strokeWidth={2} />
            {/* Badge */}
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1.5 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] font-black rounded-full px-1 shadow-sm shadow-red-500/40 animate-in zoom-in duration-200">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-bold text-slate-500">Keranjang</span>
        </button>

        {/* Kanan 2: Profil */}
        <Link href="/profile" className="flex flex-col items-center justify-center w-full py-1 group active:scale-95 transition-transform">
          <div className={`p-1.5 rounded-[1.2rem] transition-all duration-300 ${pathname === '/profile' ? 'bg-orange-50 text-orange-600' : 'text-slate-400 group-hover:text-slate-700'}`}>
            <User size={24} strokeWidth={pathname === '/profile' ? 2.5 : 2} />
          </div>
          <span className={`text-[10px] mt-1 font-bold ${pathname === '/profile' ? 'text-orange-600' : 'text-slate-500'}`}>Profil</span>
        </Link>

      </div>
    </>
  )
}
