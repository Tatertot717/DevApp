import { query } from "@/src/util/db";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { name, slug, token } = await req.json();

  if (!name || !slug || !token) {
    return Response.json({ message: "Invalid request" }, { status: 400 });
  }

  const loc = await query("SELECT * FROM locations WHERE slug = ?", [slug]);
  if (!loc || loc.length === 0) {
    return Response.json({ message: "Location not found" }, { status: 404 });
  }

  const locationId = loc[0].id;
  const cookieKey = `checkedIn_${slug}`;
  const cookieStore = await cookies(); // ✅ await here
  const prevCheckin = cookieStore.get(cookieKey);

  const now = Date.now();

  if (prevCheckin && now - parseInt(prevCheckin.value) < 3600000) {
    return Response.json({ message: "You already checked in recently!" }, { status: 403 });
  }

  await query(
    "INSERT INTO check_ins (name, location_id, checkin_time) VALUES (?, ?, NOW())",
    [name, locationId]
  );

  cookieStore.set(cookieKey, `${now}`, {
    maxAge: 3600,
    path: "/",
  });

  return Response.json({ message: "Checked in successfully!" });
}