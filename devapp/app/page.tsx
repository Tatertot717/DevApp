import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnimatedQRLogo } from "@/components/animated-qr-code-logo";

export default function HomePage() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen">
      <main className="flex flex-col gap-12 row-start-2 items-center">
        <div className="flex flex-row gap-4 items-center">
          <AnimatedQRLogo />
          <h1 className="font-bold text-3xl">QRoll</h1>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Button asChild variant="secondary">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/create-account">Create Account</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
