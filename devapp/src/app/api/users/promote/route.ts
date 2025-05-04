import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/checkAdmin";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  await requireAdmin();

  const formData = await req.formData();
  const id = formData.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  await query("UPDATE users SET is_admin = 1 WHERE id = ?", [id]);

  return NextResponse.redirect(new URL("/admin/users", req.url));
}