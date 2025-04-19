"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";

export default function QRCheckinClient({ slug }: { slug: string }) {
  const [token, setToken] = useState("");

  useEffect(() => {
    const updateToken = () => {
      const timestamp = Math.floor(Date.now() / 15000);
      setToken(`${slug}-${timestamp}`);
    };

    updateToken();
    const interval = setInterval(updateToken, 15000);
    return () => clearInterval(interval);
  }, [slug]);

  const url = `/checkin/${slug}/form?token=${token}`;

  return (
    <div className="bg-white p-4 rounded-2xl shadow-lg">
      <QRCode value={url} size={256} fgColor="#000000" bgColor="#ffffff" />
      <p className="mt-6 text-sm text-center text-black">
        Current Token: <code className="bg-black text-white px-2 py-1 rounded">{token}</code>
      </p>
    </div>
  );
}
