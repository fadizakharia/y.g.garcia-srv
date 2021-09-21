"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.BookImage = void 0;
const imageUpload_1 = require("../../util/imageUpload");
const fs_1 = require("fs");
const type_graphql_1 = require("type-graphql");
const graphql_upload_1 = require("graphql-upload");
const typeorm_1 = require("typeorm");
const BookImages_1 = require("../../entity/BookImages");
const Book_1 = require("../../entity/Book");
const yup = __importStar(require("yup"));
const moment_1 = __importDefault(require("moment"));
let BookImage = class BookImage {
    getImage(imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            const idValidity = yield yup.string().uuid().isValid(imageId);
            if (!idValidity) {
                return {
                    errors: [{ field: "imageId", message: "imageId is incorrect" }],
                };
            }
            const manager = typeorm_1.getManager();
            const image = yield manager.findOne(BookImages_1.BookImages, imageId);
            console.log(image);
            return { images: image };
        });
    }
    addBookImage({ filename, createReadStream }, bookId) {
        return __awaiter(this, void 0, void 0, function* () {
            let fileNameArr = filename.split(".");
            let fileNamePre = fileNameArr[0];
            let fileNamePost = fileNameArr[1];
            let uniqueName = (fileNamePre + moment_1.default.now()).toLowerCase() + "." + fileNamePost;
            const localImageUrl = __dirname + `/../../images/${uniqueName}`;
            const internalFileSaveStatus = yield new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                createReadStream()
                    .pipe(fs_1.createWriteStream(localImageUrl))
                    .on("finish", () => {
                    resolve(true);
                })
                    .on("error", (err) => reject(err));
            }));
            console.log(internalFileSaveStatus);
            if (internalFileSaveStatus) {
                const readStream = createReadStream();
                let uploadMetaData;
                try {
                    uploadMetaData = yield imageUpload_1.uploadToS3(readStream, uniqueName);
                    const manager = typeorm_1.getManager();
                    const foundBook = yield manager.findOne(Book_1.Book, bookId);
                    console.log(uploadMetaData);
                    const createdBookImage = manager.create(BookImages_1.BookImages, {
                        bookId: foundBook,
                        imageUrl: uploadMetaData.Location,
                        key: uploadMetaData.Key,
                        localImageUrl,
                    });
                    yield manager.save(createdBookImage);
                    return true;
                }
                catch (err) {
                    throw new Error("could not upload image." + err);
                }
            }
            else {
                throw new Error("could not upload image.");
            }
        });
    }
    deleteBookImage(imageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const manager = typeorm_1.getManager();
                const foundImage = yield manager.findOne(BookImages_1.BookImages, imageId);
                if (foundImage) {
                    const Key = foundImage.key;
                    const Bucket = process.env.AWS_S3_BUCKET_NAME;
                    yield imageUpload_1.deleteFromS3({ Key, Bucket });
                    yield manager.remove(foundImage);
                    return true;
                }
                throw new Error("could not find image");
            }
            catch (err) {
                throw new Error(err);
            }
        });
    }
};
__decorate([
    type_graphql_1.Query(() => String),
    __param(0, type_graphql_1.Arg("imageId", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookImage.prototype, "getImage", null);
__decorate([
    type_graphql_1.Authorized(["add:books"]),
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("image", () => graphql_upload_1.GraphQLUpload)),
    __param(1, type_graphql_1.Arg("bookId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookImage.prototype, "addBookImage", null);
__decorate([
    type_graphql_1.Authorized(["delete:books"]),
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("imageId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookImage.prototype, "deleteBookImage", null);
BookImage = __decorate([
    type_graphql_1.Resolver()
], BookImage);
exports.BookImage = BookImage;
//# sourceMappingURL=BookImage.resolver.js.map