import { prisma } from "@/lib/prisma";
import type { VisibilityType } from "@/components/ai/visibility-selector";

// Chat queries
export async function saveChat({
  id,
  title,
  userId,
  visibility = "private",
}: {
  id: string;
  title: string;
  userId: string;
  visibility?: VisibilityType;
}) {
  return prisma.chat.create({
    data: {
      id,
      title,
      userId,
      visibility,
    },
  });
}

export async function getChatById({ id }: { id: string }) {
  return prisma.chat.findUnique({
    where: { id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function getChatsByUserId({
  userId,
  limit,
  startingAfter,
  endingBefore,
}: {
  userId?: string;
  id?: string;
  limit?: number;
  startingAfter?: string | null;
  endingBefore?: string | null;
}) {
  const whereClause: any = {};

  // Handle both userId and id parameters for backward compatibility
  if (userId) {
    whereClause.userId = userId;
  }

  // Handle pagination
  if (startingAfter) {
    whereClause.id = { gt: startingAfter };
  } else if (endingBefore) {
    whereClause.id = { lt: endingBefore };
  }

  return prisma.chat.findMany({
    where: whereClause,
    orderBy: { updatedAt: "desc" },
    take: limit || 10,
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  return prisma.chat.update({
    where: { id: chatId },
    data: { visibility },
  });
}

export async function deleteChatById({ id }: { id: string }) {
  return prisma.chat.delete({
    where: { id },
  });
}

// Message queries
export async function saveMessage({
  id,
  chatId,
  role,
  parts,
  attachments = [],
}: {
  id: string;
  chatId: string;
  role: string;
  parts: any[];
  attachments?: any[];
}) {
  return prisma.message.create({
    data: {
      id,
      chatId,
      role,
      parts,
      attachments,
    },
  });
}

export async function getMessagesByChatId({ chatId }: { chatId: string }) {
  return prisma.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
  });
}

export async function getMessageByMessageId({ id }: { id: string }) {
  return prisma.message.findMany({
    where: { id },
    orderBy: { createdAt: "asc" },
  });
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  return prisma.message.deleteMany({
    where: {
      chatId,
      createdAt: {
        gte: timestamp,
      },
    },
  });
}

// Vote queries
export async function voteMessage({
  chatId,
  messageId,
  isUpvoted,
  type,
}: {
  chatId: string;
  messageId: string;
  isUpvoted?: boolean;
  type?: "up" | "down";
}) {
  const voteValue = type ? type === "up" : isUpvoted;

  return prisma.vote.upsert({
    where: {
      chatId_messageId: {
        chatId,
        messageId,
      },
    },
    create: {
      chatId,
      messageId,
      isUpvoted: voteValue!,
    },
    update: {
      isUpvoted: voteValue!,
    },
  });
}

export async function getVotesByUserId({ userId }: { userId: string }) {
  return prisma.vote.findMany({
    where: {
      chat: {
        userId,
      },
    },
  });
}

export async function getVotesByChatId({
  chatId,
  id,
}: {
  chatId?: string;
  id?: string;
}) {
  return prisma.vote.findMany({
    where: { chatId: chatId || id },
  });
}

// Document queries
export async function saveDocument({
  id,
  userId,
  title,
  content,
  kind,
  chatId,
}: {
  id: string;
  userId: string;
  title: string;
  content?: string;
  kind: string;
  chatId?: string;
}) {
  return prisma.document.upsert({
    where: { id },
    create: {
      id,
      userId,
      title,
      content,
      kind,
      chatId,
    },
    update: {
      title,
      content,
      kind,
    },
  });
}

export async function getDocumentById({ id }: { id: string }) {
  return prisma.document.findUnique({
    where: { id },
  });
}

export async function getDocumentsById({ id }: { id: string }) {
  return prisma.document.findMany({
    where: { id },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  return prisma.document.deleteMany({
    where: {
      id,
      createdAt: {
        gte: timestamp,
      },
    },
  });
}

export async function getDocumentsByUserId({ userId }: { userId: string }) {
  return prisma.document.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteDocumentById({ id }: { id: string }) {
  return prisma.document.delete({
    where: { id },
  });
}

// Suggestion queries
export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<{
    id: string;
    documentId: string;
    userId: string;
    originalText: string;
    suggestedText: string;
    description?: string;
    isResolved?: boolean;
  }>;
}) {
  return prisma.suggestion.createMany({
    data: suggestions,
  });
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  return prisma.suggestion.findMany({
    where: { documentId },
    orderBy: { createdAt: "desc" },
  });
}

// User queries
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function createUser(userData: {
  id: string;
  profileCompleted?: boolean;
  dataProcessingConsent?: boolean;
}) {
  return prisma.user.create({
    data: userData,
  });
}

export async function updateUser(
  id: string,
  userData: Partial<{
    profileCompleted: boolean;
    dataProcessingConsent: boolean;
    marketingConsent: boolean;
    researchConsent: boolean;
  }>
) {
  return prisma.user.update({
    where: { id },
    data: userData,
  });
}

// Cursor rules applied correctly.
