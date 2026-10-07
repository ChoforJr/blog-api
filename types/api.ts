import type {
  AuthenticatedUser,
  Comment,
  Post,
  Profile,
  UserSummary,
} from "./models.js";

export interface ApiSuccess<T> {
  data: T;
}

export interface ApiFailure {
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface SignUpRequest {
  username: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: AuthenticatedUser;
  token?: string;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  published: boolean;
}

export interface UpdatePostRequest {
  title: string;
  content: string;
}

export interface UpdatePostStateRequest {
  published: boolean;
}

export interface CreateCommentRequest {
  content: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
  bio?: string | null;
}

export interface PublishedPostsResponse {
  posts: Post[];
}

export interface PostResponse {
  post: Post;
}

export interface CommentsResponse {
  comments: Comment[];
}

export interface ProfileResponse {
  profile: Profile;
}

export interface UsersResponse {
  users: UserSummary[];
}

export type RequestId = string;
