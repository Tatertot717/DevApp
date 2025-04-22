"use client";

import { useState } from "react";

export default function CheckinForm({ slug, token }: { slug: string; token?: string }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, slug, token }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border p-3 rounded"
        />
        <button
          type="submit"
          className="bg-red-700 text-white px-6 py-2 rounded hover:bg-red-800"
        >
          Check In
        </button>
      </form>
      {message && <p className="mt-4 text-lg">{message}</p>}
    </>
  );
}
