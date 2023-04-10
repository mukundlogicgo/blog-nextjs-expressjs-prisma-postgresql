import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// import config
dotenv.config();



// export env variables
export const { JWT_SECRET, JWT_TOKEN_EXPIRES_IN } = process.env;
