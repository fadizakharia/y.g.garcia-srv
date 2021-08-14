import { Connection } from "typeorm";
import faker from "faker";
import { gqlRequest } from "../../test-utils/graphqlCall";
import { createBook } from "../../test-utils/shared";
import { testCon } from "../../test-utils/testCon";

const createBookMutation = `
mutation addBook($createBookAddBookInput: CreateBookInput!){
  createBook(addBookInput: $createBookAddBookInput){
    Book{
      id
      header
      body
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
`; // add errors when yup is added ... and check for validation errors...

const deleteBookMutation = `
mutation deleteBook($bookId: String!){
  deleteBook(bookId: $bookId)
}
`;
let conn: Connection;

beforeAll(async () => {
  conn = await testCon(true);
});

describe("test suit for adding books", () => {
  it("should add a book", async () => {
    const res = await gqlRequest(createBookMutation, {
      createBookAddBookInput: {
        body: "the greatest book of all tests",
        header: "booktest",
        status: 0,
        title: "The fibo",
        subtitle: "great book must read",
        warning_message: "parental advisory required",
      },
    });

    expect(res.data.createBook.Book.body).toBe(
      "the greatest book of all tests"
    );
  });
  it("should fail to add a book due to input validation", async () => {
    const res = await gqlRequest(createBookMutation, {
      createBookAddBookInput: {
        body: "test",
        header: "test",
        status: 3,
        title: "test",
        subtitle: "grey",
        warning_message: "warn",
      },
    });
    expect(res.data.createBook.errors.length).toBe(6);
  });
});
describe("test suit for updating books", () => {
  it("should update a book", async () => {
    const originalBook = await createBook(conn);
    const res = await gqlRequest(updateBookMutation, {
      updateBookInput: {
        id: originalBook.id,
        body: faker.lorem.paragraph(),
        header: faker.lorem.paragraph(),
        warning_message: faker.lorem.lines(1),
      },
    });
    console.log(res.data.updateBook.Book);

    expect(res.data.updateBook.Book).not.toMatchObject(originalBook);
  });
  it("should fail to add a book due to input validation", async () => {
    const originalBook = await createBook(conn);
    const res = await gqlRequest(updateBookMutation, {
      updateBookInput: {
        id: originalBook.id,
        body: faker.lorem.word(3),
        header: faker.lorem.word(3),
        warning_message: faker.lorem.word(3),
      },
    });
    expect(res.data.updateBook.errors.length).toBe(3);
  });
});
describe("test suit for deleting books", () => {
  it("should delete a book", async () => {
    const savedTestBook = await createBook(conn);
    const deletedBookStatus = await gqlRequest(deleteBookMutation, {
      bookId: savedTestBook.id,
    });
    expect(deletedBookStatus.data.deleteBook).toBeTruthy();
  });
  it("should fail to delete a book due to invalid id", async () => {
    const deletedBookStatus = await gqlRequest(deleteBookMutation, {
      bookId: "invalid_id",
    });
    expect(deletedBookStatus.errors[0].message).toBe(
      "could not find the requested book!"
    );
  });
});
afterAll(async () => {
  await conn.close();
});
