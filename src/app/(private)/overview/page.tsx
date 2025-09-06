import { Overview } from "@/components/overview/health-os/overview";
import { withAuth } from "@workos-inc/authkit-nextjs";

export default async function Home() {
  await withAuth({ ensureSignedIn: true });
  return <Overview />;
}
