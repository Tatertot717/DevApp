'use client';

import { useEffect, useState } from "react";
import LandingHeader from "@/components/header";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handlePromote = async (id: number) => {
    const res = await fetch("/api/users/promote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, is_admin: true } : user
        )
      );
    }
  };

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
                  {user.name || "No name"} ({user.email || "No email"})<br />
                  <span className="text-xs text-gray-400">
                    {user.auth0_sub} — ID: {user.id}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {user.is_admin ? (
                    "Admin"
                  ) : (
                    <button
                      onClick={() => handlePromote(user.id)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Make Admin
                    </button>
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
