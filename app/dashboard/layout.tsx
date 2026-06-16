import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/login")
  }

  return (
    <div className="relative min-h-screen pb-20">
      {children}
    </div>
  )
}

