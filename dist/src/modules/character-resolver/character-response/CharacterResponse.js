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
exports.CharacterResponse = void 0;
const type_graphql_1 = require("type-graphql");
const Character_1 = require("../../../entity/Character");
const FieldError_1 = require("../../../util/FieldError");
let CharacterResponse = class CharacterResponse {
};
__decorate([
    type_graphql_1.Field(() => Character_1.Character, { nullable: true }),
    __metadata("design:type", Character_1.Character)
], CharacterResponse.prototype, "character", void 0);
__decorate([
    type_graphql_1.Field(() => [FieldError_1.FieldError], { nullable: true }),
    __metadata("design:type", Array)
], CharacterResponse.prototype, "errors", void 0);
CharacterResponse = __decorate([
    type_graphql_1.ObjectType()
], CharacterResponse);
exports.CharacterResponse = CharacterResponse;
//# sourceMappingURL=CharacterResponse.js.map