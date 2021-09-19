import AWS from "aws-sdk";
import moment from "moment";
import { Stream } from "stream";
import { file } from "../types/file";
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
      ACL: "public-read",
    })
    .promise();
};
export const uploadMultipleToS3 = (
  fileArr: { stream: file; metaData?: any }[]
) => {
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

  const fileUploads = fileArr.map((item) => {
    let uniqueFileName = item.stream.filename;
    let readStream = item.stream.createReadStream();
    if (item.stream.filename.includes(".")) {
      let prePostArr = item.stream.filename.split(".");
      let pre = prePostArr[0];
      let post = prePostArr[1];
      uniqueFileName = pre + moment.now() + "." + post;
    } else {
      uniqueFileName = uniqueFileName + moment.now();
    }
    let params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: uniqueFileName,
      Body: readStream,
      ACL: "public-read",
    };
    if ({ ...item.metaData }) {
      return { upload: s3.upload(params).promise(), metaData: item.metaData };
    }
    return s3.upload(params).promise();
  });
  return fileUploads;
};
// export const downloadFromS3 = async (fileName: string) => {

// };
export const deleteFromS3 = async (objectInfo: {
  Key: string;
  Bucket: string;
}) => {
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
  return s3.deleteObject(objectInfo).promise();
};
