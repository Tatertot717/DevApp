import { auth0 } from "@/lib/auth0";
import { query } from "@/lib/db";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth0.getSession();
  if (!session || !session.user) {
    redirect("/");
  }

  const { sub } = session.user;
  const userRes = await query("SELECT is_admin FROM users WHERE auth0_sub = ?", [sub]);

  if (!userRes || userRes.length === 0 || userRes[0].is_admin !== 1) {
    redirect("/");
  }

  return { session };
}