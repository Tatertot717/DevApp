"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export default function QRCheckinClient({
  slug,
  realtimeAuth,
}: {
  slug: string;
  realtimeAuth: boolean;
}) {
  const [token, setToken] = useState("");

  const fetchToken = async () => {
    const interval = realtimeAuth ? 5 : 15;
    const res = await fetch(`/api/gen-token?slug=${slug}&interval=${interval}`);
    const data = await res.json();
    setToken(data.token);
  };

  useEffect(() => {
    fetchToken();

    const refreshInterval = realtimeAuth ? 5000 : 15000;
    const interval = setInterval(fetchToken, refreshInterval);

    return () => clearInterval(interval);
  }, [slug, realtimeAuth]);

  const baseUrl = process.env.APP_BASE_URL || "http://localhost:3001";
  const path = realtimeAuth ? "scanner" : `checkin/${slug}/form`;
  const qrUrl = `${baseUrl}/${path}?slug=${slug}&token=${token}`;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg">
      <QRCode value={qrUrl} size={256} fgColor="#000000" bgColor="#ffffff" />
      <p className="mt-6 text-sm text-center text-black">
        Current Token:{" "}
        <code className="bg-black text-white px-2 py-1 rounded">{token}</code>
      </p>
    </div>
  );
}