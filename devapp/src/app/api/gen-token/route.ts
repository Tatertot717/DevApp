import { generateToken } from "@/lib/token";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const intervalParam = searchParams.get("interval");

  if (!slug) {
    return new NextResponse("Missing slug", { status: 400 });
  }

  const interval = parseInt(intervalParam || "15", 10);
  const timestamp = Math.floor(Date.now() / (interval * 1000)); // key to sync rotation
  const token = generateToken(slug, timestamp);

  return NextResponse.json({ token });
}