import type { Comment, Post } from "../types/models.js";

type DatabasePost = Omit<Post, "createdAt" | "publishedAt"> & {
  createdAt: Date;
  publishedAt: Date | null;
};

type DatabaseComment = Omit<Comment, "createdAt"> & {
  createdAt: Date;
};

export function serializePost(post: DatabasePost): Post {
  return {
    ...post,
    createdAt: post.createdAt.toISOString(),
    publishedAt: post.publishedAt?.toISOString() ?? null,
  };
}

export function serializeComment(comment: DatabaseComment): Comment {
  return {
    ...comment,
    createdAt: comment.createdAt.toISOString(),
  };
}
