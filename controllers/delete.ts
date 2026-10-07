import {
  deleteAllUsersExceptAdmin,
  deleteUserByID,
  deletePost,
  deleteAllPosts,
  deleteAllDraftedPosts,
  deleteComment,
  deleteAllComments,
  deleteCommentsOfAPost,
} from "../prisma_queries/delete.js";
import {
  findUserByID,
  findPostByID,
  findCommentByID,
} from "../prisma_queries/find.js";
import type { NextFunction, Request, Response } from "express";
import { getAuthenticatedUser } from "../lib/auth.js";
import { emitRealtimeEvent } from "../websocket/server.js";

export async function removeUserSelf(req: Request, res: Response, next: NextFunction) {
  try {
    if (getAuthenticatedUser(req).role === "ADMIN") {
      return res.sendStatus(403);
    }
    await deleteUserByID(getAuthenticatedUser(req).id);
    res.sendStatus(200);
    emitRealtimeEvent("posts:refresh", {});
    emitRealtimeEvent("comments:refresh", {});
  } catch (err) {
    return next(err);
  }
}

export async function removeUserByAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = Number(req.params.id);
    const user = await findUserByID(userId);
    if (!user) {
      return res.sendStatus(404);
    }
    if (user.role === "ADMIN") {
      return res.sendStatus(403);
    }
    await deleteUserByID(userId);
    res.sendStatus(200);
    emitRealtimeEvent("posts:refresh", {});
    emitRealtimeEvent("comments:refresh", {});
  } catch (err) {
    return next(err);
  }
}

export async function removeAllUsersByAdmin(_req: Request, res: Response, next: NextFunction) {
  try {
    await deleteAllUsersExceptAdmin();
    res.sendStatus(200);
    emitRealtimeEvent("posts:refresh", {});
    emitRealtimeEvent("comments:refresh", {});
  } catch (err) {
    return next(err);
  }
}

export async function removePost(req: Request, res: Response, next: NextFunction) {
  try {
    const postId = Number(req.params.id);
    const post = await findPostByID(postId);
    if (!post) return res.sendStatus(404);
    await deletePost(postId);
    res.sendStatus(200);
    emitRealtimeEvent("post:deleted", { postId });
  } catch (err) {
    return next(err);
  }
}

export async function removeAllPosts(_req: Request, res: Response, next: NextFunction) {
  try {
    await deleteAllPosts();
    res.sendStatus(200);
    emitRealtimeEvent("posts:refresh", {});
    emitRealtimeEvent("comments:refresh", {});
  } catch (err) {
    return next(err);
  }
}

export async function removeAllDraftedPosts(_req: Request, res: Response, next: NextFunction) {
  try {
    await deleteAllDraftedPosts();
    res.sendStatus(200);
    emitRealtimeEvent("posts:refresh", {});
    emitRealtimeEvent("comments:refresh", {});
  } catch (err) {
    return next(err);
  }
}

export async function removeAllComments(_req: Request, res: Response, next: NextFunction) {
  try {
    await deleteAllComments();
    res.sendStatus(200);
    emitRealtimeEvent("comments:refresh", {});
  } catch (err) {
    return next(err);
  }
}

export async function removeCommentsOfAPost(req: Request, res: Response, next: NextFunction) {
  try {
    const postId = Number(req.params.id);
    const post = await findPostByID(postId);
    if (!post) {
      return res.status(404).json({ error: "This Post doesn't exist" });
    }
    await deleteCommentsOfAPost(postId);
    res.sendStatus(200);
    emitRealtimeEvent("comments:refresh", { postId });
  } catch (err) {
    return next(err);
  }
}

export async function removeComment(req: Request, res: Response, next: NextFunction) {
  try {
    const commentId = Number(req.params.id);
    const comment = await findCommentByID(commentId);
    if (!comment) {
      return res.status(404).json({ error: "This Comment doesn't exist" });
    }
    const user = getAuthenticatedUser(req);
    if (comment.userId !== user.id && user.role !== "ADMIN") {
      return res.status(403).json({
        error: "You are not authorized to delete this comment",
      });
    }
    await deleteComment(commentId);
    res.sendStatus(200);
    emitRealtimeEvent("comment:deleted", {
      commentId,
      postId: comment.postId,
    });
  } catch (err) {
    return next(err);
  }
}
