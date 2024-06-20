import { Request, Response, NextFunction, RequestHandler } from "express";

type asyncController = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const asyncHandler = (controller: asyncController): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      console.log("error async handler : ", error);
      next(error);
    }
  };
};
