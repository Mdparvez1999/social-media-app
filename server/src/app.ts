import "reflect-metadata";
import express, { Application, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";

import { AppDataSource } from "./config/DB_Connection";
import authRouter from "./routes/auth.routes";
import userProfileRouter from "./routes/userProfile.routes";
import adminRouter from "./routes/admin.routes";
import postRouter from "./routes/post.routes";
import commentRouter from "./routes/comments.routes";
import followRouter from "./routes/follow.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { auth } from "./middlewares/auth.Middleware";

// create express app
export const app: Application = express();

// database connection
AppDataSource.initialize()
  .then(() => {
    console.log("database connected");
  })
  .catch((error: Error) => {
    console.log(error);
  });

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user/profile", userProfileRouter);
app.use("/api/admin", adminRouter);
app.use("/api/users/post", postRouter);
app.use("/api/post/comments", commentRouter);
app.use("/api/users", followRouter);

app.get("/test", auth, (req: Request, res: Response, next: NextFunction) => {
  console.log(res.locals.user);

  res.send("Hello World!");
});

app.use(errorHandler);
