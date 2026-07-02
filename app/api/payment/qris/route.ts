import { type NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import QRCode from "qrcode";

export const dynamic = "force-dynamic";

// CRC-16 CCITT-FALSE generator for Indonesian QRIS specification
function computeCrc16(str: string): string {
  let crc = 0xffff;
  for (let c = 0; c < str.length; c++) {
    const code = str.charCodeAt(c);
    crc ^= code << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  crc &= 0xffff;
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

// Inject nominal amount dynamically into a static QRIS string
function generateDynamicQris(staticQris: string, amount: number): string {
  let qris = staticQris.trim();

  // Strip existing CRC tag (always tag 63 at the end: 6304xxxx)
  const index = qris.lastIndexOf("6304");
  if (index !== -1) {
    qris = qris.substring(0, index);
  }

  // Parse EMVCo TLV blocks
  const tlv: Record<string, string> = {};
  let i = 0;
  while (i < qris.length) {
    const tag = qris.substring(i, i + 2);
    const lenStr = qris.substring(i + 2, i + 4);
    const len = parseInt(lenStr, 10);
    if (isNaN(len)) break;
    const value = qris.substring(i + 4, i + 4 + len);
    tlv[tag] = value;
    i += 4 + len;
  }

  // Update tag 01 (Point of Initiation Method) to "12" (dynamic / pre-filled amount)
  tlv["01"] = "12";

  // Set tag 54 (Transaction Amount)
  tlv["54"] = amount.toString();

  // Re-assemble the QRIS string (excluding CRC)
  let newQris = "";
  const sortedTags = Object.keys(tlv).sort();
  for (const tag of sortedTags) {
    const val = tlv[tag];
    const lenStr = val.length.toString().padStart(2, "0");
    newQris += tag + lenStr + val;
  }

  // Append tag 6304 and compute CRC
  newQris += "6304";
  const crc = computeCrc16(newQris);
  newQris += crc;

  return newQris;
}

export async function GET(request: NextRequest) {
  try {
    const sql = getDb();
    const { searchParams } = new URL(request.url);
    const amountParam = searchParams.get("amount");
    const amount = amountParam ? Math.round(Number(amountParam)) : 0;

    // Fetch QRIS settings
    const rows = await sql`
      SELECT id, qris_string, qr_image_base64 
      FROM qris_settings 
      ORDER BY id DESC 
      LIMIT 1
    `;

    if (rows.length === 0) {
      return new Response("QRIS settings not found", { status: 404 });
    }

    let qris_string = rows[0].qris_string;
    const qr_image_base64 = rows[0].qr_image_base64;

    // Self-healing: if qris_string is missing but qr_image_base64 is present, decode it on the fly
    if ((!qris_string || !qris_string.trim().startsWith("000201")) && qr_image_base64) {
      try {
        const matches = qr_image_base64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
        if (matches) {
          const contentType = matches[1];
          const rawBase64 = matches[2];
          const buffer = Buffer.from(rawBase64, "base64");

          const apiFormData = new FormData();
          const blob = new Blob([buffer], { type: contentType });
          apiFormData.append("file", blob, "qrcode.png");

          const response = await fetch("https://api.qrserver.com/v1/read-qr-code/", {
            method: "POST",
            body: apiFormData,
          });

          const result = await response.json();
          const decodedText = result[0]?.symbol[0]?.data;

          if (decodedText && decodedText.startsWith("000201")) {
            qris_string = decodedText;
            
            // Extract NMID
            const nmidMatch = decodedText.match(/ID[0-9]{13}/);
            const extractedNmid = nmidMatch ? nmidMatch[0] : "";

            // Update database silently so next requests don't need to re-decode
            if (extractedNmid) {
              await sql`
                UPDATE qris_settings
                SET qris_string = ${decodedText},
                    nmid = ${extractedNmid},
                    updated_at = NOW()
                WHERE id = ${rows[0].id}
              `;
            } else {
              await sql`
                UPDATE qris_settings
                SET qris_string = ${decodedText},
                    updated_at = NOW()
                WHERE id = ${rows[0].id}
              `;
            }
          }
        }
      } catch (err) {
        console.error("Self-healing QRIS decoding failed:", err);
      }
    }

    // If qris_string is present in DB and amount > 0, generate dynamic QR code
    if (qris_string && qris_string.trim().startsWith("000201") && amount > 0) {
      try {
        const dynamicQrisText = generateDynamicQris(qris_string, amount);
        
        // Generate PNG buffer using the qrcode library
        const buffer = await QRCode.toBuffer(dynamicQrisText, {
          type: "png",
          width: 400,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        });

        return new Response(new Uint8Array(buffer), {
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });
      } catch (err) {
        console.error("Error generating dynamic QRIS code:", err);
        // Fallback to static base64 image if generation fails
      }
    }

    // Fallback: serve static QRIS image uploaded by admin
    if (!qr_image_base64) {
      return new Response("Static QRIS image not found", { status: 404 });
    }

    const matches = qr_image_base64.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (!matches) {
      return new Response("Invalid static image format stored", { status: 500 });
    }

    const contentType = matches[1];
    const rawBase64 = matches[2];
    const buffer = Buffer.from(rawBase64, "base64");

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });

  } catch (error: any) {
    console.error("GET payment qris error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
