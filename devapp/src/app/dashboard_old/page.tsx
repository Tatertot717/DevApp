import LandingHeader from "@/components/header";
import { auth0 } from "@/lib/auth0";
import { query } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth0.getSession();
  if (!session || !session.user) {
    redirect("/"); // Low auth or not logged in → send to landing
  }

  const { name, sub } = session.user;

  // Check if user is high-auth/admin
  const userRes = await query(
    "SELECT is_admin FROM users WHERE auth0_sub = ?",
    [sub]
  );

  const isLoggedIn = userRes && userRes.length > 0;
  const isAdmin = isLoggedIn && userRes[0].is_admin === 1;

 console.log(isLoggedIn, isAdmin)

  let locations: any[] = [];

  if (isAdmin) {
    // Admins (high-auth users) see all locations
    locations = await query(
      "SELECT slug, created_at FROM locations ORDER BY created_at DESC"
    );
  } else {
    // Low-auth users see locations they’ve checked into
    locations = await query(
      `SELECT DISTINCT l.slug, l.created_at
       FROM check_ins ci
       JOIN locations l ON ci.location_id = l.id
       WHERE ci.name = ?
       ORDER BY l.created_at DESC`,
      [name]
    );
  }

  return (
    <div>
       <LandingHeader/>

    <main className="max-w-2xl mx-auto py-12 px-6">
       
      <h1 className="text-3xl font-bold mb-6">
        {isAdmin ? "All Check-In Locations" : "Your Check-In History"}
      </h1>

      {locations.length === 0 ? (
        <p className="text-gray-600">
          {isAdmin
            ? "No check-in locations exist yet."
            : "You haven’t checked in anywhere yet."}
        </p>
      ) : (
        <ul className="space-y-4">
          {locations.map((loc) => (
            <li
              key={loc.slug}
              className="border p-4 rounded shadow-sm hover:shadow-md transition"
            >
              <div className="font-medium text-lg">{loc.slug}</div>
              <div className="text-sm text-gray-500">
                Created at: {new Date(loc.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
    </div>
  );
}
