import { client as RedisClient } from "@/packages/redis/client";
import { Ratelimit } from "@upstash/ratelimit";
import {
  DEFAULT_SERVER_ERROR_MESSAGE,
  createSafeActionClient,
} from "next-safe-action";

const ratelimit = new Ratelimit({
  redis: RedisClient,
  limiter: Ratelimit.slidingWindow(10, "10s"),
  analytics: true,
  prefix: "api",
});

export const actionClient = createSafeActionClient({
  handleServerError(e: Error) {
    if (e instanceof Error) {
      return e.message;
    }
    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
});
