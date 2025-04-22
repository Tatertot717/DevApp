// import { query } from "@/lib/db";
// import { redirect } from "next/navigation";
// import CheckinForm from "@/components/ui/checkinform";
// import LandingHeader from "@/components/header";

// export default async function CheckinFormPage({
//   params,
//   searchParams,
// }: {
//   params: Promise<{ slug: string }>;
//   searchParams?: Promise<{ token?: string }>;
// }) {
//   const { slug } = await params;
//   const { token = "" } = searchParams ? await searchParams : {};

//   const result = await query(
//     "SELECT name, realtime_auth FROM locations WHERE slug = ?",
//     [slug]
//   );

//   if (!result || result.length === 0) {
//     return (
//       <div className="min-h-screen bg-white text-red-900 p-6 text-center">
//         <LandingHeader />
//         <h1 className="text-3xl font-bold mt-10">Location not found</h1>
//       </div>
//     );
//   }

//   const { name, realtime_auth } = result[0];

//   if (realtime_auth) {
//     redirect(`/scanner`);
//   }

//   return (
//     <div className="min-h-screen bg-white text-red-900 p-6">
//       <LandingHeader />
//       <div className="max-w-xl mx-auto text-center mt-10">
//         <h1 className="text-3xl font-bold mb-4">Check-In: {slug}</h1>
//         <CheckinForm slug={slug} token={token} />
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { useParams, useSearchParams } from "next/navigation";

export default function AutoCheckinPage() {
  const { user, isLoading } = useUser();
  const [message, setMessage] = useState("");

  const params = useParams(); // gives slug from /checkin/[slug]
  const searchParams = useSearchParams(); // for ?token=xyz

  const slug = params?.slug as string;
  const token = searchParams?.get("token") ?? undefined;

  useEffect(() => {
    if (!isLoading && user?.name && slug) {
      const submitCheckin = async () => {
        try {
          const res = await fetch("/api/checkin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: user.name,
              slug,
              token,
            }),
          });

          const data = await res.json();
          setMessage(data.message || "Check-in complete.");
        } catch (error) {
          setMessage("Failed to check in. Please try again.");
        }
      };

      submitCheckin();
    }
  }, [isLoading, user, slug, token]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">Check-In</h1>
      <p className="text-lg">
        {isLoading
          ? "Verifying user and checking you in..."
          : message || "Processing..."}
      </p>
    </main>
  );
}
