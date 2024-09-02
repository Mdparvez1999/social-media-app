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
import { errorHandler } from "./middlewares/error.middleware";
import { apiLimiter } from "./config/rate_Limit.cofig";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// create express app
export const app: Application = express();

// Create __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve the uploads directory
app.use("/uploads", express.static(uploadsDir));

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

// set trust proxy
app.set("trust proxy", true);

// data parsing Middlewares
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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
app.use("/api/messages", chatRouter);

const __dirnameReact = path.dirname(fileURLToPath(import.meta.url));

// Serve static files from the client/dist directory
app.use(express.static(path.join(__dirnameReact, "../../client/dist")));

// Handle all other routes by serving the index.html file
app.get("*", (req, res, next) => {
  return res.sendFile(
    path.join(__dirnameReact, "../../client/dist/index.html")
  );
});

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.use(errorHandler);
