import { Router } from "express";
import passport from "passport";
import { authLogin } from "../config/passport.js";

import { readPublishedPosts, readCommentsOfPost } from "../controllers/read.js";
import { addNewUser } from "../controllers/post.js";
import { validateSignUpRules } from "..//validations/validateSignUp.js";
import { checkValidationResult } from "../validations/checkValidationResult.js";
import { validateLogInRules } from "..//validations/validateLogIn.js";
import indexRouter from "./indexRouter.js";

const authRouter = Router();

authRouter.post(
  "/signup",
  validateSignUpRules,
  checkValidationResult,
  addNewUser
);

authRouter.post("/login", validateLogInRules, checkValidationResult, authLogin);

authRouter.get("/post", readPublishedPosts);
authRouter.get("/post/:id/comments", readCommentsOfPost);

authRouter.use(
  "/",
  passport.authenticate("jwt", { session: false }),
  indexRouter
);

export default authRouter;
