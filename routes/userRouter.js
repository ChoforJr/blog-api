import { Router } from "express";
import {
  readProfileByUserId,
  readAdminProfile,
  readUserByID,
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

export default userRouter;
