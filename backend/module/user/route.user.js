import express from "express";
import { getUserProfile } from "./controller.user.js";

const router = express.Router();

/**
 * Base Route : /api/users
 */

router.get("/profile", getUserProfile);

export default router;
