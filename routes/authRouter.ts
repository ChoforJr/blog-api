import { Router } from "express";
import passport from "passport";
import { authLogin, authLogout } from "../controllers/auth.js";

import {
  readPublishedPosts,
  readPublishedPost,
  readCommentsOfPost,
  readComments,
  readProfiles,
} from "../controllers/read.js";
import { addNewUser } from "../controllers/post.js";
import { validateSignUpRules } from "../validations/validateSignUp.js";
import { checkValidationResult } from "../validations/checkValidationResult.js";
import { validateLogInRules } from "../validations/validateLogIn.js";
import indexRouter from "./indexRouter.js";
import { validateId } from "../middleware/validateId.js";

const authRouter = Router();
authRouter.param("id", validateId);

authRouter.post(
  "/signup",
  validateSignUpRules,
  checkValidationResult,
  addNewUser
);

authRouter.post("/login", validateLogInRules, checkValidationResult, authLogin);
authRouter.post("/logout", authLogout);

authRouter.get("/profiles", readProfiles);
authRouter.get("/post", readPublishedPosts);
authRouter.get("/post/:id", readPublishedPost);
authRouter.get("/post/:id/comments", readCommentsOfPost);
authRouter.get("/comments", readComments);

authRouter.use(
  "/",
  passport.authenticate("jwt", { session: false }),
  indexRouter
);

export default authRouter;
