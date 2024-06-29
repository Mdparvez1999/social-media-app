import "reflect-metadata";
import express, { Application, Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";

import helmet from "helmet";
import { AppDataSource } from "./config/DB_Connection";
import CORS from "cors";
import authRouter from "./routes/auth.routes";
import userProfileRouter from "./routes/userProfile.routes";
import adminRouter from "./routes/admin.routes";
import postRouter from "./routes/post.routes";
import commentRouter from "./routes/comments.routes";
import followRouter from "./routes/follow.routes";
import notificationRouter from "./routes/notification.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { auth } from "./middlewares/auth.Middleware";
import { apiLimiter } from "./config/rate_Limit.cofig";

// create express app
export const app: Application = express();

// security middlewares
app.use(helmet());

// database connection
AppDataSource.initialize()
  .then(() => {
    console.log("database connected");
  })
  .catch((error: Error) => {
    console.log(error);
  });

// global middlewares
app.use(
  CORS({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// data parsing Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rate limiter
app.use("/api", apiLimiter);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user/profile", userProfileRouter);
app.use("/api/admin", adminRouter);
app.use("/api/users/post", postRouter);
app.use("/api/post/comments", commentRouter);
app.use("/api/users", followRouter);
app.use("/api/notification", notificationRouter);

app.get("/test", auth, (req: Request, res: Response, next: NextFunction) => {
  console.log(res.locals.user);

  res.send("Hello World!");
});

app.use(errorHandler);
