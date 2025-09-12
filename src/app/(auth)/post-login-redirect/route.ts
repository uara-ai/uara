import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET() {
  const cookieStore = await cookies();
  const dest = cookieStore.get("post-login-redirect")?.value;
  if (dest) {
    cookieStore.set("post-login-redirect", "", { path: "/", maxAge: 0 });
    return redirect(dest);
  }
  return redirect("/waitlist");
}

// Cursor rules applied correctly.
