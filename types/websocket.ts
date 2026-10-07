import type { Comment, Post } from "./models.js";

export interface ServerToClientEvents {
  "post:created": (post: Post) => void;
  "post:updated": (post: Post) => void;
  "post:deleted": (payload: { postId: number }) => void;
  "post:published": (post: Post) => void;
  "posts:refresh": (payload: Record<string, never>) => void;
  "comment:created": (comment: Comment) => void;
  "comment:updated": (comment: Comment) => void;
  "comment:deleted": (payload: { commentId: number; postId: number }) => void;
  "comments:refresh": (payload: { postId?: number }) => void;
}

export interface ClientToServerEvents {
  "post:subscribe": (payload: { postId: number }) => void;
  "post:unsubscribe": (payload: { postId: number }) => void;
}
