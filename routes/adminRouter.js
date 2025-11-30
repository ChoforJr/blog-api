import { Router } from "express";
import { readUsers, readAdmin } from "../controllers/read.js";
import {
  removeUserByAdmin,
  removeAllUsersByAdmin,
} from "../controllers/delete.js";
import {
  validatePostRules,
  checkPostValidationResult,
} from "../validations/validatePost.js";
import postRouter from "./postRouter.js";

const adminRouter = Router();

adminRouter.get("/profile", readAdmin);
adminRouter.get("/users", readUsers);

adminRouter.delete("/user/:id", removeUserByAdmin);
adminRouter.delete("/users", removeAllUsersByAdmin);

adminRouter.use(
  "/post",
  validatePostRules,
  checkPostValidationResult,
  postRouter
);

export default adminRouter;
