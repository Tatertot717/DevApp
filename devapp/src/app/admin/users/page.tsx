import { requireAdmin } from "@/lib/checkAdmin";
import { query } from "@/lib/db";
import LandingHeader from "@/components/header";
import Link from "next/link";

export default async function UsersPage() {
  await requireAdmin();

  const users = await query(
    "SELECT id, auth0_sub, is_admin FROM users ORDER BY id DESC"
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
        <h1 className="text-4xl font-bold mb-8">Manage Users</h1>

        {users.length === 0 ? (
          <p className="text-gray-600 italic">No users found.</p>
        ) : (
          <ul className="space-y-4">
            {users.map((user: any) => (
              <li key={user.id} className="border p-4 rounded shadow-sm">
                <div className="font-semibold">
                  {user.auth0_sub} ({user.id})
                </div>
                <div className="text-sm text-gray-500">
                  {user.is_admin ? (
                    "Admin"
                  ) : (
                    <form method="POST" action="/api/admin/users/promote">
                      <input type="hidden" name="id" value={user.id} />
                      <button
                        type="submit"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Make Admin
                      </button>
                    </form>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
