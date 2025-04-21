import Header from "@/components/header";
import Link from "next/link";
import { AnimatedQRLogo } from "@/components/animated-qr-code-logo";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-red-900">
      <Header />

      <main className="flex flex-col items-center justify-center text-center p-10">
        <AnimatedQRLogo />
        <h2 className="text-5xl font-bold mb-6">
          UGA Class Check-In System
        </h2>
        <p className="text-xl max-w-2xl mb-10">
          Check in quickly and securely using dynamic QR codes.
        </p>

        <Link href="/checkin/library">
          <span className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-md text-lg transition">
            Go to Check-In
          </span>
        </Link>
      </main>
    </div>
  );
}
