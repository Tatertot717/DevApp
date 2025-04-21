import crypto from "crypto";

const SECRET = process.env.TOKEN_SECRET || "change-this";

export function generateToken(slug: string, timestamp: number): string {
  const hash = crypto
    .createHmac("sha256", SECRET)
    .update(`${slug}-${timestamp}`)
    .digest("base64url"); 
  return hash.slice(0, 16);
}

export function isTokenValid(slug: string, receivedToken: string): boolean {
  const now = Math.floor(Date.now() / 15000);

  // Allow token from now, now-1, now-2. 45 seconds of lifetime
  for (let offset = 0; offset <= 2; offset++) {
    const ts = now - offset;
    const expected = generateToken(slug, ts);
    if (receivedToken === expected) {
      return true;
    }
  }

  return false;
}
