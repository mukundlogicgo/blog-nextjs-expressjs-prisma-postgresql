import bcrypt from "bcrypt";

import { createToken } from "./helper.auth.js";
import { prisma } from "../../config/prisma.config.js";

/**
 * create or register new user
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // validate req boy
  if (
    !name ||
    !name?.trim() ||
    !email ||
    !email?.trim() ||
    !password ||
    !password?.trim()
  ) {
    return res.status(400).json({
      success: false,
      error: "All fields are required",
    });
  }

  // check user not exist
  const existUser = await prisma.user.findFirst({
    where: { email },
  });

  if (existUser) {
    return res.status(409).json({
      success: false,
      error: "User name or email already taken",
    });
  }

  // encrypt user's password
  const encryptedPassword = await bcrypt.hash(password, 12);

  try {
    // create new user to db
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: encryptedPassword,
      },
    });

    // remove password from user obj before send response
    delete user.password;

    // send user created response
    return res.status(201).json({
      success: true,
      message: `Register successful please login`,
      data: user,
    });
  } catch (error) {
    console.log(`[ERROR] ${error.message}`);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

/**
 * login user and generate jwt token
 * @param {*} req
 * @param {*} res
 * @returns
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // make sure user don't exit with same credentials
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // match user password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // create token and add to user obj
    const token = await createToken(user);
    user.token = token;

    // remove password from user obj before send response
    delete user.password;

    // send success response
    return res.status(200).json({
      success: true,
      message: `Login successfully`,
      data: user,
    });
  } catch (error) {
    console.log(`[ERROR] ${error.message}`);

    //send server error response
    return res.status(500).json({
      success: false,
      error: "Unable to login try after some time",
    });
  }
};
