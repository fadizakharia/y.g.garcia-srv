"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.BookResolver = void 0;
const moment_1 = __importDefault(require("moment"));
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const Book_1 = require("../../entity/Book");
const PurchaseOption_1 = require("../../entity/PurchaseOption");
const imageUpload_1 = require("../../util/imageUpload");
const BookResponse_1 = require("./book-response/BookResponse");
const BooksResponse_1 = require("./books-response/BooksResponse");
const input_1 = require("./create-book-payment-options/input");
const input_2 = require("./create-book/input");
const validation_1 = require("./create-book/validation");
const input_3 = require("./update-book/input");
const validation_2 = require("./update-book/validation");
let BookResolver = class BookResolver {
    getBooks(_) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const foundBooks = yield typeorm_1.getManager().find(Book_1.Book, {
                    relations: ["purchase_options", "images"],
                });
                if (foundBooks && foundBooks.length > 0) {
                    console.log(foundBooks);
                    return { Books: foundBooks };
                }
                else {
                    return {
                        errors: [
                            {
                                field: "No books found",
                                message: "you can add books by clicking on the plus symbol on the top right of the table",
                            },
                        ],
                    };
                }
            }
            catch (err) {
                throw new Error("something went wrong!" + err);
            }
        });
    }
    getBook(id, _) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const foundBook = yield typeorm_1.getManager().findOneOrFail(Book_1.Book, { id }, { relations: ["purchase_options", "images"] });
                if (foundBook) {
                    return { Book: foundBook };
                }
                else {
                    return { errors: [{ field: "404", message: "no books found!" }] };
                }
            }
            catch (err) {
                return { errors: [{ field: "500", message: "something went wrong!" }] };
            }
        });
    }
    createBook(bookInput, _) {
        return __awaiter(this, void 0, void 0, function* () {
            let newPaymentOptions = [];
            try {
                const error = [];
                yield validation_1.createBookValidator
                    .validate(Object.assign({}, bookInput), { abortEarly: false })
                    .catch(function (err) {
                    err.inner.forEach((e) => {
                        error.push({ field: e.path, message: e.message });
                    });
                });
                if (error.length > 0) {
                    return { errors: error };
                }
                const createdBook = typeorm_1.getManager().create(Book_1.Book, Object.assign(Object.assign({}, bookInput), { genres: bookInput.genres.join(", ") }));
                const savedBook = yield typeorm_1.getManager().save(createdBook);
                if (savedBook) {
                    if (newPaymentOptions && newPaymentOptions.length > 0) {
                        return {
                            Book: Object.assign(Object.assign({}, savedBook), { purchase_options: newPaymentOptions }),
                        };
                    }
                    return { Book: Object.assign({}, savedBook) };
                }
                else {
                    throw new Error("something went wrong!");
                }
            }
            catch (err) {
                throw new Error("something went wrong!" + err);
            }
        });
    }
    updateBook(bookInput, _) {
        return __awaiter(this, void 0, void 0, function* () {
            const error = [];
            yield validation_2.updateBookValidator
                .validate(Object.assign({}, bookInput), { abortEarly: false })
                .catch(function (err) {
                err.inner.forEach((e) => {
                    error.push({ field: e.path, message: e.message });
                });
            });
            if (error.length > 0) {
                return { errors: error };
            }
            try {
                const foundBook = yield typeorm_1.getManager().findOne(Book_1.Book, bookInput.id);
                if (bookInput.genres.length > 0) {
                    Object.assign(foundBook, Object.assign(Object.assign({}, bookInput), { genres: bookInput.genres.join(", ") }));
                }
                else {
                    Object.assign(foundBook, bookInput);
                }
                const updatedBook = yield typeorm_1.getManager().save(foundBook);
                return { Book: updatedBook };
            }
            catch (err) {
                throw new Error("something went wrong!");
            }
        });
    }
    deleteBook(id, _) {
        return __awaiter(this, void 0, void 0, function* () {
            let bookManager;
            console.log(id);
            try {
                bookManager = typeorm_1.getManager();
            }
            catch (err) {
                throw new Error("Something went wrong!");
            }
            try {
                const foundBook = yield bookManager.findOne(Book_1.Book, id);
                yield bookManager.remove(foundBook);
                return true;
            }
            catch (err) {
                throw new Error("could not find the requested book!" + err);
            }
        });
    }
    addBookPaymentOption(bookId, paymentOption) {
        return __awaiter(this, void 0, void 0, function* () {
            let uniqueName;
            const { createReadStream, filename } = yield paymentOption.image;
            let readStream = createReadStream();
            let fileNameArr = filename.split(".");
            let fileNamePre = fileNameArr[0];
            let fileNamePost = fileNameArr[1];
            uniqueName =
                (fileNamePre + moment_1.default.now()).toLowerCase() + "." + fileNamePost;
            try {
                let uploadMetaData = yield imageUpload_1.uploadToS3(readStream, uniqueName);
                const manager = typeorm_1.getManager();
                const foundBook = yield manager.findOne(Book_1.Book, bookId);
                console.log(uploadMetaData);
                if (foundBook && uploadMetaData) {
                    const createdPurchaseOption = manager.create(PurchaseOption_1.PurchaseOption, {
                        Book: foundBook,
                        iconUrl: uploadMetaData.Location,
                        title: uploadMetaData.Key,
                        key: uploadMetaData.Key,
                        url: paymentOption.url,
                    });
                    yield manager.save(createdPurchaseOption);
                }
                return true;
            }
            catch (err) {
                throw new Error("could not upload image." + err);
            }
        });
    }
    deletePaymentOption(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const manager = typeorm_1.getManager();
                const foundPaymentOption = yield manager.findOne(PurchaseOption_1.PurchaseOption, id);
                if (foundPaymentOption) {
                    const Key = foundPaymentOption.key;
                    const Bucket = process.env.AWS_S3_BUCKET_NAME;
                    yield imageUpload_1.deleteFromS3({ Key, Bucket });
                    yield manager.remove(PurchaseOption_1.PurchaseOption, foundPaymentOption);
                }
                else {
                    throw new Error("could not find payment option!");
                }
                return true;
            }
            catch (err) {
                throw new Error("something went wrong!");
            }
        });
    }
};
__decorate([
    type_graphql_1.Query(() => BooksResponse_1.BooksResponse),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookResolver.prototype, "getBooks", null);
__decorate([
    type_graphql_1.Query(() => BookResponse_1.BookResponse),
    __param(0, type_graphql_1.Arg("bookId")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookResolver.prototype, "getBook", null);
__decorate([
    type_graphql_1.Mutation(() => BookResponse_1.BookResponse),
    type_graphql_1.Authorized(["add:books"]),
    __param(0, type_graphql_1.Arg("addBookInput")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [input_2.CreateBookInput, Object]),
    __metadata("design:returntype", Promise)
], BookResolver.prototype, "createBook", null);
__decorate([
    type_graphql_1.Authorized(["update:books"]),
    type_graphql_1.Mutation(() => BookResponse_1.BookResponse),
    __param(0, type_graphql_1.Arg("updateBookInput")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [input_3.UpdateBookInput, Object]),
    __metadata("design:returntype", Promise)
], BookResolver.prototype, "updateBook", null);
__decorate([
    type_graphql_1.Authorized(["delete:books"]),
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("bookId")),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookResolver.prototype, "deleteBook", null);
__decorate([
    type_graphql_1.Authorized(["add:books"]),
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("bookId")),
    __param(1, type_graphql_1.Arg("paymentOption", () => input_1.PaymentOptionCreateType)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, input_1.PaymentOptionCreateType]),
    __metadata("design:returntype", Promise)
], BookResolver.prototype, "addBookPaymentOption", null);
__decorate([
    type_graphql_1.Authorized(["delete:books"]),
    type_graphql_1.Mutation(() => Boolean),
    __param(0, type_graphql_1.Arg("paymentId", () => String)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookResolver.prototype, "deletePaymentOption", null);
BookResolver = __decorate([
    type_graphql_1.Resolver()
], BookResolver);
exports.BookResolver = BookResolver;
//# sourceMappingURL=Book.resolver.js.map