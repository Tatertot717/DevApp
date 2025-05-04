import { requireAdmin } from "@/lib/checkAdmin";
import { query } from "@/lib/db";
import LandingHeader from "@/components/header";
import Link from "next/link";
import { DeleteButton } from "@/components/DeleteButton";

export default async function LocationsPage() {
  await requireAdmin();

  const locations = await query(
    "SELECT slug, name, created_at FROM locations ORDER BY created_at DESC"
  );

  return (
    <>
      <LandingHeader />
      <main className="max-w-4xl mx-auto py-12 px-6">
        <Link
          href="/admin"
          className="text-red-600 hover:underline text-sm mb-4 inline-block"
        >
          ← Back to Admin Dashboard
        </Link>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Manage Locations</h1>
          <Link
            href="/admin/locations/create"
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded"
          >
            + Create Location
          </Link>
        </div>

        {locations.length === 0 ? (
          <p className="text-gray-600 italic">
            No check-in locations exist yet.
          </p>
        ) : (
          <ul className="space-y-4">
            {locations.map((loc: any) => (
              <li
                key={loc.slug}
                className="border p-4 rounded shadow-sm hover:shadow-md transition relative"
              >
                <Link href={`/admin/locations/${loc.slug}`} className="block">
                  <div className="text-xl font-semibold">{loc.name}</div>
                  <div className="text-sm text-gray-500">{loc.slug}</div>
                  <div className="text-sm text-gray-400">
                    Created: {new Date(loc.created_at).toLocaleString()}
                  </div>
                </Link>
                <div className="absolute top-4 right-4">
                  <DeleteButton
                    action="/api/locations/delete"
                    body={{ slug: loc.slug }}
                    redirectTo="/admin/locations"
                    confirmMessage={`Delete location "${loc.name}"?`}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
