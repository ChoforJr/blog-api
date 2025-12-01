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
  checkUserValidationResult,
} from "../validations/validationChanges/validateUser.js";
import { removeUserSelf } from "../controllers/delete.js";

const userRouter = Router();

userRouter.get("/profile/admin", readAdminProfile);
userRouter.get("/profile/:id", readProfileByUserId);
userRouter.get("/myProfile", readUserByID);

userRouter.put(
  "/username",
  validateUsernameRules,
  checkUserValidationResult,
  editUserName
);
userRouter.put(
  "/password",
  validatePasswordRules,
  checkUserValidationResult,
  editPassword
);
userRouter.put(
  "/displayName",
  validateDisplayNameRules,
  checkUserValidationResult,
  editDisplayName
);
userRouter.put("/bio", validateBioRules, checkUserValidationResult, editBio);

userRouter.delete("/myProfile", removeUserSelf);

userRouter.get("/post", readPublishedPosts);
export default userRouter;
