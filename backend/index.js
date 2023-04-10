import express from "express";
import userRouter from "./module/user/route.user.js";
import postRouter from "./module/post/route.post.js";
import authRouter from "./module/auth/route.auth.js";
import morgan from "morgan";
import cors from "cors";
import { authenticateUser } from "./module/auth/middleware.auth.js";

const app = express();

// logger
app.use(morgan("dev"));

// allow cors
app.use(cors());

// parse req body
app.use(express.json());

// auth route
app.use("/api/auth", authRouter);

// authentication is required for bellow route
app.use(authenticateUser);

// users route
app.use("/api/users", userRouter);

// posts routes
app.use("/api/posts", postRouter);

// start server
app.listen(5000, () => console.log(`Server running on 5000`));

// catch all error
process.on("SIGTERM", async (error) => {
  console.log("Sigterm ", error);
});

process.on("uncaughtException", async (error) => {
  console.dir(error.message);
});
