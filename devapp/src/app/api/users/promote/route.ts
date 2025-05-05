import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  await requireAdmin();

  const body = await req.json();
  const id = body.id;

  if (!id) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  await query("UPDATE users SET is_admin = 1 WHERE id = ?", [id]);

  return NextResponse.json({ success: true });
}