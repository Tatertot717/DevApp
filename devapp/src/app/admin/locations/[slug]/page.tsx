import { auth0 } from "@/lib/auth0";
import { query } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import LandingHeader from "@/components/header";
import AutoRefresh from "@/components/AutoRefresh";

type Params = Promise<{ slug: string }>;

export default async function AdminLocationCheckinsPage({
  params,
}: {
  params: Params;
}) {
  const { slug } = await params;

  const session = await auth0.getSession();
  if (!session || !session.user) {
    redirect("/");
  }

  const { sub } = session.user;

  // Confirm this is a high-auth admin user
  const userRes = await query(
    "SELECT is_admin FROM users WHERE auth0_sub = ?",
    [sub]
  );
  if (!userRes || userRes.length === 0 || userRes[0].is_admin !== 1) {
    redirect("/"); // Not authorized
  }

  // Get location
  const locationResult = await query("SELECT * FROM locations WHERE slug = ?", [
    slug,
  ]);
  if (!locationResult || locationResult.length === 0) {
    return (
      <>
        <LandingHeader />
        <div className="min-h-screen bg-white text-gray-900 p-10">
        <Link
          href="/admin/locations"
          className="text-red-600 hover:underline text-sm mb-4 inline-block"
        >
          ← Back to Locations
        </Link>
          <main className="p-10 text-center">
            <h2 className="text-3xl font-bold">Location Not Found</h2>
          </main>
        </div>
      </>
    );
  }

  const location = locationResult[0];

  // Get check-ins for that location
  const checkins = await query(
    `
    SELECT auth0_sub, name, checkin_time, ip_address
    FROM check_ins
    WHERE location_id = ?
    ORDER BY checkin_time DESC
    `,
    [location.id]
  );

  return (
    <>
      <LandingHeader />
      <div className="min-h-screen bg-white text-gray-900 p-10">
        <Link
          href="/admin/locations"
          className="text-red-600 hover:underline text-sm mb-4 inline-block"
        >
          ← Back to Locations
        </Link>
        <h1 className="text-4xl font-bold mb-8">
          Admin View: Check-Ins at{" "}
          <Link href={`/checkin/${location.slug}`} className="text-red-600">
            {location.name}
          </Link>
        </h1>
        <AutoRefresh interval={30} />
        {checkins.length === 0 ? (
          <p className="text-gray-500 italic">No check-ins yet.</p>
        ) : (
          <table className="w-full border border-gray-300 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border-b">Display Name</th>
                <th className="p-2 border-b">Auth0 Sub</th>
                <th className="p-2 border-b">Time</th>
                <th className="p-2 border-b">IP Address</th>
              </tr>
            </thead>
            <tbody>
              {checkins.map((checkin: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-2 border-b">{checkin.name}</td>
                  <td className="p-2 border-b">{checkin.auth0_sub}</td>
                  <td className="p-2 border-b">
                    {new Date(checkin.checkin_time).toLocaleString()}
                  </td>
                  <td className="p-2 border-b">{checkin.ip_address || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
