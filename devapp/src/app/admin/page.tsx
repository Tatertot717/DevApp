import { auth0 } from "@/lib/auth0";
import { query } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await auth0.getSession();
  if (!session || !session.user) {
    redirect("/");
  }

  const { sub } = session.user;

  // Confirm the user is an admin
  const userRes = await query("SELECT is_admin FROM users WHERE auth0_sub = ?", [sub]);
  if (!userRes || userRes.length === 0 || userRes[0].is_admin !== 1) {
    redirect("/");
  }

  // Fetch all locations
  const locations = await query(
    "SELECT slug, name, created_at FROM locations ORDER BY created_at DESC"
  );

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {locations.length === 0 ? (
        <p className="text-gray-600 italic">No check-in locations exist yet.</p>
      ) : (
        <ul className="space-y-4">
          {locations.map((loc: any) => (
            <li key={loc.slug} className="border p-4 rounded shadow-sm hover:shadow-md transition">
              <a href={`/admin/${loc.slug}`} className="block">
                <div className="text-xl font-semibold">{loc.name}</div>
                <div className="text-sm text-gray-500">{loc.slug}</div>
                <div className="text-sm text-gray-400">
                  Created: {new Date(loc.created_at).toLocaleString()}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
