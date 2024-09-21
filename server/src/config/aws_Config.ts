import { S3Client } from "@aws-sdk/client-s3";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

export const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  },
});
