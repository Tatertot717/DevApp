import { auth0 } from "@/lib/auth0";
import { query } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth0.getSession();
  const user = session?.user;
  const isLoading = session === undefined;

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }
  if (!user) {
    redirect("/auth/login"); // Or show a login prompt
  }

  await query(`INSERT IGNORE INTO users (auth0_sub) VALUES (?)`, [session.user.sub]);

  redirect("/scanner"); // Logged in → redirect to callback
}
