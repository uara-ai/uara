import { getSignInUrl } from "@workos-inc/authkit-nextjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const redirectParam = url.searchParams.get("redirect");
  if (redirectParam) {
    const cookieStore = await cookies();
    cookieStore.set("post-login-redirect", redirectParam, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 10,
    });
  }

  const signInUrl = await getSignInUrl();
  return redirect(signInUrl);
};
