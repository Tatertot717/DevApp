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

  if (!isTokenValid(slug, token)) {
    return Response.json({ message: "Invalid or expired token." }, { status: 400 });
  }

  const locationRes = await query("SELECT id FROM locations WHERE slug = ?", [slug]);
  if (!locationRes || locationRes.length === 0) {
    return Response.json({ message: "Invalid location." }, { status: 404 });
  }

  const locationId = locationRes[0].id;
  const ip = req.headers.get("x-forwarded-for") || req.headers.get("host");

  await query(
    "INSERT INTO check_ins (name, location_id, ip_address) VALUES (?, ?, ?)",
    [name, locationId, ip]
  );

  return Response.json({ message: "Check-in successful!" });
}