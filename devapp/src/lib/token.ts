import crypto from "crypto";

const SECRET = process.env.TOKEN_SECRET || "change-this";

export function generateToken(slug: string, timestamp: number): string {
  const hash = crypto
    .createHmac("sha256", SECRET)
    .update(`${slug}-${timestamp}`)
    .digest("base64url"); 
  return hash.slice(0, 16);
}

export function isTokenValid(
  slug: string,
  receivedToken: string,
  interval: number
): boolean {
  const now = Math.floor(Date.now() / (interval * 1000));

  const maxOffset = interval === 5 ? 0 : 2;

  for (let offset = 0; offset <= maxOffset; offset++) {
    const ts = now - offset;
    const expected = generateToken(slug, ts);
    if (receivedToken === expected) {
      return true;
    }
  }

  return false;
}