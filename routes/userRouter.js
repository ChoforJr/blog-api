import { Router } from "express";
import {
  readProfileByUserId,
  readAdminProfile,
  readUserByID,
} from "../controllers/read.js";

const userRouter = Router();

userRouter.get("/profile/admin", readAdminProfile);
userRouter.get("/profile/:id", readProfileByUserId);
userRouter.get("/myProfile", readUserByID);

export default userRouter;
