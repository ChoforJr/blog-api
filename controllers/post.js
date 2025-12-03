import path from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import {
  createAdmin,
  createUser,
  createPost,
  createComment,
} from "../prisma_queries/create.js";
import {
  findAdmin,
  findPublishedPostByID,
  findCommentByID,
} from "../prisma_queries/find.js";
import { matchedData } from "express-validator";
import { hash } from "bcryptjs";

async function addAdmin() {
  try {
    const checkAdmin = await findAdmin();
    if (checkAdmin) {
      return console.log("Admin Already exist");
    }
    const username = "choforjrforsakang@gmail.com";
    const password = `${process.env.ADMIN_PASSWORD}`;
    const displayName = "Chofor J. Forsakang";
    const bio = "This is the profile of the admin";
    const hashedPassword = await hash(password, 10);
    await createAdmin(username, hashedPassword, displayName, bio);
    return console.log("Admin created");
  } catch (err) {
    return console.error(err);
  }
}
addAdmin();

export async function addNewUser(req, res, next) {
  try {
    const { username, password, displayName } = matchedData(req);
    const hashedPassword = await hash(password, 10);
    const usernameLowerCase = username.toLowerCase();
    await createUser(usernameLowerCase, hashedPassword, displayName);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function addNewPost(req, res, next) {
  try {
    const { title, content, published } = matchedData(req);
    const parsedPublished = JSON.parse(published);
    let publishedAt;
    if (parsedPublished == true) {
      publishedAt = new Date();
    } else {
      publishedAt = null;
    }
    const userId = req.user.id;
    const post = await createPost(
      title,
      content,
      parsedPublished,
      userId,
      publishedAt
    );
    res.status(200).json({
      post,
    });
  } catch (err) {
    return next(err);
  }
}

export async function addNewComment(req, res, next) {
  try {
    const { content, parentId } = matchedData(req);
    const postId = Number(req.params.id);
    let parsedParentId = JSON.parse(parentId);
    const userId = req.user.id;
    const post = await findPublishedPostByID(postId);
    if (!post) {
      return res.json({
        error: "The Post doesn't exist",
      });
    }
    if (parsedParentId === 0) {
      parsedParentId = null;
    } else {
      const parentComment = await findCommentByID(parsedParentId);
      if (!parentComment) {
        return res.json({
          error: "Parent comment is not available",
        });
      }
      if (parentComment.postId !== postId) {
        return res.json({
          error: "Parent comment postId doesn't match the postId of child",
        });
      }
    }
    const comment = await createComment(
      content,
      userId,
      postId,
      parsedParentId
    );
    res.status(200).json({
      comment,
    });
  } catch (err) {
    return next(err);
  }
}
