import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import {
  assertSendRateOk,
  createOtpRow,
  generateSixDigitOtp,
  logOtpSend,
} from "@/lib/otp";
import { getClientIp } from "@/lib/request-ip";
import { sendSuggestionEmail, otpLoginEmailTemplate } from "@/lib/email-util";

export async function POST(req: Request) {
  try {
    const sql = getDb();
    const body = await req.json();
    const emailRaw = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const name = typeof body.name === "string" ? body.name : "";

    if (!emailRaw || !password) {
      return NextResponse.json({ message: "Email dan Password wajib diisi" }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: "Password minimal 6 karakter" }, { status: 400 });
    }

    const existing = await sql`SELECT id FROM users WHERE email = ${emailRaw}`;
    if (existing.length > 0) {
      return NextResponse.json({ message: "Email sudah terdaftar" }, { status: 400 });
    }

    // Rate limit check
    const ip = getClientIp(req);
    try {
      await assertSendRateOk(emailRaw, "register_login", ip);
    } catch (err: any) {
      if (err.message === "RATE_LIMIT") {
        return NextResponse.json(
          { message: "Terlalu banyak permintaan. Tunggu beberapa menit." },
          { status: 429 }
        );
      }
      console.error("Database/Internal error in register assertSendRateOk:", err);
      return NextResponse.json(
        { message: "Terjadi kesalahan internal server: " + (err.message || String(err)) },
        { status: 500 }
      );
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const displayName = name || emailRaw.split("@")[0];

    const result = await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${displayName}, ${emailRaw}, ${hashedPassword}, 'user')
      RETURNING id, email
    `;

    // Generate and send OTP via email
    const code = generateSixDigitOtp();
    await createOtpRow(emailRaw, "register_login", code);
    await logOtpSend(emailRaw, "register_login", ip);

    try {
      await sendSuggestionEmail({
        ...otpLoginEmailTemplate(code),
        to: emailRaw,
      });
    } catch (e) {
      console.error("register otp mail error:", e);
      return NextResponse.json(
        { message: "Akun dibuat, tapi kode OTP gagal dikirim. Coba login ulang." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        message: "Akun berhasil dibuat! Periksa email untuk kode verifikasi.",
        user: { id: result[0].id, email: result[0].email },
        requireOtp: true,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Register Error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan pada server" }, { status: 500 });
  }
}
