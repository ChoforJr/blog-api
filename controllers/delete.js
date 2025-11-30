import {
  deleteAllUsersExceptAdmin,
  deleteUserByID,
  deletePost,
  deleteAllPosts,
  deleteAllDraftedPosts,
} from "../prisma_queries/delete.js";
import { findUserByID } from "../prisma_queries/find.js";

export async function removeUserSelf(req, res, next) {
  try {
    if (req.user.role == "ADMIN") {
      return res.sendStatus(403);
    }
    await deleteUserByID(req.user.id);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function removeUserByAdmin(req, res, next) {
  try {
    const userId = Number(req.params.id);
    const user = await findUserByID(userId);
    if (user.role == "ADMIN") {
      return res.sendStatus(403);
    }
    await deleteUserByID(userId);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function removeAllUsersByAdmin(req, res, next) {
  try {
    await deleteAllUsersExceptAdmin();
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function removePost(req, res, next) {
  try {
    await deletePost(Number(req.params.id));
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function removeAllPosts(req, res, next) {
  try {
    await deleteAllPosts();
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function removeAllDraftedPosts(req, res, next) {
  try {
    await deleteAllDraftedPosts();
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}
