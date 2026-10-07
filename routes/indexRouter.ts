import { Router } from "express";
import userRouter from "./userRouter.js";
import adminRouter from "./adminRouter.js";
import { checkIfUserIsAdmin } from "../middleware/auth.js";

const indexRouter = Router();

indexRouter.use("/admin", checkIfUserIsAdmin, adminRouter);

indexRouter.use("/user", userRouter);

export default indexRouter;
