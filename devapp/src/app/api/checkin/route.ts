import { isTokenValid } from "@/lib/token";
import { query } from "@/lib/db";
import { auth0 } from '@/lib/auth0';

export async function POST(req: Request) {
  const { slug, token } = await req.json();
  const user = await auth0.getSession();

  if (!user) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  const name = user.name;

  const locationRes = await query(
    "SELECT id, realtime_auth FROM locations WHERE slug = ?",
    [slug]
  );

  if (!locationRes || locationRes.length === 0) {
    return Response.json({ message: "Invalid location." }, { status: 404 });
  }

  const { id: locationId, realtime_auth } = locationRes[0];
  const interval = realtime_auth ? 5 : 15;

  if (!isTokenValid(slug, token, interval)) {
    return Response.json({ message: "Invalid or expired token." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for") || req.headers.get("host");

  await query(
    "INSERT INTO check_ins (name, location_id, ip_address) VALUES (?, ?, ?)",
    [name, locationId, ip]
  );

  return Response.json({ message: "Check-in successful!" });
}