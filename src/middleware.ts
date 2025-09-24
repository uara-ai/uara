import { authkitMiddleware } from "@workos-inc/authkit-nextjs";
import { NextRequest, NextResponse } from "next/server";
import { isUISubdomain } from "@/lib/subdomain";

// Enhanced middleware that handles subdomain routing while preserving WorkOS auth
async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Handle ui.uara.ai subdomain routing
  if (isUISubdomain(hostname)) {
    // Clone the URL to modify it
    const url = request.nextUrl.clone();

    // If we're on ui subdomain but path doesn't start with /ui, rewrite it
    if (!pathname.startsWith("/ui")) {
      url.pathname = pathname === "/" ? "/ui" : `/ui${pathname}`;
      return NextResponse.rewrite(url);
    }

    // If we're already on /ui path, continue without rewriting
    return NextResponse.next();
  }

  // For main domain, continue with WorkOS authentication
  const authHandler = authkitMiddleware({
    middlewareAuth: {
      enabled: true,
      unauthenticatedPaths: [
        "/",
        "/ui",
        "/ui/:path*",
        // Add other public paths here if needed
        "/blog/:path*",
        "/privacy",
        "/terms",
        "/pricing",
        "/founders",
        "/bmi-calculator",
        "/api/pricing/tier",
        "/api/stripe/:path*",
        "/api/wearables/:path*",
      ],
    },
  });

  // authkitMiddleware expects both request and a response or event
  return authHandler(request, {} as any);
}

// Export the enhanced middleware as default
export default middleware;

// Match against pages that require processing
export const config = {
  matcher: [
    // Match all paths except static files and API routes that don't need auth
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
