import type {
  WhoopUser,
  WhoopTokenResponse,
  WhoopRecovery,
  WhoopCycle,
  WhoopSleep,
  WhoopWorkout,
  WhoopBodyMeasurement,
  WhoopApiResponse,
  WhoopApiSingleResponse,
  WhoopApiError,
} from "./types";

const WHOOP_BASE_URL = "https://api.prod.whoop.com/developer";
const WHOOP_AUTH_URL = "https://api.prod.whoop.com/oauth";

export class WhoopApiClient {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;

  constructor() {
    this.clientId = process.env.WHOOP_CLIENT_ID!;
    this.clientSecret = process.env.WHOOP_CLIENT_SECRET!;
    this.redirectUri =
      process.env.WHOOP_REDIRECT_URI ||
      `${process.env.NEXT_PUBLIC_APP_URL}/api/wearables/whoop/callback`;

    if (!this.clientId || !this.clientSecret) {
      throw new Error("Missing WHOOP OAuth credentials");
    }
  }

  /**
   * Generate OAuth authorization URL
   */
  getAuthUrl(state: string): string {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope:
        "offline read:recovery read:cycles read:workout read:sleep read:profile read:body_measurement",
      state,
    });

    // Enhanced debug logging for redirect URI
    console.log("=== WHOOP OAuth Debug Info ===");
    console.log(
      "Environment WHOOP_REDIRECT_URI:",
      process.env.WHOOP_REDIRECT_URI
    );
    console.log(
      "Environment NEXT_PUBLIC_APP_URL:",
      process.env.NEXT_PUBLIC_APP_URL
    );
    console.log("Computed redirect URI:", this.redirectUri);
    console.log("Client ID:", this.clientId);
    console.log(
      "Full auth URL:",
      `${WHOOP_AUTH_URL}/oauth2/auth?${params.toString()}`
    );
    console.log("==============================");

    return `${WHOOP_AUTH_URL}/oauth2/auth?${params.toString()}`;
  }

  /**
   * Exchange authorization code for access token
   */
  async exchangeCodeForToken(code: string): Promise<WhoopTokenResponse> {
    const response = await fetch(`${WHOOP_AUTH_URL}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        redirect_uri: this.redirectUri,
      }),
    });

    if (!response.ok) {
      const error: WhoopApiError = await response.json();
      throw new Error(
        `Token exchange failed: ${error.error_description || error.error}`
      );
    }

    return response.json();
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<WhoopTokenResponse> {
    const response = await fetch(`${WHOOP_AUTH_URL}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: this.clientId,
        client_secret: this.clientSecret,
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      const error: WhoopApiError = await response.json();
      throw new Error(
        `Token refresh failed: ${error.error_description || error.error}`
      );
    }

    return response.json();
  }

  /**
   * Make authenticated API request
   */
  private async makeAuthenticatedRequest<T>(
    endpoint: string,
    accessToken: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${WHOOP_BASE_URL}/v2${endpoint}`;
    console.log(`Making WHOOP API request to: ${url}`);
    console.log(
      `Access token (first 20 chars): ${accessToken?.substring(0, 20)}...`
    );

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    console.log(
      `WHOOP API response status: ${response.status} ${response.statusText}`
    );

    if (!response.ok) {
      const responseText = await response.text();
      console.error(`WHOOP API error response: ${responseText}`);

      if (response.status === 401) {
        throw new Error("WHOOP_TOKEN_EXPIRED");
      }

      let error: WhoopApiError;
      try {
        error = JSON.parse(responseText);
      } catch {
        error = { error: responseText || "Unknown error" };
      }

      throw new Error(
        `WHOOP API error (${response.status}): ${
          error.error_description || error.error
        }`
      );
    }

    const responseText = await response.text();
    console.log(`WHOOP API response body: ${responseText}`);

    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error(`Failed to parse WHOOP API response as JSON:`, parseError);
      throw new Error(`Invalid JSON response from WHOOP API: ${responseText}`);
    }
  }

  /**
   * Get user basic profile (name, email, user_id)
   */
  async getUser(accessToken: string): Promise<WhoopUser> {
    console.log(
      "Making request to WHOOP /user/profile/basic endpoint (API v2)"
    );

    try {
      // WHOOP API returns data directly, not wrapped in a data property
      const response = await this.makeAuthenticatedRequest<WhoopUser>(
        "/user/profile/basic",
        accessToken
      );

      console.log("Raw WHOOP API response:", JSON.stringify(response, null, 2));

      if (!response || !response.user_id) {
        throw new Error(
          `Invalid API response structure: ${JSON.stringify(response)}`
        );
      }

      console.log("✅ Successfully fetched user profile");
      return response;
    } catch (error: any) {
      console.error("❌ Failed to fetch user profile:", error);
      throw new Error(`Failed to fetch user profile: ${error.message}`);
    }
  }

  /**
   * Get recovery data
   */
  async getRecovery(
    accessToken: string,
    options: {
      start?: string;
      end?: string;
      nextToken?: string;
      limit?: number;
    } = {}
  ): Promise<WhoopApiResponse<WhoopRecovery>> {
    const params = new URLSearchParams();
    if (options.start) params.append("start", options.start);
    if (options.end) params.append("end", options.end);
    if (options.nextToken) params.append("nextToken", options.nextToken);
    if (options.limit) params.append("limit", options.limit.toString());

    const endpoint = `/recovery${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    return this.makeAuthenticatedRequest<WhoopApiResponse<WhoopRecovery>>(
      endpoint,
      accessToken
    );
  }

  /**
   * Get cycle data
   */
  async getCycles(
    accessToken: string,
    options: {
      start?: string;
      end?: string;
      nextToken?: string;
      limit?: number;
    } = {}
  ): Promise<WhoopApiResponse<WhoopCycle>> {
    const params = new URLSearchParams();
    if (options.start) params.append("start", options.start);
    if (options.end) params.append("end", options.end);
    if (options.nextToken) params.append("nextToken", options.nextToken);
    if (options.limit) params.append("limit", options.limit.toString());

    const endpoint = `/cycle${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    return this.makeAuthenticatedRequest<WhoopApiResponse<WhoopCycle>>(
      endpoint,
      accessToken
    );
  }

  /**
   * Get sleep data
   */
  async getSleep(
    accessToken: string,
    options: {
      start?: string;
      end?: string;
      nextToken?: string;
      limit?: number;
    } = {}
  ): Promise<WhoopApiResponse<WhoopSleep>> {
    const params = new URLSearchParams();
    if (options.start) params.append("start", options.start);
    if (options.end) params.append("end", options.end);
    if (options.nextToken) params.append("nextToken", options.nextToken);
    if (options.limit) params.append("limit", options.limit.toString());

    const endpoint = `/activity/sleep${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    return this.makeAuthenticatedRequest<WhoopApiResponse<WhoopSleep>>(
      endpoint,
      accessToken
    );
  }

  /**
   * Get workout data
   */
  async getWorkouts(
    accessToken: string,
    options: {
      start?: string;
      end?: string;
      nextToken?: string;
      limit?: number;
    } = {}
  ): Promise<WhoopApiResponse<WhoopWorkout>> {
    const params = new URLSearchParams();
    if (options.start) params.append("start", options.start);
    if (options.end) params.append("end", options.end);
    if (options.nextToken) params.append("nextToken", options.nextToken);
    if (options.limit) params.append("limit", options.limit.toString());

    const endpoint = `/activity/workout${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    return this.makeAuthenticatedRequest<WhoopApiResponse<WhoopWorkout>>(
      endpoint,
      accessToken
    );
  }

  /**
   * Get body measurements
   */
  async getBodyMeasurement(accessToken: string): Promise<WhoopBodyMeasurement> {
    // WHOOP API returns data directly, not wrapped in a data property
    const response = await this.makeAuthenticatedRequest<WhoopBodyMeasurement>(
      "/user/measurement/body",
      accessToken
    );
    return response;
  }

  /**
   * Get specific recovery by ID
   */
  async getRecoveryById(
    accessToken: string,
    recoveryId: string
  ): Promise<WhoopRecovery> {
    // WHOOP API returns data directly for single items
    const response = await this.makeAuthenticatedRequest<WhoopRecovery>(
      `/recovery/${recoveryId}`,
      accessToken
    );
    return response;
  }

  /**
   * Get specific cycle by ID
   */
  async getCycleById(
    accessToken: string,
    cycleId: string
  ): Promise<WhoopCycle> {
    // WHOOP API returns data directly for single items
    const response = await this.makeAuthenticatedRequest<WhoopCycle>(
      `/cycle/${cycleId}`,
      accessToken
    );
    return response;
  }

  /**
   * Get sleep data for a specific cycle
   */
  async getCycleSleep(
    accessToken: string,
    cycleId: string
  ): Promise<WhoopSleep> {
    // WHOOP API returns data directly for single items
    const response = await this.makeAuthenticatedRequest<WhoopSleep>(
      `/cycle/${cycleId}/sleep`,
      accessToken
    );
    return response;
  }

  /**
   * Get recovery data for a specific cycle
   */
  async getCycleRecovery(
    accessToken: string,
    cycleId: string
  ): Promise<WhoopRecovery> {
    // WHOOP API returns data directly for single items
    const response = await this.makeAuthenticatedRequest<WhoopRecovery>(
      `/cycle/${cycleId}/recovery`,
      accessToken
    );
    return response;
  }

  /**
   * Get specific sleep by ID
   */
  async getSleepById(
    accessToken: string,
    sleepId: string
  ): Promise<WhoopSleep> {
    // WHOOP API returns data directly for single items
    const response = await this.makeAuthenticatedRequest<WhoopSleep>(
      `/activity/sleep/${sleepId}`,
      accessToken
    );
    return response;
  }

  /**
   * Get specific workout by ID
   */
  async getWorkoutById(
    accessToken: string,
    workoutId: string
  ): Promise<WhoopWorkout> {
    // WHOOP API returns data directly for single items
    const response = await this.makeAuthenticatedRequest<WhoopWorkout>(
      `/activity/workout/${workoutId}`,
      accessToken
    );
    return response;
  }

  /**
   * Revoke user's OAuth access
   */
  async revokeAccess(accessToken: string): Promise<void> {
    await this.makeAuthenticatedRequest<void>("/user/access", accessToken, {
      method: "DELETE",
    });
  }
}

// Singleton instance
export const whoopClient = new WhoopApiClient();

// Cursor rules applied correctly.
