import { query } from "@/lib/db";
import LandingHeader from "@/components/header";
import QRCheckinClient from "@/components/QRCheckinClient";

type Params = Promise<{ slug: string }>;

export default async function CheckinPage({ params }: { params: Params }) {
  const { slug } = await params;

  const location = await query("SELECT * FROM locations WHERE slug = ?", [slug]);

  if (!location || location.length === 0) {
    return (
      <>
        <LandingHeader />
        <div className="min-h-screen bg-white text-red-900">
          <main className="p-10 text-center">
            <h2 className="text-3xl font-bold">Location Not Found</h2>
          </main>
        </div>
      </>
    );
  }

  const { name, realtime_auth } = location[0];

  return (
    <>
      <LandingHeader />
      <div className="min-h-screen bg-red-700 text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold mb-4 text-center">
          UGA Check-In: {name}
        </h1>
        <p className="mb-8 text-lg text-center max-w-xl">
          Scan to check in!
        </p>
        <QRCheckinClient slug={slug} realtimeAuth={realtime_auth} />
        </div>
    </>
  );
}