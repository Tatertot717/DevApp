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
  if (!session || !user) {
    window.location.href = "/auth/login"; // Or show a login prompt
  } else {
    await query(
      `INSERT INTO users (auth0_sub, name, email)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email)`,
      [session.user.sub, session.user.name, session.user.email]
    );

    redirect("/scanner"); // Logged in → redirect to callback
  }
}
