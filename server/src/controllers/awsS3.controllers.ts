import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AwsS3Utils } from "../utils/awsS3.utils";

export class AwsS3Controllers {
  public createPutObjectUrlForPosts = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { files } = req.body;

      const presignedUrl: { key: string; presignedUrl: string }[] | undefined =
        await AwsS3Utils.putObjectUrlForPost(files);

      return res.status(200).json({
        success: true,
        message: "Presigned URL created successfully",
        data: presignedUrl,
      });
    }
  );

  public createGetObjectUrlForPosts = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const keys: string[] = req.body;

      const urls: string[] | undefined = await AwsS3Utils.getObjectUrlForPosts(
        keys
      );

      return res.status(200).json({
        success: true,
        message: "Presigned URL created successfully",
        data: urls,
      });
    }
  );

  public createPutObjectUrlForProfilePic = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const file: { name: string; contentType: string } = req.body;

      const presignedUrl: { key: string; presignedUrl: string } | undefined =
        await AwsS3Utils.putObjectUrlForProfilePic(file);

      return res.status(200).json({
        success: true,
        message: "Presigned URL created successfully",
        data: presignedUrl,
      });
    }
  );

  public createGetObjectUrlForProfilePic = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { key } = req.body;

      const url: string | undefined =
        await AwsS3Utils.getObjectUrlForProfilePic(key);

      return res.status(200).json({
        success: true,
        message: "Presigned URL created successfully",
        data: url,
      });
    }
  );

  public createGetObjectUrlForAllProfilePics = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const keys: string[] = req.body;

      const urls: string[] | undefined =
        await AwsS3Utils.getObjectUrlForProfilePicsAll(keys);

      return res.status(200).json({
        success: true,
        message: "Presigned URL created successfully",
        data: urls,
      });
    }
  );
}
