import { Router } from "express";
import {
  readProfileByUserId,
  readAdminProfile,
  readUserByID,
  readPublishedPosts,
} from "../controllers/read.js";
import {
  editUserName,
  editPassword,
  editDisplayName,
  editBio,
} from "../controllers/put.js";
import {
  validateUsernameRules,
  validatePasswordRules,
  validateDisplayNameRules,
  validateBioRules,
} from "../validations/validationChanges/validateUser.js";
import { checkValidationResult } from "../validations/checkValidationResult.js";
import { removeUserSelf } from "../controllers/delete.js";

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

userRouter.post(
  "/comment",
  validateCommentRules,
  checkValidationResult,
  addNewComment
);

export default userRouter;
