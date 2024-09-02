import { Request } from "express";
import multer, { MulterError } from "multer";
import path from "path";
import fs from "fs";

// Define allowed file types
const allowedFileTypes = [
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/png",
  "image/gif",
];

// Helper function to create multer storage configuration
const createStorage = (destinationFolder: string) =>
  multer.diskStorage({
    destination: function (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ) {
      // Ensure the destination folder exists
      const dir = path.resolve(destinationFolder);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },

    filename: function (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ) {
      cb(
        null,
        file.fieldname + "_" + Date.now() + path.extname(file.originalname)
      );
    },
  });

// Create storage configurations
const profilePicStorage = createStorage(
  path.join(__dirname, "uploads/profilePic")
);
const postFilesStorage = createStorage(
  path.join(__dirname, "uploads/postFiles")
);

// File filter for allowed file types
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
  }
};

// Export multer configurations for profile pictures and post files
export const profilePicUpload = multer({
  storage: profilePicStorage,
  fileFilter,
});

export const postFilesUpload = multer({
  storage: postFilesStorage,
  fileFilter,
});
