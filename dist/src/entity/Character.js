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
exports.Character = void 0;
const typeorm_1 = require("typeorm");
const type_graphql_1 = require("type-graphql");
const Category_1 = require("./Category");
const CharacterImages_1 = require("./CharacterImages");
let Character = class Character {
};
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Character.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({ type: "text" }),
    __metadata("design:type", String)
], Character.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({ type: "text" }),
    __metadata("design:type", String)
], Character.prototype, "gender", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({ type: "text" }),
    __metadata("design:type", String)
], Character.prototype, "color", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({ type: "text" }),
    __metadata("design:type", String)
], Character.prototype, "ethnicity", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({ type: "text" }),
    __metadata("design:type", String)
], Character.prototype, "bio", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    typeorm_1.Column({ type: "date" }),
    __metadata("design:type", String)
], Character.prototype, "date_of_birth", void 0);
__decorate([
    type_graphql_1.Field(() => [CharacterImages_1.CharacterImages], { nullable: true }),
    typeorm_1.OneToMany(() => CharacterImages_1.CharacterImages, (charImage) => charImage.charId, {
        cascade: true,
        nullable: true,
    }),
    __metadata("design:type", Array)
], Character.prototype, "images", void 0);
__decorate([
    type_graphql_1.Field(() => Category_1.Category, { nullable: true }),
    typeorm_1.ManyToOne(() => Category_1.Category, (cat) => cat.characters, {
        cascade: true,
        nullable: true,
    }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Category_1.Category)
], Character.prototype, "category", void 0);
Character = __decorate([
    type_graphql_1.ObjectType(),
    typeorm_1.Entity()
], Character);
exports.Character = Character;
//# sourceMappingURL=Character.js.map