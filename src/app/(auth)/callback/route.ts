import { handleAuth } from "@workos-inc/authkit-nextjs";

// Redirect the user to post-login redirect handler after successful sign in
export const GET = handleAuth({ returnPathname: "/post-login-redirect" });

// Cursor rules applied correctly.
