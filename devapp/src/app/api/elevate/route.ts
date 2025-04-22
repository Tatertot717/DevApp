import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { query } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth0.getSession();

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { sub } = session.user;

  const userCheck = await query("SELECT id FROM users WHERE auth0_sub = ?", [sub]);

  if (userCheck.length === 0) {
    return NextResponse.json({ message: "User not found in database." }, { status: 404 });
  }

  await query("UPDATE users SET is_admin = TRUE WHERE auth0_sub = ?", [sub]);

  return NextResponse.json({ message: "You are now an admin." });
}
