import { query } from "@/lib/db";
import { auth0 } from '@/lib/auth0';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return Response.json({ message: "Missing slug parameter." }, { status: 400 });
  }

  const session = await auth0.getSession();
  if (!session || !session.user) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  const auth0Sub = session.user.sub;

  // Get user from DB to check admin status
  const userRes = await query("SELECT is_admin FROM users WHERE auth0_sub = ?", [auth0Sub]);
  if (!userRes || userRes.length === 0) {
    return Response.json({ message: "User not registered." }, { status: 403 });
  }

  const isAdmin = userRes[0].is_admin === 1;

  // Admins can view all check-ins
  const locationRes = isAdmin
    ? await query("SELECT id FROM locations WHERE slug = ?", [slug])
    : await query(
        `SELECT id FROM locations WHERE slug = ? AND owner = ?`,
        [slug, auth0Sub]
      );

  if (!locationRes || locationRes.length === 0) {
    return Response.json({ message: "Location not found or access denied." }, { status: 403 });
  }

  const locationId = locationRes[0].id;

  const checkIns = await query(
    "SELECT name, ip_address, checkin_time FROM check_ins WHERE location_id = ? ORDER BY checkin_time DESC",
    [locationId]
  );

  return Response.json({ checkIns });
}
