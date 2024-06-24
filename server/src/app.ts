import "reflect-metadata";
import express, { Application, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";

import { AppDataSource } from "./config/DB_Connection";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/userProfile.routes";
import adminRouter from "./routes/admin.routes";
import postRouter from "./routes/post.routes";
import { errorHandler } from "./middlewares/error.middleware";

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
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/users/post", postRouter);

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello World!");
});

app.use(errorHandler);
