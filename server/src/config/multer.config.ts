import { Request } from "express";
import multer from "multer";

const profilePicStorage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, "src/uploads/profilePic");
  },

  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

export const profilePicUpload = multer({ storage: profilePicStorage });

const postFilesStorage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, "src/uploads/postFiles");
  },

  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

export const postFilesUpload = multer({ storage: postFilesStorage });
