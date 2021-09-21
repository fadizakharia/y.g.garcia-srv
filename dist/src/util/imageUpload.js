"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromS3 = exports.uploadMultipleToS3 = exports.uploadToS3 = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const moment_1 = __importDefault(require("moment"));
const uploadToS3 = (file, fileName) => __awaiter(void 0, void 0, void 0, function* () {
    const AWS_S3_CREDENTIALS = {
        accessKey: process.env.AWS_ACCESS_KEY,
        secret: process.env.AWS_SECRET_KEY,
        bucketName: process.env.AWS_S3_BUCKET_NAME,
        region: process.env.AWS_BUCKET_REGION,
    };
    aws_sdk_1.default.config.update({
        region: AWS_S3_CREDENTIALS.region,
    });
    const s3 = new aws_sdk_1.default.S3({
        region: AWS_S3_CREDENTIALS.region,
        accessKeyId: AWS_S3_CREDENTIALS.accessKey,
        secretAccessKey: AWS_S3_CREDENTIALS.secret,
    });
    return s3
        .upload({
        Bucket: AWS_S3_CREDENTIALS.bucketName,
        Body: file,
        Key: fileName,
        ACL: "public-read",
    })
        .promise();
});
exports.uploadToS3 = uploadToS3;
const uploadMultipleToS3 = (fileArr) => {
    const AWS_S3_CREDENTIALS = {
        accessKey: process.env.AWS_ACCESS_KEY,
        secret: process.env.AWS_SECRET_KEY,
        bucketName: process.env.AWS_S3_BUCKET_NAME,
        region: process.env.AWS_BUCKET_REGION,
    };
    aws_sdk_1.default.config.update({
        region: AWS_S3_CREDENTIALS.region,
    });
    const s3 = new aws_sdk_1.default.S3({
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
            uniqueFileName = pre + moment_1.default.now() + "." + post;
        }
        else {
            uniqueFileName = uniqueFileName + moment_1.default.now();
        }
        let params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: uniqueFileName,
            Body: readStream,
            ACL: "public-read",
        };
        if (Object.assign({}, item.metaData)) {
            return { upload: s3.upload(params).promise(), metaData: item.metaData };
        }
        return s3.upload(params).promise();
    });
    return fileUploads;
};
exports.uploadMultipleToS3 = uploadMultipleToS3;
const deleteFromS3 = (objectInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const AWS_S3_CREDENTIALS = {
        accessKey: process.env.AWS_ACCESS_KEY,
        secret: process.env.AWS_SECRET_KEY,
        bucketName: process.env.AWS_S3_BUCKET_NAME,
        region: process.env.AWS_BUCKET_REGION,
    };
    aws_sdk_1.default.config.update({
        region: AWS_S3_CREDENTIALS.region,
    });
    const s3 = new aws_sdk_1.default.S3({
        region: AWS_S3_CREDENTIALS.region,
        accessKeyId: AWS_S3_CREDENTIALS.accessKey,
        secretAccessKey: AWS_S3_CREDENTIALS.secret,
    });
    return s3.deleteObject(objectInfo).promise();
});
exports.deleteFromS3 = deleteFromS3;
//# sourceMappingURL=imageUpload.js.map