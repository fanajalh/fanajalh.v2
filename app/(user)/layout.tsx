import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { UserBottomNav } from "@/components/UserBottomNav"
import { CartProvider, CartDrawer } from "@/components/cart"

import { headers } from "next/headers"

export default async function UserAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = headers().get("x-pathname") || ""
  const isEcosystem = pathname.startsWith("/ecosystem")
  
  const session = await getServerSession(authOptions)
  
  if (!session && !isEcosystem) {
    redirect("/loginUser")
  }

  return (
    <CartProvider>
      <div className="w-full min-h-screen bg-slate-50 flex flex-col relative">
        <div className="relative w-full min-h-screen bg-slate-50 flex flex-col">
          {children}
          <UserBottomNav />
          <CartDrawer />
        </div>
      </div>
    </CartProvider>
  )
}
