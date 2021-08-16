import AWS from "aws-sdk";
import { Stream } from "stream";
export const uploadToS3 = async (file: Stream, fileName: string) => {
  const AWS_S3_CREDENTIALS = {
    accessKey: process.env.AWS_ACCESS_KEY,
    secret: process.env.AWS_SECRET_KEY,
    bucketName: process.env.AWS_S3_BUCKET_NAME,
    region: process.env.AWS_BUCKET_REGION,
  };
  AWS.config.update({
    region: AWS_S3_CREDENTIALS.region,
  });
  const s3 = new AWS.S3({
    region: AWS_S3_CREDENTIALS.region,
    accessKeyId: AWS_S3_CREDENTIALS.accessKey,
    secretAccessKey: AWS_S3_CREDENTIALS.secret,
  });
  // const uploadOptions = {
  //   Bucket: AWS_S3_CREDENTIALS.bucketName,
  //   Body: file,
  //   Key: fileName,
  //   region: AWS_S3_CREDENTIALS.region,
  // };
  return s3
    .upload({
      Bucket: AWS_S3_CREDENTIALS.bucketName,
      Body: file,
      Key: fileName,
    })
    .promise();
};

// export const downloadFromS3 = async (fileName: string) => {

// };
