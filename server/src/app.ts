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
// import userRouter from "./routes/users.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { auth } from "./middlewares/auth.Middleware";
import { apiLimiter } from "./config/rate_Limit.cofig";
import path from "path";

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
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// data parsing Middlewares
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// rate limiter
// app.use("/api", apiLimiter);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user/profile", userProfileRouter);
app.use("/api/admin", adminRouter);
app.use("/api/users/post", postRouter);
app.use("/api/post/comments", commentRouter);
app.use("/api/users", followRouter);
app.use("/api/notification", notificationRouter);
// app.use("/api/user", auth, userRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("hello");
});

app.use(errorHandler);
