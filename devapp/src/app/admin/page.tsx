import { requireAdmin } from "@/lib/checkAdmin";
import LandingHeader from "@/components/header";
import Link from "next/link";

export default async function AdminDashboard() {
  await requireAdmin();

  return (
    <>
      <LandingHeader />
      <main className="max-w-2xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        <ul className="space-y-4">
          <li>
            <Link href="/admin/locations" className="text-blue-600 hover:underline">
              Manage Locations
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className="text-blue-600 hover:underline">
              Manage Users
            </Link>
          </li>
        </ul>
      </main>
    </>
  );
}
