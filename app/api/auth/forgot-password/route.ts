import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  assertSendRateOk,
  createOtpRow,
  generateSixDigitOtp,
  logOtpSend,
} from "@/lib/otp";
import { getClientIp } from "@/lib/request-ip";
import { sendSuggestionEmail, otpResetPasswordEmailTemplate } from "@/lib/email-util";

const GENERIC =
  "Jika email terdaftar, kode reset telah dikirim. Periksa kotak masuk Anda.";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const emailRaw = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!emailRaw) {
      return NextResponse.json({ message: "Email wajib diisi." }, { status: 400 });
    }

    const ip = getClientIp(request);

    try {
      await assertSendRateOk(emailRaw, "reset_password", ip);
    } catch (err: any) {
      if (err.message === "RATE_LIMIT") {
        return NextResponse.json(
          { message: "Terlalu banyak permintaan. Tunggu beberapa menit lalu coba lagi." },
          { status: 429 }
        );
      }
      console.error("Database/Internal error in forgot-password assertSendRateOk:", err);
      return NextResponse.json(
        { message: "Terjadi kesalahan internal server: " + (err.message || String(err)) },
        { status: 500 }
      );
    }

    const sql = getDb();
    const users = await sql`SELECT id FROM users WHERE email = ${emailRaw}`;

    if (users.length === 0) {
      return NextResponse.json({ success: true, message: GENERIC });
    }

    const code = generateSixDigitOtp();
    await createOtpRow(emailRaw, "reset_password", code);
    await logOtpSend(emailRaw, "reset_password", ip);

    try {
      await sendSuggestionEmail({
        ...otpResetPasswordEmailTemplate(code),
        to: emailRaw,
      });
    } catch {
      console.error("forgot-password mail error");
      return NextResponse.json(
        { message: "Email tidak dapat dikirim saat ini. Coba lagi nanti." },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true, message: GENERIC });
  } catch (e) {
    console.error("forgot-password:", e);
    return NextResponse.json({ message: "Terjadi kesalahan." }, { status: 500 });
  }
}
