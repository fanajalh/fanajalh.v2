import crypto from "crypto";

const SECRET = process.env.NEXTAUTH_SECRET || "default_nextauth_secret_key_at_least_32_chars_long_for_security!!";
// Derive a 32-byte key from the SECRET using SHA-256
const KEY = crypto.createHash("sha256").update(SECRET).digest();

/**
 * Encrypts a numeric database ID into a URL-safe encrypted string.
 * Format: IV_base64url~CIPHERTEXT_base64url
 */
export function encryptId(id: number | string | undefined | null): string {
  if (id === undefined || id === null) return "";
  const numId = typeof id === "number" ? id : parseInt(id, 10);
  if (isNaN(numId)) return "";

  try {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", KEY, iv);
    let encrypted = cipher.update(numId.toString(), "utf8", "base64");
    encrypted += cipher.final("base64");

    // Convert base64 to URL-safe base64
    const ivBase64 = iv.toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const encBase64 = encrypted
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    return `${ivBase64}~${encBase64}`;
  } catch (error) {
    console.error("Encryption error:", error);
    return "";
  }
}

/**
 * Decrypts a URL-safe encrypted string back into a numeric database ID.
 * Supports fallback for raw numeric IDs or pure integer strings to prevent breaking legacy systems.
 */
export function decryptId(encryptedStr: any): number | null {
  if (encryptedStr === undefined || encryptedStr === null) return null;
  
  // Defensive check for already decrypted numeric IDs
  if (typeof encryptedStr === "number") return encryptedStr;
  if (typeof encryptedStr === "string" && /^\d+$/.test(encryptedStr)) {
    return parseInt(encryptedStr, 10);
  }

  try {
    const str = String(encryptedStr);
    if (!str.includes("~")) return null;
    
    const [ivPart, encPart] = str.split("~");

    const restoreBase64 = (s: string) => {
      let b64 = s.replace(/-/g, "+").replace(/_/g, "/");
      while (b64.length % 4) {
        b64 += "=";
      }
      return b64;
    };

    const iv = Buffer.from(restoreBase64(ivPart), "base64");
    const encrypted = restoreBase64(encPart);

    const decipher = crypto.createDecipheriv("aes-256-cbc", KEY, iv);
    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");

    const id = parseInt(decrypted, 10);
    return isNaN(id) ? null : id;
  } catch (error) {
    console.error("Decryption error:", error);
    return null;
  }
}
