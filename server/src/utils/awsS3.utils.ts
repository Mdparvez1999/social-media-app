import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/aws_Config";

export class AwsS3Utils {
  public static async putObjectUrlForPost(
    files: { name: string; contentType: string }[]
  ) {
    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const key = `${Date.now()}${file.name}`;

          const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `uploads/postFiles/${key}`,
            ContentType: file.contentType,
          });

          const presignedUrl = await getSignedUrl(s3Client, command);
          return { key, presignedUrl };
        })
      );

      return urls;
    } catch (error) {
      console.log("error in putObjectUrl utils", error);
    }
  }

  public static async getObjectUrlForPosts(keys: string[]) {
    try {
      const urls = await Promise.all(
        keys.map(async (key: string) => {
          const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `uploads/postFiles/${key}`,
          });
          const presignedUrl = await getSignedUrl(s3Client, command);
          return presignedUrl;
        })
      );
      return urls;
    } catch (error) {
      console.log("error in getObjectUrl utils", error);
    }
  }

  public static async putObjectUrlForProfilePic(file: {
    name: string;
    contentType: string;
  }) {
    try {
      const key = `${Date.now()}${file.name}`;

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `uploads/profilePics/${key}`,
        ContentType: file.contentType,
      });

      const presignedUrl = await getSignedUrl(s3Client, command);

      return { key, presignedUrl };
    } catch (error) {
      console.log("error in putObjectUrl utils", error);
    }
  }

  public static async getObjectUrlForProfilePic(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `uploads/profilePics/${key}`,
      });

      const url = await getSignedUrl(s3Client, command);

      return url;
    } catch (error) {
      console.log("error in getObjectUrl utils", error);
    }
  }

  public static async getObjectUrlForProfilePicsAll(keys: string[]) {
    try {
      const urls = await Promise.all(
        keys.map(async (key: string) => {
          const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `uploads/profilePics/${key}`,
          });
          const url = await getSignedUrl(s3Client, command);
          return url;
        })
      );
      return urls;
    } catch (error) {
      console.log("error in getObjectUrl utils", error);
    }
  }
}
