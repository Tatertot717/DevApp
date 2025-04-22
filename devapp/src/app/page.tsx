import Header from "@/components/header";
import Link from "next/link";
import { AnimatedQRLogo } from "@/components/animated-qr-code-logo";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-red-900">
      <Header />

      <main className="flex flex-col gap-8 items-center justify-center text-center p-10">
        <AnimatedQRLogo />
        <h2 className="text-5xl font-bold">UGA Class Check-In System</h2>
        <p className="text-xl max-w-2xl">
          Check in quickly and securely using dynamic QR codes.
        </p>

        <Button
          className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-md text-lg transition"
          asChild
          size="lg"
        >
          <Link href="/scanner">Go to Check-In</Link>
        </Button>
      </main>
    </div>
  );
}
