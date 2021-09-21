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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSchema = void 0;
const type_graphql_1 = require("type-graphql");
const BookImage_resolver_1 = require("../modules/book-image-resolver/BookImage.resolver");
const Book_resolver_1 = require("../modules/book-resolver/Book.resolver");
const CharacterCategories_resolver_1 = require("../modules/character-category-resolver/CharacterCategories.resolver");
const characterImage_resolver_1 = require("../modules/character-image-resolver/characterImage.resolver");
const character_resolver_1 = require("../modules/character-resolver/character.resolver");
const employee_resolver_1 = require("../modules/employee-resolver/employee.resolver");
const authchecker_1 = require("./authchecker");
const createSchema = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield type_graphql_1.buildSchema({
        resolvers: [
            BookImage_resolver_1.BookImage,
            Book_resolver_1.BookResolver,
            character_resolver_1.CharacterResolver,
            employee_resolver_1.EmployeeResolver,
            CharacterCategories_resolver_1.CharacterCategoriesResolver,
            characterImage_resolver_1.CharacterImageResolver,
        ],
        authChecker: authchecker_1.customAuthChecker,
    });
});
exports.createSchema = createSchema;
//# sourceMappingURL=buildSchema.js.map