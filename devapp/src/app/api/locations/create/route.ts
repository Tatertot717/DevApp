import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/checkAdmin";

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const formData = await req.formData();
    const name = formData.get("name")?.toString().trim();
    const slug = formData.get("slug")?.toString().trim().toLowerCase();
    const realtime = formData.get("realtime_auth") === "on" ? 1 : 0;

    const RESERVED = ["create", "new", "delete", "edit"];
    if (!name || !slug || RESERVED.includes(slug)) {
      return NextResponse.json({ error: "Invalid name or slug" }, { status: 400 });
    }

    const existing = await query("SELECT slug FROM locations WHERE slug = ?", [slug]);
    if (existing.length > 0) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 400 });
    }

    await query(
      "INSERT INTO locations (name, slug, realtime_auth, created_at) VALUES (?, ?, ?, NOW())",
      [name, slug, realtime]
    );

    return NextResponse.json({ success: true, slug }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}