import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/checkAdmin";
export async function GET() {
  try {
    await requireAdmin();

    const users = await query(
      "SELECT id, auth0_sub, name, email, is_admin FROM users ORDER BY id DESC"
    );

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Failed to fetch users:", error);
    return new NextResponse("Unauthorized or error", { status: 401 });
  }
}
