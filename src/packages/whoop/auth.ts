import { WHOOP_AUTH_URL, WHOOP_SCOPES } from "@/packages/whoop/types";

export interface WhoopAuthConfig {
  clientId: string;
  redirectUri: string;
  scope?: string[];
  state?: string;
}

export class WhoopAuth {
  /**
   * Generate the OAuth authorization URL for Whoop
   */
  static getAuthorizationUrl(config: WhoopAuthConfig): string {
    const scopes = config.scope || [...WHOOP_SCOPES];
    const state = config.state || generateRandomState();

    const params = new URLSearchParams({
      response_type: "code",
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: scopes.join(" "),
      state,
    });

    return `${WHOOP_AUTH_URL}?${params.toString()}`;
  }

  /**
   * Generate a random state parameter for OAuth security
   */
  static generateState(): string {
    return generateRandomState();
  }

  /**
   * Check if user has valid Whoop tokens
   */
  static async hasValidTokens(userId: string): Promise<boolean> {
    try {
      const { prisma } = await import("@/lib/prisma");

      const tokens = await prisma.whoopToken.findUnique({
        where: { userId },
      });

      if (!tokens) {
        return false;
      }

      // Check if token is not expired (with 5 minute buffer)
      const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
      return tokens.expiresAt > fiveMinutesFromNow;
    } catch (error) {
      console.error("Error checking Whoop tokens:", error);
      return false;
    }
  }

  /**
   * Get the authorization URL for the current environment
   */
  static getAuthUrl(origin: string, state?: string): string {
    const clientId = process.env.WHOOP_CLIENT_ID!;
    if (!clientId) {
      throw new Error("WHOOP_CLIENT_ID environment variable is not set");
    }

    const redirectUri =
      process.env.WHOOP_REDIRECT_URI || `${origin}/api/whoop/callback`;

    return this.getAuthorizationUrl({
      clientId,
      redirectUri,
      scope: [...WHOOP_SCOPES],
      state,
    });
  }
}

/**
 * Generate a cryptographically random state parameter
 */
function generateRandomState(): string {
  const array = new Uint8Array(32);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for Node.js environment
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { randomBytes } = require("crypto");
    const buffer = randomBytes(32);
    for (let i = 0; i < 32; i++) {
      array[i] = buffer[i];
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

// Cursor rules applied correctly.
