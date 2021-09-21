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
exports.AddCharacterInput = void 0;
const type_graphql_1 = require("type-graphql");
let AddCharacterInput = class AddCharacterInput {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], AddCharacterInput.prototype, "category", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], AddCharacterInput.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], AddCharacterInput.prototype, "gender", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], AddCharacterInput.prototype, "color", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], AddCharacterInput.prototype, "ethnicity", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], AddCharacterInput.prototype, "bio", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], AddCharacterInput.prototype, "date_of_birth", void 0);
AddCharacterInput = __decorate([
    type_graphql_1.InputType()
], AddCharacterInput);
exports.AddCharacterInput = AddCharacterInput;
//# sourceMappingURL=input.js.map