import { Router } from "express";
import {
  addAndPublishNewPost,
  addAndDraftNewPost,
} from "../controllers/post.js";
import { editAndPublishPost, editAndDraftPost } from "../controllers/put.js";

const postRouter = Router();

postRouter.post("/publish", addAndPublishNewPost);
postRouter.post("/draft", addAndDraftNewPost);

postRouter.put("/publish", editAndPublishPost);
postRouter.put("/draft", editAndDraftPost);

export default postRouter;
