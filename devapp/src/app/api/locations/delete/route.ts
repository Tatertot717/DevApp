import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/checkAdmin";

export async function POST(req: Request) {
  await requireAdmin();

  const formData = await req.formData();
  const slug = formData.get("slug") as string;

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  await query("DELETE FROM locations WHERE slug = ?", [slug]);

  return NextResponse.redirect(new URL("/admin/locations", req.url));
}
