import { Router } from "express";
import {
  addAndPublishNewPost,
  addAndDraftNewPost,
} from "../controllers/post.js";

const postRouter = Router();

postRouter.post("/publish", addAndPublishNewPost);
postRouter.post("/draft", addAndDraftNewPost);

export default postRouter;
