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
exports.createCharacter = exports.createBook = void 0;
const Book_1 = require("../entity/Book");
const Character_1 = require("../entity/Character");
const createBook = (conn) => __awaiter(void 0, void 0, void 0, function* () {
    const testBook = conn.manager.create(Book_1.Book, {
        body: "the greatest book of all tests",
        header: "booktest",
        status: 0,
        title: "The fibo",
        subtitle: "great book must read",
        warning_message: "parental advisory required",
        genres: "one, two, three",
    });
    return yield conn.manager.save(testBook);
});
exports.createBook = createBook;
const createCharacter = (conn) => __awaiter(void 0, void 0, void 0, function* () {
    const testBook = conn.manager.create(Character_1.Character, {
        name: "commander zakharia",
        bio: "a really awesome magnificent powerful and scary leader, some may say everyone is a potato but him.",
        date_of_birth: "1997-12-29",
        ethnicity: "caucasian",
        gender: "male",
        color: "golden",
    });
    return yield conn.manager.save(testBook);
});
exports.createCharacter = createCharacter;
//# sourceMappingURL=shared.js.map