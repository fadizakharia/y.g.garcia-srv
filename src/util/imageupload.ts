import AWS from "aws-sdk";
import { Stream } from "stream";
const AWS_S3_CREDENTIALS = {
  accessKey: process.env.AWS_ACCESS_KEY,
  secret: process.env.AWS_SECRET_KEY,
  bucketName: process.env.AWS_S3_BUCKET_NAME,
  region: process.env.AWS_BUCKET_REGION,
};
const s3 = new AWS.S3({
  accessKeyId: AWS_S3_CREDENTIALS.accessKey,
  secretAccessKey: AWS_S3_CREDENTIALS.secret,
  region: AWS_S3_CREDENTIALS.region,
});
export const uploadToS3 = async (file: Stream, fileName: string) => {
  const uploadOptions = {
    Bucket: AWS_S3_CREDENTIALS.bucketName,
    Body: file,
    Key: fileName,
  };
  return s3.upload(uploadOptions).promise();
};
// export const downloadFromS3 = async (fileName: string) => {

// };
