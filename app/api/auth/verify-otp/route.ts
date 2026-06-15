import { NextResponse } from "next/server";
import { verifyAndConsumeOtp } from "@/lib/otp";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const otp = typeof body.otp === "string" ? body.otp.trim() : "";

    if (!email || !otp) {
      return NextResponse.json({ message: "Email dan kode OTP wajib diisi." }, { status: 400 });
    }

    const ok = await verifyAndConsumeOtp(email, otp, "login");
    if (!ok) {
      return NextResponse.json({ message: "Kode OTP salah atau kedaluwarsa." }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: "OTP terverifikasi." });
  } catch (e) {
    console.error("verify-otp:", e);
    return NextResponse.json({ message: "Terjadi kesalahan." }, { status: 500 });
  }
}
