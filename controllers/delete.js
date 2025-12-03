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

export async function removeAllComments(req, res, next) {
  try {
    await deleteAllComments();
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function removeCommentsOfAPost(req, res, next) {
  try {
    const postId = Number(req.params.id);
    const post = await findPostByID(postId);
    if (!post) {
      return res.json({
        error: "This Post doesn't exist",
      });
    }
    await deleteCommentsOfAPost(postId);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}

export async function removeComment(req, res, next) {
  try {
    const commentId = Number(req.params.id);
    const comment = await findCommentByID(commentId);
    if (!comment) {
      return res.json({
        error: "This Comment doesn't exist",
      });
    }
    if (comment.userId !== req.user.id && req.user.role !== "ADMIN") {
      return res.json({
        error: "You are not authorized to delete this comment",
      });
    }
    await deleteComment(commentId);
    res.sendStatus(200);
  } catch (err) {
    return next(err);
  }
}
