import { Router } from "express";
import {
  readProfileByUserId,
  readAdminProfile,
  readUserByID,
  readPublishedPosts,
  readCommentsOfPost,
} from "../controllers/read.js";
import {
  editUserName,
  editPassword,
  editDisplayName,
  editBio,
  editComment,
} from "../controllers/put.js";
import {
  validateUsernameRules,
  validatePasswordRules,
  validateDisplayNameRules,
  validateBioRules,
} from "../validations/validationChanges/validateUser.js";
import { validateCommentChangeRules } from "../validations/validationChanges/validateCommentChange.js";
import { checkValidationResult } from "../validations/checkValidationResult.js";
import { removeUserSelf, removeComment } from "../controllers/delete.js";

import { addNewComment } from "../controllers/post.js";
import { validateCommentRules } from "../validations/validateComment.js";

const userRouter = Router();

userRouter.get("/profile/admin", readAdminProfile);
userRouter.get("/profile/:id", readProfileByUserId);
userRouter.get("/myProfile", readUserByID);

userRouter.put(
  "/username",
  validateUsernameRules,
  checkValidationResult,
  editUserName
);
userRouter.put(
  "/password",
  validatePasswordRules,
  checkValidationResult,
  editPassword
);
userRouter.put(
  "/displayName",
  validateDisplayNameRules,
  checkValidationResult,
  editDisplayName
);
userRouter.put("/bio", validateBioRules, checkValidationResult, editBio);

userRouter.delete("/myProfile", removeUserSelf);

userRouter.get("/post", readPublishedPosts);
userRouter.get("/post/:id/comments", readCommentsOfPost);

userRouter.post(
  "/post/:id/comment",
  validateCommentRules,
  checkValidationResult,
  addNewComment
);

userRouter.put(
  "/post/comment/:id",
  validateCommentChangeRules,
  checkValidationResult,
  editComment
);

userRouter.delete("/post/comment/:id", removeComment);

export default userRouter;
