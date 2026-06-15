import { createHash } from "crypto";

export function getClientIp(request: Request): string | null {
  const xf = request.headers.get("x-forwarded-for");
  let ip = "";
  if (xf) {
    ip = xf.split(",")[0]?.trim() || "";
  } else {
    ip = request.headers.get("x-real-ip") || "";
  }
  if (!ip) return null;

  return createHash("sha256")
    .update(ip + "fanajah-ecosystem-salt-key-2026")
    .digest("hex")
    .substring(0, 32);
}

