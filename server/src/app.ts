import "reflect-metadata";
import express, { Application, Request, Response, NextFunction } from "express";

import { AppDataSource } from "./config/DB_Connection";
import authRouter from "./routes/auth.routes";
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRouter);

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello World!");
});

app.use(errorHandler);
