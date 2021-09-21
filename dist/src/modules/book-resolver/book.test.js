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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const faker_1 = __importDefault(require("faker"));
const graphqlCall_1 = require("../../test-utils/graphqlCall");
const shared_1 = require("../../test-utils/shared");
const createBookMutation = `
mutation addBook($createBookAddBookInput: CreateBookInput!){
  createBook(addBookInput: $createBookAddBookInput){
    Book{
      id
      body
      header
      status
      subtitle
      title
      warning_message
      genres
    }
    errors{
      field
      message
    }

  }
}
`;
const updateBookMutation = `
mutation updateBook($updateBookInput: UpdateBookInput!){
  updateBook(updateBookInput: $updateBookInput) {
    Book {
      body
      header
      status
      subtitle
      title
      warning_message
    }
    errors{
      field
      message
    }
  }
}
`;
const deleteBookMutation = `
mutation deleteBook($bookId: String!){
  deleteBook(bookId: $bookId)
}
`;
let conn;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    conn = typeorm_1.getConnection("test");
}));
describe("test suit for adding books", () => {
    it("should add a book", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield graphqlCall_1.gqlRequest(createBookMutation, {
            createBookAddBookInput: {
                body: "the greatest book of all tests",
                header: "booktest",
                status: 0,
                title: "The fibo",
                subtitle: "great book must read",
                warning_message: "parental advisory required",
                genres: ["one", "two", "three"],
            },
        });
        console.log(res.data);
        expect(res.data.createBook.Book.body).toBe("the greatest book of all tests");
    }));
    it("should fail to add a book due to input validation", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield graphqlCall_1.gqlRequest(createBookMutation, {
            createBookAddBookInput: {
                body: "test",
                header: "test",
                status: 3,
                title: "test",
                subtitle: "grey",
                warning_message: "warn",
                genres: ["one", "two", "three"],
            },
        });
        expect(res.data.createBook.errors.length).toBe(6);
    }));
});
describe("test suit for updating books", () => {
    it("should update a book", () => __awaiter(void 0, void 0, void 0, function* () {
        const originalBook = yield shared_1.createBook(conn);
        const res = yield graphqlCall_1.gqlRequest(updateBookMutation, {
            updateBookInput: {
                id: originalBook.id,
                body: faker_1.default.lorem.paragraph(2),
                header: faker_1.default.lorem.paragraph(2),
                warning_message: faker_1.default.lorem.words(5),
                genres: ["one", "two", "three"],
            },
        });
        expect(res.data.updateBook.Book).not.toMatchObject(originalBook);
    }));
    it("should fail to add a book due to input validation", () => __awaiter(void 0, void 0, void 0, function* () {
        const originalBook = yield shared_1.createBook(conn);
        const res = yield graphqlCall_1.gqlRequest(updateBookMutation, {
            updateBookInput: {
                id: originalBook.id,
                body: faker_1.default.lorem.word(3),
                header: faker_1.default.lorem.word(3),
                warning_message: faker_1.default.lorem.word(3),
                genres: ["one", "two", "three"],
            },
        });
        expect(res.data.updateBook.errors.length).toBe(3);
    }));
});
describe("test suit for deleting books", () => {
    it("should delete a book", () => __awaiter(void 0, void 0, void 0, function* () {
        const savedTestBook = yield shared_1.createBook(conn);
        const deletedBookStatus = yield graphqlCall_1.gqlRequest(deleteBookMutation, {
            bookId: savedTestBook.id,
        });
        expect(deletedBookStatus.data.deleteBook).toBeTruthy();
    }));
    it("should fail to delete a book due to invalid id", () => __awaiter(void 0, void 0, void 0, function* () {
        const deletedBookStatus = yield graphqlCall_1.gqlRequest(deleteBookMutation, {
            bookId: "invalid_id",
        });
        expect(deletedBookStatus.errors[0].message).toBe('could not find the requested book!QueryFailedError: invalid input syntax for type uuid: "invalid_id"');
    }));
});
//# sourceMappingURL=book.test.js.map