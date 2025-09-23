/**
 * Utility functions for handling subdomain routing
 */

/**
 * Extract subdomain from hostname
 */
export function getSubdomain(hostname: string): string | null {
  // Remove protocol if present
  const cleanHostname = hostname.replace(/^https?:\/\//, "");

  // Split by dots
  const parts = cleanHostname.split(".");

  // If we have more than 2 parts (subdomain.domain.tld), return the first part
  if (parts.length > 2) {
    return parts[0];
  }

  return null;
}

/**
 * Check if current request is from ui subdomain
 */
export function isUISubdomain(hostname: string): boolean {
  return hostname === "ui.uara.ai" || getSubdomain(hostname) === "ui";
}

/**
 * Get the appropriate base URL for the current environment
 */
export function getBaseUrl(subdomain?: string): string {
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const domain =
    process.env.NODE_ENV === "production" ? "uara.ai" : "localhost:3000";

  if (subdomain && process.env.NODE_ENV === "production") {
    return `${protocol}://${subdomain}.${domain}`;
  }

  return `${protocol}://${domain}`;
}

/**
 * Generate URL for UI documentation
 */
export function getUIUrl(path: string = ""): string {
  const baseUrl = getBaseUrl("ui");
  return `${baseUrl}${path}`;
}

/**
 * Check if we're currently on the UI subdomain (client-side)
 */
export function isOnUISubdomain(): boolean {
  if (typeof window === "undefined") return false;
  return isUISubdomain(window.location.hostname);
}

// Cursor rules applied correctly.
