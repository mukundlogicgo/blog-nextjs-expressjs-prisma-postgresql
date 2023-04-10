import express from "express";
import { loginUser, registerUser } from "./controller.auth.js";
import { upload } from "../../config/multer.config.js";

/**
 * Base Route : /api/auth
 */
const router = express.Router();

router.post("/register", upload.none(), registerUser);
router.post("/login", upload.none(), loginUser);

export default router;
