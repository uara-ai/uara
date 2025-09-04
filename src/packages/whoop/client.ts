import {
  WHOOP_API_BASE_URL,
  WHOOP_TOKEN_URL,
  type WhoopTokenResponse,
  type WhoopUser,
  type WhoopRecovery,
  type WhoopCycle,
  type WhoopSleep,
  type WhoopWorkout,
  type WhoopBodyMeasurement,
} from "@/packages/whoop/types";

export class WhoopClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async makeRequest<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${WHOOP_API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Whoop API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return response.json();
  }

  // OAuth token exchange
  static async exchangeCodeForToken(
    code: string,
    clientId: string,
    clientSecret: string,
    redirectUri: string
  ): Promise<WhoopTokenResponse> {
    const response = await fetch(WHOOP_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Token exchange failed: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return response.json();
  }

  // Refresh access token
  static async refreshToken(
    refreshToken: string,
    clientId: string,
    clientSecret: string
  ): Promise<WhoopTokenResponse> {
    const response = await fetch(WHOOP_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Token refresh failed: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    return response.json();
  }

  // Get user profile
  async getUser(): Promise<WhoopUser> {
    return this.makeRequest<WhoopUser>("/developer/v1/user/profile/basic");
  }

  // Get recovery data
  async getRecovery(params?: {
    start?: string;
    end?: string;
    nextToken?: string;
    limit?: number;
  }): Promise<{ records: WhoopRecovery[]; next_token?: string }> {
    const searchParams = new URLSearchParams();
    if (params?.start) searchParams.append("start", params.start);
    if (params?.end) searchParams.append("end", params.end);
    if (params?.nextToken) searchParams.append("nextToken", params.nextToken);
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const endpoint = `/developer/v1/recovery${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    return this.makeRequest(endpoint);
  }

  // Get specific recovery by ID
  async getRecoveryById(recoveryId: string): Promise<WhoopRecovery> {
    return this.makeRequest<WhoopRecovery>(
      `/developer/v1/recovery/${recoveryId}`
    );
  }

  // Get cycle data (daily physiological cycles)
  async getCycles(params?: {
    start?: string;
    end?: string;
    nextToken?: string;
    limit?: number;
  }): Promise<{ records: WhoopCycle[]; next_token?: string }> {
    const searchParams = new URLSearchParams();
    if (params?.start) searchParams.append("start", params.start);
    if (params?.end) searchParams.append("end", params.end);
    if (params?.nextToken) searchParams.append("nextToken", params.nextToken);
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const endpoint = `/developer/v1/cycle${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    return this.makeRequest(endpoint);
  }

  // Get specific cycle by ID
  async getCycleById(cycleId: string): Promise<WhoopCycle> {
    return this.makeRequest<WhoopCycle>(`/developer/v1/cycle/${cycleId}`);
  }

  // Get sleep data
  async getSleep(params?: {
    start?: string;
    end?: string;
    nextToken?: string;
    limit?: number;
  }): Promise<{ records: WhoopSleep[]; next_token?: string }> {
    const searchParams = new URLSearchParams();
    if (params?.start) searchParams.append("start", params.start);
    if (params?.end) searchParams.append("end", params.end);
    if (params?.nextToken) searchParams.append("nextToken", params.nextToken);
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const endpoint = `/developer/v1/activity/sleep${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    return this.makeRequest(endpoint);
  }

  // Get specific sleep by ID
  async getSleepById(sleepId: string): Promise<WhoopSleep> {
    return this.makeRequest<WhoopSleep>(
      `/developer/v1/activity/sleep/${sleepId}`
    );
  }

  // Get workout data
  async getWorkouts(params?: {
    start?: string;
    end?: string;
    nextToken?: string;
    limit?: number;
  }): Promise<{ records: WhoopWorkout[]; next_token?: string }> {
    const searchParams = new URLSearchParams();
    if (params?.start) searchParams.append("start", params.start);
    if (params?.end) searchParams.append("end", params.end);
    if (params?.nextToken) searchParams.append("nextToken", params.nextToken);
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const endpoint = `/developer/v1/activity/workout${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    return this.makeRequest(endpoint);
  }

  // Get specific workout by ID
  async getWorkoutById(workoutId: string): Promise<WhoopWorkout> {
    return this.makeRequest<WhoopWorkout>(
      `/developer/v1/activity/workout/${workoutId}`
    );
  }

  // Get body measurements
  async getBodyMeasurements(params?: {
    start?: string;
    end?: string;
    nextToken?: string;
    limit?: number;
  }): Promise<{ records: WhoopBodyMeasurement[]; next_token?: string }> {
    const searchParams = new URLSearchParams();
    if (params?.start) searchParams.append("start", params.start);
    if (params?.end) searchParams.append("end", params.end);
    if (params?.nextToken) searchParams.append("nextToken", params.nextToken);
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const endpoint = `/developer/v1/user/measurement/body${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    return this.makeRequest(endpoint);
  }

  // Get specific body measurement by ID
  async getBodyMeasurementById(
    measurementId: string
  ): Promise<WhoopBodyMeasurement> {
    return this.makeRequest<WhoopBodyMeasurement>(
      `/developer/v1/user/measurement/body/${measurementId}`
    );
  }

  // Fetch all data for a user (used in initial sync)
  async fetchAllUserData(startDate?: string, endDate?: string) {
    const [user, recovery, cycles, sleep, workouts, bodyMeasurements] =
      await Promise.all([
        this.getUser(),
        this.getRecovery({ start: startDate, end: endDate, limit: 50 }),
        this.getCycles({ start: startDate, end: endDate, limit: 50 }),
        this.getSleep({ start: startDate, end: endDate, limit: 50 }),
        this.getWorkouts({ start: startDate, end: endDate, limit: 50 }),
        this.getBodyMeasurements({ start: startDate, end: endDate, limit: 50 }),
      ]);

    return {
      user,
      recovery: recovery.records,
      cycles: cycles.records,
      sleep: sleep.records,
      workouts: workouts.records,
      bodyMeasurements: bodyMeasurements.records,
    };
  }
}

// Cursor rules applied correctly.
