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
exports.gqlRequest = void 0;
const graphql_1 = require("graphql");
const type_graphql_1 = require("type-graphql");
const BookImage_resolver_1 = require("../modules/book-image-resolver/BookImage.resolver");
const Book_resolver_1 = require("../modules/book-resolver/Book.resolver");
const character_resolver_1 = require("../modules/character-resolver/character.resolver");
const gqlRequest = (source, variables) => __awaiter(void 0, void 0, void 0, function* () {
    return graphql_1.graphql({
        schema: yield type_graphql_1.buildSchema({
            resolvers: [Book_resolver_1.BookResolver, character_resolver_1.CharacterResolver, BookImage_resolver_1.BookImage],
            authChecker: () => true,
        }),
        source,
        variableValues: variables,
    });
});
exports.gqlRequest = gqlRequest;
//# sourceMappingURL=graphqlCall.js.map