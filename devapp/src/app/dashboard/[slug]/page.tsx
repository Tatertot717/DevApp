import { query } from "@/lib/db";
import LandingHeader from "@/components/header";
import AutoRefresh from "@/components/AutoRefresh";

type Params = Promise<{ slug: string }>;

export default async function LocationCheckinsPage({ params }: { params: Params }) {
  const { slug } = await params;

  const locationResult = await query("SELECT * FROM locations WHERE slug = ?", [slug]);

  if (!locationResult || locationResult.length === 0) {
    return (
      <>
        <LandingHeader />
        <div className="min-h-screen bg-white text-red-900">
          <main className="p-10 text-center">
            <h2 className="text-3xl font-bold">Location Not Found</h2>
          </main>
        </div>
      </>
    );
  }

  const location = locationResult[0];

  const checkins = await query(
    `
    SELECT name, checkin_time, ip_address
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
        <h1 className="text-4xl font-bold mb-8">
          Check-Ins at {location.name}
        </h1>
        <AutoRefresh interval={30} />
        {checkins.length === 0 ? (
          <p className="text-gray-500 italic">No check-ins yet.</p>
        ) : (
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
        )}
      </div>
    </>
  );
}
