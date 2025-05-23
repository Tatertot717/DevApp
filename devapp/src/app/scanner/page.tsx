"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0";
import LandingHeader from "@/components/header";
import { AnimatedQRLogo } from "@/components/animated-qr-code-logo";
import QRScanner from "@/components/QRScanner";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SecureScannerPage() {
  const [message, setMessage] = useState("");
  const lastScannedTimeRef = useRef<number>(0);
  const cooldownMs = 500;

  const { user, isLoading } = useUser();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
       window.location.href = "/auth/login";
    }
  }, [user, isLoading, router]);

  const handleScan = async (scanned: string) => {
    const now = Date.now();
    if (now - lastScannedTimeRef.current < cooldownMs) return;
    lastScannedTimeRef.current = now;

    try {
      const parsed = new URL(scanned);
      const pathname = parsed.pathname;
      const slug = parsed.searchParams.get("slug");
      const token = parsed.searchParams.get("token");

      if (!slug || !token) {
        setMessage("Scanned QR is missing required data.");
        return;
      }
      if (pathname === "/scanner") {
        // Realtime check-in
        const res = await fetch("/api/checkin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, token }),
        });

        const data = await res.json();
        setMessage(data.message || "Check-in successful!");
      } else {
        window.location.href = scanned;
      }
    } catch {
      setMessage("Could not process QR code.");
    }
  };

  // While loading auth status
  if (isLoading || (!user && typeof window !== "undefined")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-red-900">
      <LandingHeader />
      <main className="flex flex-col items-center justify-center p-10 text-center gap-8">
        <AnimatedQRLogo />
        <h2 className="text-4xl font-bold">Secure QR Code Scanner</h2>
        <p className="text-lg max-w-xl">
          Please scan your generated QR code using this page to complete check-in.
        </p>

        <div className="bg-red-100 p-4 rounded-xl shadow-lg max-w-md w-full">
          <QRScanner onScan={handleScan} />
        </div>

        {message && (
          <p className="mt-4 text-lg font-medium text-red-800 bg-red-50 p-2 rounded">
            {message}
          </p>
        )}

        <Button className="bg-red-700 hover:bg-red-800 text-white mt-6" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </main>
    </div>
  )

        }