import { generateToken } from "@/lib/token";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  const timestamp = Math.floor(Date.now() / 15000);
  const token = generateToken(slug, timestamp);

  return Response.json({ token });
}