import { requireAdmin } from "@/lib/checkAdmin";
import UsersPage from "./UsersPage";

export default async function ServerUsersPage() {
  await requireAdmin();
  return <UsersPage />;
}