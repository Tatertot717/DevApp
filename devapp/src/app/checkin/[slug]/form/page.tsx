"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Header from "@/src/components/header";

export default function CheckinForm() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

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
    <div className="min-h-screen bg-white text-red-900 p-6">
      <Header />
      <div className="max-w-xl mx-auto text-center mt-10">
        <h1 className="text-3xl font-bold mb-4">Check-In: {slug}</h1>
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
      </div>
    </div>
  );
}
