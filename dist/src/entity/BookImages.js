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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookImages = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const Book_1 = require("./Book");
let BookImages = class BookImages {
};
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], BookImages.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => Book_1.Book),
    typeorm_1.ManyToOne(() => Book_1.Book, (book) => book.images),
    typeorm_1.JoinColumn({ name: "book_id" }),
    __metadata("design:type", Book_1.Book)
], BookImages.prototype, "bookId", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], BookImages.prototype, "imageUrl", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], BookImages.prototype, "key", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], BookImages.prototype, "localImageUrl", void 0);
BookImages = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity("book_images")
], BookImages);
exports.BookImages = BookImages;
//# sourceMappingURL=BookImages.js.map