"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LandingHeader from "@/components/header";
import Link from "next/link";

export default function CreateLocationPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/locations/create", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong");
    } else {
      router.push(`/admin/locations/${data.slug}`);
    }
  };

  return (
    <>
      <LandingHeader />
      <main className="max-w-xl mx-auto py-12 px-6">
        <Link
          href="/admin/locations"
          className="text-red-600 hover:underline text-sm mb-4 inline-block"
        >
          ← Back to Locations
        </Link>
        <h1 className="text-3xl font-bold mb-6">Create New Location</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-600">{error}</p>}

          <div>
            <label htmlFor="name" className="block font-medium">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block font-medium">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              id="slug"
              required
              className="w-full p-2 border rounded"
            />
            <p className="text-sm text-gray-500">
              e.g. &quot;my-location&ldquo;. Must be unique.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <input type="checkbox" name="realtime_auth" id="realtime_auth" />
            <label htmlFor="realtime_auth" className="text-sm font-medium">
              Enable realtime authentication
            </label>
          </div>

          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Create Location
          </button>
        </form>
      </main>
    </>
  );
}