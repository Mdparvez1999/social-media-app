import { Request } from "express";
import multer, { MulterError } from "multer";
import path from "path";

const allowedFileTypes = [
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/png",
  "image/gif",
];

const createStorage = (destinationFolder: string) =>
  multer.diskStorage({
    destination: function (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ) {
      cb(null, path.resolve(destinationFolder));
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

const profilePicStorage = createStorage("dist/uploads/profilePic");
const postFilesStorage = createStorage("dist/uploads/postFiles");

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

export const profilePicUpload = multer({
  storage: profilePicStorage,
  fileFilter,
});

export const postFilesUpload = multer({
  storage: postFilesStorage,
  fileFilter,
});
