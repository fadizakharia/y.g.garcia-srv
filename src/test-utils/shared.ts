import { Connection } from "typeorm";
import { Book } from "../entity/Book";

export const createBook = async (conn: Connection) => {
  const testBook = conn.manager.create(Book, {
    body: "the greatest book of all tests",
    header: "booktest",
    status: 0,
    title: "The fibo",
    subtitle: "great book must read",
    warning_message: "parental advisory required",
  });
  return await conn.manager.save(testBook);
};
