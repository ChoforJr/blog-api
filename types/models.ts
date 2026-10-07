export type UserRole = "USER" | "ADMIN";
export type IsoDateTime = string;

export interface UserRecord {
  id: number;
  username: string;
  password: string;
  createdAt: IsoDateTime;
  role: UserRole;
}

export interface Profile {
  id: number;
  userId: number;
  displayName: string;
  bio: string | null;
  createdAt: IsoDateTime;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  createdAt: IsoDateTime;
  userId: number;
  publishedAt: IsoDateTime | null;
}

export interface Comment {
  id: number;
  content: string;
  userId: number;
  postId: number;
  createdAt: IsoDateTime;
}

export interface AuthenticatedUser {
  id: number;
  username: string;
  role: UserRole;
}

export interface UserSummary {
  id: number;
  username: string;
  createdAt: IsoDateTime;
  role: UserRole;
  profile: Profile | null;
}
