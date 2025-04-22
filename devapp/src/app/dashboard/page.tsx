import { auth0 } from "@/lib/auth0";
import { query } from "@/lib/db";
import { redirect } from "next/navigation";
import LandingHeader from "@/components/header";
import AutoRefresh from "@/components/AutoRefresh";
import Link from "next/link";

export default async function LowAuthDashboardPage() {
  const session = await auth0.getSession();

  if (!session || !session.user) {
    redirect("/");
  }

  const { name, sub } = session.user;

  // Do NOT use users table — this is for low-auth users only
  const userRes = await query("SELECT * FROM users WHERE auth0_sub = ?", [sub]);
  const isAdmin = userRes.length > 0 && userRes[0].is_admin === 1;

  if (isAdmin) {
    redirect("/admin"); // redirect to admin dashboard if high-auth
  }

  // Find all locations this user has checked in at
  const locationIds = await query(
    `
    SELECT DISTINCT l.id, l.name, l.slug, l.created_at
    FROM check_ins ci
    JOIN locations l ON ci.location_id = l.id
    WHERE ci.auth0_sub = ?
    ORDER BY l.created_at DESC
    `,
    [sub]
  );

  const checkinsByLocation = await Promise.all(
    locationIds.map(async (location: any) => {
      const checkins = await query(
        `
        SELECT name, checkin_time, ip_address
        FROM check_ins
        WHERE location_id = ? AND auth0_sub = ?
        ORDER BY checkin_time DESC
        `,
        [location.id, sub]
      );

      return {
        location,
        checkins,
      };
    })
  );

  return (
    <>
      <LandingHeader loggedInItems={
         <>
         <Link href="/scanner">
           <span className="hover:underline cursor-pointer">Scanner</span>
         </Link>
         <Link href="/auth/logout">
           <span className="bg-white text-red-800 font-semibold px-4 py-1 rounded hover:bg-gray-100 transition">Log Out</span>
         </Link>
       </>
      }></LandingHeader>
      <div className="min-h-screen bg-white text-gray-900 p-10">
        <h1 className="text-4xl font-bold mb-8">Your Check-In History</h1>
        <AutoRefresh interval={30} />
        {checkinsByLocation.length === 0 ? (
          <p className="text-gray-500 italic">You haven’t checked in anywhere yet.</p>
        ) : (
          checkinsByLocation.map(({ location, checkins }) => (
            <div key={location.id} className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">{location.name}</h2>

              <table className="w-full border border-gray-300 text-left">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border-b">Name</th>
                    <th className="p-2 border-b">Time</th>
                    <th className="p-2 border-b">IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {checkins.map((checkin: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-2 border-b">{checkin.name}</td>
                      <td className="p-2 border-b">
                        {new Date(checkin.checkin_time).toLocaleString()}
                      </td>
                      <td className="p-2 border-b">{checkin.ip_address || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </>
  );
}
