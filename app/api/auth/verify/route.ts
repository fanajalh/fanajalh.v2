import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("admin_session")

    if (!session) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 })
    }

    const user = JSON.parse(session.value)

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Session verification error:", error)
    return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 })
  }
}
