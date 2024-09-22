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
import chatRouter from "./routes/chats.routes";
import awsS3Router from "./routes/awsS3.routes";
import { errorHandler } from "./middlewares/error.middleware";

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
    origin: "https://social-media-app-livid-ten.vercel.app",
    credentials: true,
  })
);

const isProduction = process.env.NODE_ENV === "production";

// set trust proxy
app.set("trust proxy", isProduction ? true : false);

// data parsing Middlewares
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user/profile", userProfileRouter);
app.use("/api/admin", adminRouter);
app.use("/api/aws-s3", awsS3Router);
app.use("/api/users/post", postRouter);
app.use("/api/post/comments", commentRouter);
app.use("/api/users", followRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/messages", chatRouter);

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.use(errorHandler);
