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
exports.UpdateBookInput = void 0;
const type_graphql_1 = require("type-graphql");
let UpdateBookInput = class UpdateBookInput {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: false }),
    __metadata("design:type", String)
], UpdateBookInput.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateBookInput.prototype, "body", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateBookInput.prototype, "header", void 0);
__decorate([
    type_graphql_1.Field(() => Number, { nullable: true }),
    __metadata("design:type", Number)
], UpdateBookInput.prototype, "status", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateBookInput.prototype, "subtitle", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateBookInput.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UpdateBookInput.prototype, "warning_message", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], UpdateBookInput.prototype, "genres", void 0);
UpdateBookInput = __decorate([
    type_graphql_1.InputType()
], UpdateBookInput);
exports.UpdateBookInput = UpdateBookInput;
//# sourceMappingURL=input.js.map