import {
  updateUsername,
  updatePassword,
  updateDisplayName,
  updateBio,
  updatePost,
  updatePostState,
  updateComment,
} from "../prisma_queries/update.js";
import { findCommentByID } from "../prisma_queries/find.js";
import { matchedData } from "express-validator";
import { hash } from "bcryptjs";

export async function editUserName(req, res, next) {
  try {
    const { newUsername } = matchedData(req);
    const usernameLowerCase = newUsername.toLowerCase();
    await updateUsername(req.user.id, usernameLowerCase);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editPassword(req, res, next) {
  try {
    const { newPassword } = matchedData(req);
    const hashedPassword = await hash(newPassword, 10);
    await updatePassword(req.user.id, hashedPassword);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editDisplayName(req, res, next) {
  try {
    const { newDisplayName } = matchedData(req);
    await updateDisplayName(req.user.id, newDisplayName);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editBio(req, res, next) {
  try {
    const { newBio } = matchedData(req);
    await updateBio(req.user.id, newBio);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editPost(req, res, next) {
  try {
    const { title, content, published } = matchedData(req);
    const parsedPublished = JSON.parse(published);
    let publishedAt;
    if (parsedPublished == true) {
      publishedAt = new Date();
    } else {
      publishedAt = null;
    }
    const postId = Number(req.params.id);
    await updatePost(postId, title, content, parsedPublished, publishedAt);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editPostState(req, res, next) {
  try {
    const { published } = matchedData(req);
    const parsedPublished = JSON.parse(published);
    const postId = Number(req.params.id);
    let publishedAt;
    if (parsedPublished == true) {
      publishedAt = new Date();
    } else {
      publishedAt = null;
    }
    await updatePostState(postId, parsedPublished, publishedAt);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editComment(req, res, next) {
  try {
    const { content } = matchedData(req);
    const commentId = Number(req.params.id);
    const comment = await findCommentByID(commentId);
    if (!comment) {
      return res.json({
        error: "This Comment is doesn't exist",
      });
    }
    if (comment.userId !== req.user.id) {
      return res.json({
        error: "You are not authorized to edit this comment",
      });
    }
    await updateComment(commentId, content);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}
