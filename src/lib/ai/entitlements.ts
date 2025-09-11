interface Entitlements {
  maxMessagesPerDay: number;
  availableChatModelIds: Array<string>;
}

export const entitlementsByUserType: Record<
  "guest" | "regular" | "paid",
  Entitlements
> = {
  /*
   * For users without an account
   */
  guest: {
    maxMessagesPerDay: 0,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },

  /*
   * For users with an account
   */
  regular: {
    maxMessagesPerDay: 5,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },

  /*
   * TODO: For users with an account and a paid membership
   */
  paid: {
    maxMessagesPerDay: 50,
    availableChatModelIds: ["chat-model", "chat-model-reasoning"],
  },
};

// Cursor rules applied correctly.
