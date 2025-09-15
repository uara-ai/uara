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
      `${process.env.NEXT_PUBLIC_APP_URL}/api/whoop/callback`;

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
        "read:recovery read:cycles read:workout read:sleep read:profile read:body_measurement",
      state,
    });

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
    const response = await fetch(`${WHOOP_BASE_URL}/v1${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("WHOOP_TOKEN_EXPIRED");
      }
      const error: WhoopApiError = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(
        `WHOOP API error: ${error.error_description || error.error}`
      );
    }

    return response.json();
  }

  /**
   * Get user profile
   */
  async getUser(accessToken: string): Promise<WhoopUser> {
    const response = await this.makeAuthenticatedRequest<
      WhoopApiSingleResponse<WhoopUser>
    >("/user/profile/basic", accessToken);
    return response.data;
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

    const endpoint = `/sleep${
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

    const endpoint = `/workout${
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
    const response = await this.makeAuthenticatedRequest<
      WhoopApiSingleResponse<WhoopBodyMeasurement>
    >("/user/measurement/body", accessToken);
    return response.data;
  }

  /**
   * Get specific recovery by ID
   */
  async getRecoveryById(
    accessToken: string,
    recoveryId: number
  ): Promise<WhoopRecovery> {
    const response = await this.makeAuthenticatedRequest<
      WhoopApiSingleResponse<WhoopRecovery>
    >(`/recovery/${recoveryId}`, accessToken);
    return response.data;
  }

  /**
   * Get specific cycle by ID
   */
  async getCycleById(
    accessToken: string,
    cycleId: number
  ): Promise<WhoopCycle> {
    const response = await this.makeAuthenticatedRequest<
      WhoopApiSingleResponse<WhoopCycle>
    >(`/cycle/${cycleId}`, accessToken);
    return response.data;
  }

  /**
   * Get specific sleep by ID
   */
  async getSleepById(
    accessToken: string,
    sleepId: number
  ): Promise<WhoopSleep> {
    const response = await this.makeAuthenticatedRequest<
      WhoopApiSingleResponse<WhoopSleep>
    >(`/sleep/${sleepId}`, accessToken);
    return response.data;
  }

  /**
   * Get specific workout by ID
   */
  async getWorkoutById(
    accessToken: string,
    workoutId: number
  ): Promise<WhoopWorkout> {
    const response = await this.makeAuthenticatedRequest<
      WhoopApiSingleResponse<WhoopWorkout>
    >(`/workout/${workoutId}`, accessToken);
    return response.data;
  }
}

// Singleton instance
export const whoopClient = new WhoopApiClient();

// Cursor rules applied correctly.
