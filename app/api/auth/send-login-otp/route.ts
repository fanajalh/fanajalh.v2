import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import {
  assertSendRateOk,
  createOtpRow,
  dummyPasswordWork,
  generateSixDigitOtp,
  logOtpSend,
} from "@/lib/otp";
import { getClientIp } from "@/lib/request-ip";
import { sendSuggestionEmail, otpLoginEmailTemplate } from "@/lib/email-util";

const GENERIC_OK =
  "Jika email terdaftar dan password benar, kode verifikasi telah dikirim ke email Anda.";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const emailRaw = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!emailRaw || !password) {
      return NextResponse.json({ message: "Email dan password wajib diisi." }, { status: 400 });
    }

    const ip = getClientIp(request);

    try {
      await assertSendRateOk(emailRaw, "login", ip);
    } catch (err: any) {
      if (err.message === "RATE_LIMIT") {
        return NextResponse.json(
          { message: "Terlalu banyak permintaan. Tunggu beberapa menit lalu coba lagi." },
          { status: 429 }
        );
      }
      console.error("Database/Internal error in send-login-otp assertSendRateOk:", err);
      return NextResponse.json(
        { message: "Terjadi kesalahan internal server: " + (err.message || String(err)) },
        { status: 500 }
      );
    }

    const sql = getDb();
    const users = await sql`SELECT id, password FROM users WHERE email = ${emailRaw}`;

    if (users.length === 0) {
      await dummyPasswordWork(password);
      return NextResponse.json({ success: true, message: GENERIC_OK });
    }

    const user = users[0] as { id: number; password: string };
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      await dummyPasswordWork(password);
      return NextResponse.json({ success: true, message: GENERIC_OK });
    }

    const code = generateSixDigitOtp();
    await createOtpRow(emailRaw, "login", code);
    await logOtpSend(emailRaw, "login", ip);

    try {
      await sendSuggestionEmail({
        ...otpLoginEmailTemplate(code),
        to: emailRaw,
      });
    } catch (e) {
      console.error("send-login-otp mail error");
      return NextResponse.json(
        { message: "Kode tidak dapat dikirim saat ini. Periksa pengaturan email server." },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true, message: GENERIC_OK });
  } catch (e: any) {
    console.error("send-login-otp:", e);
    return NextResponse.json({ message: "Terjadi kesalahan." }, { status: 500 });
  }
}
