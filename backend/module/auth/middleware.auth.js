import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/defaults.config.js";

/**
 * Authenticate user before access resource
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
export const authenticateUser = async (req, res, next) => {
  try {
    // get token from req headers
    const token = req.headers.authorization.split(" ")[1];

    // get payload from token
    const payload = await jwt.verify(token, JWT_SECRET);

    // attach user id to req obj
    req.userId = payload.id;

    next();
  } catch (error) {
    console.log(`[ERROR] ${error.message}`);
    return res.status(401).json({
      success: false,
      error: "Token is required or expired",
    });
  }
};
