"use client";

import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";

export default function ElevatePage() {
  const { user, isLoading } = useUser();
  const [status, setStatus] = useState<string | null>(null);

  const makeAdmin = async () => {
    try {
      const res = await fetch("/api/elevate", {
        method: "POST",
      });

      const data = await res.json();
      setStatus(data.message || "Updated.");
    } catch (err) {
      setStatus("Something went wrong.");
    }
  };

  if (isLoading) return null;

  if (!user) {
    return <p className="p-10 text-red-800 text-center">Please log in first.</p>;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-10 bg-white text-red-900">
      <h1 className="text-3xl font-bold mb-4">Become an Admin</h1>
      <button
        onClick={makeAdmin}
        className="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800 transition"
      >
        Make Me Admin
      </button>
      {status && <p className="mt-4 font-medium">{status}</p>}
    </main>
  );
}
