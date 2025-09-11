export interface User {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  name?: string | null;
  email?: string | null;
  profilePictureUrl?: string | null;
  avatarUrl?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
