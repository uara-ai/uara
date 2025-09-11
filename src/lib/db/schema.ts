// TypeScript types for Prisma models
export type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  profileCompleted: boolean;
  dateOfBirth?: Date | null;
  gender?: string | null;
  ethnicity?: string | null;
  heightCm?: number | null;
  weightKg?: number | null;
  bloodType?: string | null;
  medicalConditions?: string | null;
  allergies?: string | null;
  medications?: string | null;
  dataProcessingConsent: boolean;
  marketingConsent: boolean;
  researchConsent: boolean;
};

export type Chat = {
  id: string;
  title: string;
  userId: string;
  visibility: string;
  createdAt: Date;
  updatedAt: Date;
};

export type DBMessage = {
  id: string;
  chatId: string;
  role: string;
  parts: any;
  attachments: any;
  createdAt: Date;
};

export type Vote = {
  chatId: string;
  messageId: string;
  isUpvoted: boolean;
};

export type Document = {
  id: string;
  chatId?: string | null;
  userId: string;
  title: string;
  content?: string | null;
  kind: string;
  createdAt: Date;
};

export type Suggestion = {
  id: string;
  documentId: string;
  userId: string;
  originalText: string;
  suggestedText: string;
  description?: string | null;
  isResolved: boolean;
  createdAt: Date;
};

// Cursor rules applied correctly.
