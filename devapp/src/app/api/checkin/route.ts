import { isTokenValid } from "@/lib/token";
import { query } from "@/lib/db";
import { auth0 } from '@/lib/auth0';
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { slug, token, name: providedName } = await req.json();
  const session = await auth0.getSession();

  const locationRes = await query(
    "SELECT id, realtime_auth FROM locations WHERE slug = ?",
    [slug]
  );

  if (!locationRes || locationRes.length === 0) {
    return NextResponse.json({ message: "Invalid location." }, { status: 404 });
  }

  const { id: locationId, realtime_auth } = locationRes[0];
  const interval = realtime_auth ? 10 : 15;

  if (!isTokenValid(slug, token, interval)) {
    return NextResponse.json({ message: "Invalid or expired token." }, { status: 400 });
  }

  if (realtime_auth) {
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }
  }

  const name = realtime_auth ? session?.user?.name : providedName;
  const sub = realtime_auth ? session?.user?.sub : null;

  if (!name) {
    return NextResponse.json({ message: "Name is required for check-in." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for") || req.headers.get("host");

  await query(
    `INSERT INTO check_ins (auth0_sub, name, location_id, ip_address)
     VALUES (?, ?, ?, ?)`,
    [sub, name, locationId, ip]
  );

  return NextResponse.json({ message: "Check-in successful!" });
}