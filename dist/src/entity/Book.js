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
exports.Book = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const BookImages_1 = require("./BookImages");
const PurchaseOption_1 = require("./PurchaseOption");
let Book = class Book {
};
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Book.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({ type: "text", nullable: false }),
    __metadata("design:type", String)
], Book.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(() => Number),
    typeorm_1.Column({ type: "integer", nullable: false }),
    __metadata("design:type", Number)
], Book.prototype, "status", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({ type: "text" }),
    __metadata("design:type", String)
], Book.prototype, "subtitle", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({ type: "text" }),
    __metadata("design:type", String)
], Book.prototype, "header", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({ type: "text" }),
    __metadata("design:type", String)
], Book.prototype, "body", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({ type: "text" }),
    __metadata("design:type", String)
], Book.prototype, "warning_message", void 0);
__decorate([
    type_graphql_1.Field(() => [BookImages_1.BookImages]),
    typeorm_1.OneToMany(() => BookImages_1.BookImages, (imgs) => imgs.bookId, {
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], Book.prototype, "images", void 0);
__decorate([
    type_graphql_1.Field(() => [PurchaseOption_1.PurchaseOption]),
    typeorm_1.OneToMany(() => PurchaseOption_1.PurchaseOption, (opts) => opts.Book, {
        cascade: ["remove", "update", "insert"],
    }),
    __metadata("design:type", Array)
], Book.prototype, "purchase_options", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    typeorm_1.Column({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Book.prototype, "genres", void 0);
Book = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], Book);
exports.Book = Book;
//# sourceMappingURL=Book.js.map