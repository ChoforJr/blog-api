import { Router } from "express";
import { readUsers, readAdmin } from "../controllers/read.js";

const adminRouter = Router();

adminRouter.get("/profile", readAdmin);
adminRouter.get("/users", readUsers);

export default adminRouter;
