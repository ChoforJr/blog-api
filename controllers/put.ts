import {
  updateUsername,
  updatePassword,
  updateDisplayName,
  updateBio,
  updatePost,
  updatePostState,
  updateComment,
} from "../prisma_queries/update.js";
import { findCommentByID, findPostByID } from "../prisma_queries/find.js";
import { matchedData } from "express-validator";
import { hash } from "bcryptjs";
import type { NextFunction, Request, Response } from "express";
import { getAuthenticatedUser } from "../lib/auth.js";
import { emitRealtimeEvent } from "../websocket/server.js";
import { serializeComment, serializePost } from "../lib/serializers.js";

export async function editUserName(req: Request, res: Response, next: NextFunction) {
  try {
    const { newUsername } = matchedData<{ newUsername: string }>(req);
    const usernameLowerCase = newUsername.toLowerCase();
    await updateUsername(getAuthenticatedUser(req).id, usernameLowerCase);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { newPassword } = matchedData<{ newPassword: string }>(req);
    const hashedPassword = await hash(newPassword, 12);
    await updatePassword(getAuthenticatedUser(req).id, hashedPassword);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editDisplayName(req: Request, res: Response, next: NextFunction) {
  try {
    const { newDisplayName } = matchedData<{ newDisplayName: string }>(req);
    await updateDisplayName(getAuthenticatedUser(req).id, newDisplayName);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editBio(req: Request, res: Response, next: NextFunction) {
  try {
    const { newBio } = matchedData<{ newBio: string }>(req);
    await updateBio(getAuthenticatedUser(req).id, newBio);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editPost(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, content, published } = matchedData<{
      title: string;
      content: string;
      published: boolean;
    }>(req);
    const postId = Number(req.params.id);
    const previousPost = await findPostByID(postId);
    if (!previousPost) {
      res.status(404).json({ error: "The Post doesn't exist" });
      return;
    }
    const publishedAt = published ? new Date() : null;
    const post = await updatePost(
      postId,
      title,
      content,
      published,
      publishedAt
    );
    res.sendStatus(200);
    if (published && previousPost.published) {
      emitRealtimeEvent("post:updated", serializePost(post));
    } else if (published) {
      emitRealtimeEvent("post:published", serializePost(post));
    } else if (previousPost.published) {
      emitRealtimeEvent("post:deleted", { postId });
    }
  } catch (err) {
    return next(err);
  }
}

export async function editPostState(req: Request, res: Response, next: NextFunction) {
  try {
    const { published } = matchedData<{ published: boolean }>(req);
    const postId = Number(req.params.id);
    const previousPost = await findPostByID(postId);
    if (!previousPost) {
      res.status(404).json({ error: "The Post doesn't exist" });
      return;
    }
    const publishedAt = published ? new Date() : null;
    const post = await updatePostState(postId, published, publishedAt);
    res.sendStatus(200);
    if (published && previousPost.published) {
      emitRealtimeEvent("post:updated", serializePost(post));
    } else if (published) {
      emitRealtimeEvent("post:published", serializePost(post));
    } else if (previousPost.published) {
      emitRealtimeEvent("post:deleted", { postId });
    }
  } catch (err) {
    return next(err);
  }
}

export async function editComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { content } = matchedData<{ content: string }>(req);
    const commentId = Number(req.params.id);
    const comment = await findCommentByID(commentId);
    if (!comment) {
      res.status(404).json({ error: "This Comment doesn't exist" });
      return;
    }
    if (comment.userId !== getAuthenticatedUser(req).id) {
      res.status(403).json({ error: "You are not authorized to edit this comment" });
      return;
    }
    const updatedComment = await updateComment(commentId, content);
    res.sendStatus(200);
    emitRealtimeEvent("comment:updated", serializeComment(updatedComment));
  } catch (err) {
    return next(err);
  }
}
