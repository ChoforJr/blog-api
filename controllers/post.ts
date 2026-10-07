import {
  createUser,
  createPost,
  createComment,
} from "../prisma_queries/create.js";
import { findPublishedPostByID } from "../prisma_queries/find.js";
import { matchedData } from "express-validator";
import { hash } from "bcryptjs";
import type { NextFunction, Request, Response } from "express";
import { getAuthenticatedUser } from "../lib/auth.js";
import { emitRealtimeEvent } from "../websocket/server.js";
import { serializeComment, serializePost } from "../lib/serializers.js";

export async function addNewUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, password, displayName } = matchedData<{
      username: string;
      password: string;
      displayName: string;
    }>(req);
    const hashedPassword = await hash(password, 12);
    await createUser(username, hashedPassword, displayName);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

export async function addNewPost(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, content, published } = matchedData<{
      title: string;
      content: string;
      published: boolean;
    }>(req);
    const publishedAt = published ? new Date() : null;
    const userId = getAuthenticatedUser(req).id;
    const post = await createPost(
      title,
      content,
      published,
      userId,
      publishedAt
    );
    res.status(201).json({ post });
    if (published && post[0]) {
      emitRealtimeEvent("post:published", serializePost(post[0]));
    }
  } catch (err) {
    next(err);
  }
}

export async function addNewComment(req: Request, res: Response, next: NextFunction) {
  try {
    const { content } = matchedData<{ content: string }>(req);
    const postId = Number(req.params.id);
    const userId = getAuthenticatedUser(req).id;
    const post = await findPublishedPostByID(postId);
    if (!post) {
      res.status(404).json({ error: "The Post doesn't exist" });
      return;
    }
    const comment = await createComment(content, userId, postId);
    res.status(201).json({ comment });
    if (comment[0]) {
      emitRealtimeEvent("comment:created", serializeComment(comment[0]));
    }
  } catch (err) {
    next(err);
  }
}
