import { Router } from "express";

const adminRouter = Router();

adminRouter.get("/", (req, res) => {
  res.json({
    message: "it worked",
  });
});

export default adminRouter;
