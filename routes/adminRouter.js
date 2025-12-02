import { Router } from "express";
import { readUsers, readAdmin, readPosts } from "../controllers/read.js";
import {
  removeUserByAdmin,
  removeAllUsersByAdmin,
  removePost,
  removeAllPosts,
  removeAllDraftedPosts,
} from "../controllers/delete.js";
import { validatePostRules } from "../validations/validatePost.js";
import { checkValidationResult } from "../validations/checkValidationResult.js";
import { validatePostStateRules } from "../validations/validationChanges/validatePostState.js";
import { editPostState, editPost } from "../controllers/put.js";
import { addNewPost } from "../controllers/post.js";

const adminRouter = Router();

adminRouter.get("/profile", readAdmin);
adminRouter.get("/users", readUsers);

adminRouter.delete("/user/:id", removeUserByAdmin);
adminRouter.delete("/users", removeAllUsersByAdmin);

adminRouter.get("/post/all", readPosts);

adminRouter.post("/post", validatePostRules, checkValidationResult, addNewPost);

adminRouter.put(
  "/post/:id",
  validatePostRules,
  checkValidationResult,
  editPost
);
adminRouter.put(
  "/post/state/:id",
  validatePostStateRules,
  checkValidationResult,
  editPostState
);

adminRouter.delete("/post/all", removeAllPosts);
adminRouter.delete("/post/drafted", removeAllDraftedPosts);
adminRouter.delete("/post/:id", removePost);

export default adminRouter;
