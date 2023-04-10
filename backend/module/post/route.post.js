import express from "express";
import {
  createCommentOnPost,
  createPost,
  getUserPostById,
  getUserPosts,
  togglePostLike,
} from "./controller.post.js";
import { upload } from "../../config/multer.config.js";

/**
 * Base route : /api/posts
 */

const router = express.Router();

// create new post
router.post("/", upload.none(), createPost);

// create comment on a post
router.post("/:postId/comments", upload.none(), createCommentOnPost);

// toggle post like
router.put("/:postId/likes/toggle", togglePostLike);

// get user's all posts
router.get("/", upload.none(), getUserPosts);

// get user post by id
router.get("/:postId", upload.none(), getUserPostById);

export default router;
