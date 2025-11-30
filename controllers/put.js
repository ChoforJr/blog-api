import {
  updateUsername,
  updatePassword,
  updateDisplayName,
  updateBio,
  updatePost,
} from "../prisma_queries/update.js";
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

export async function editAndPublishPost(req, res, next) {
  try {
    const { title, content } = matchedData(req);
    const published = true;
    const postId = Number(req.params.id);
    const publishedAt = new Date();
    await updatePost(postId, title, content, published, publishedAt);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function editAndDraftPost(req, res, next) {
  try {
    const { title, content } = matchedData(req);
    const published = false;
    const postId = Number(req.params.id);
    const publishedAt = null;
    await updatePost(postId, title, content, published, publishedAt);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}
