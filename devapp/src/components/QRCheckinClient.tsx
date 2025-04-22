"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export default function QRCheckinClient({ slug }: { slug: string }) {
  const [token, setToken] = useState("");

  const fetchToken = async () => {
    const res = await fetch(`/api/gen-token?slug=${slug}`);
    const data = await res.json();
    setToken(data.token);
  };

  useEffect(() => {
    fetchToken();
    const interval = setInterval(fetchToken, 15000);
    return () => clearInterval(interval);
  }, [slug]);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
  const scannerUrl = `${baseUrl}/scanner?slug=${slug}&token=${token}`;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg">
      <QRCode value={scannerUrl} size={256} fgColor="#000000" bgColor="#ffffff" />
      <p className="mt-6 text-sm text-center text-black">
        Current Token:{" "}
        <code className="bg-black text-white px-2 py-1 rounded">{token}</code>
      </p>
    </div>
  );
}