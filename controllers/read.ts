import {
  findAdmin,
  findUsers,
  findUserByID,
  findProfileByUserID,
  findProfiles,
  findPosts,
  findPublishedPosts,
  findCommentsByPostID,
  findPublishedPostByID,
  findComments,
} from "../prisma_queries/find.js";
import type { NextFunction, Request, Response } from "express";
import { getAuthenticatedUser } from "../lib/auth.js";

export async function readAdmin(_req: Request, res: Response, next: NextFunction) {
  try {
    const adminInfo = await findAdmin();
    res.json({ adminInfo });
  } catch (err) {
    return next(err);
  }
}

export async function readAdminProfile(_req: Request, res: Response, next: NextFunction) {
  try {
    const adminInfo = await findAdmin();
    if (!adminInfo) {
      res.status(404).json({ error: "The admin profile doesn't exist" });
      return;
    }
    const adminProfile = adminInfo.profile;
    res.json({ adminProfile });
  } catch (err) {
    return next(err);
  }
}

export async function readUsers(_req: Request, res: Response, next: NextFunction) {
  try {
    const users = await findUsers();
    res.json({ users });
  } catch (err) {
    return next(err);
  }
}

export async function readUserByID(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await findUserByID(getAuthenticatedUser(req).id);
    if (!user) {
      res.status(404).json({ error: "This user doesn't exist" });
      return;
    }
    res.json({ user });
  } catch (err) {
    return next(err);
  }
}

export async function readProfileByUserId(req: Request, res: Response, next: NextFunction) {
  try {
    const profile = await findProfileByUserID(Number(req.params.id));
    if (!profile) {
      res.status(404).json({ error: "This user doesn't exist" });
      return;
    }
    res.json({ profile });
  } catch (err) {
    return next(err);
  }
}

export async function readProfiles(_req: Request, res: Response, next: NextFunction) {
  try {
    const profiles = await findProfiles();
    res.json({ profiles });
  } catch (err) {
    return next(err);
  }
}

export async function readPosts(_req: Request, res: Response, next: NextFunction) {
  try {
    const posts = await findPosts();
    res.json({ posts });
  } catch (err) {
    return next(err);
  }
}

export async function readPublishedPosts(_req: Request, res: Response, next: NextFunction) {
  try {
    const publishedPosts = await findPublishedPosts();
    res.json({ publishedPosts });
  } catch (err) {
    return next(err);
  }
}

export async function readPublishedPost(req: Request, res: Response, next: NextFunction) {
  try {
    const post = await findPublishedPostByID(Number(req.params.id));
    if (!post) {
      res.status(404).json({ error: "The Post doesn't exist" });
      return;
    }
    res.json({ post });
  } catch (err) {
    next(err);
  }
}

export async function readCommentsOfPost(req: Request, res: Response, next: NextFunction) {
  try {
    const postId = Number(req.params.id);
    const post = await findPublishedPostByID(postId);
    if (!post) {
      res.status(404).json({ error: "The Post doesn't exist" });
      return;
    }
    const comments = await findCommentsByPostID(postId);
    res.json({ comments });
  } catch (err) {
    return next(err);
  }
}

export async function readComments(_req: Request, res: Response, next: NextFunction) {
  try {
    const comments = await findComments();
    res.json({ comments });
  } catch (err) {
    return next(err);
  }
}
