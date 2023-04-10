import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  JWT_TOKEN_EXPIRES_IN,
} from "../../config/defaults.config.js";

/**
 * create jwt token
 * @param {*} user
 * @returns {String} jwt token
 */
export const createToken = async (user) => {
  if (!user?.id) {
    throw new Error("unable to create token please provide user id");
  }
  const token = await jwt.sign({ id: user.id }, JWT_SECRET, {
    expiresIn: JWT_TOKEN_EXPIRES_IN,
  });

  return token;
};
