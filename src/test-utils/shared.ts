import { Connection } from "typeorm";
import { Book } from "../entity/Book";
import { Character } from "../entity/Character";

export const createBook = async (conn: Connection) => {
  const testBook = conn.manager.create(Book, {
    body: "the greatest book of all tests",
    header: "booktest",
    status: 0,
    title: "The fibo",
    subtitle: "great book must read",
    warning_message: "parental advisory required",
    genres: "one, two, three",
  });
  return await conn.manager.save(testBook);
};
export const createCharacter = async (conn: Connection) => {
  const testBook = conn.manager.create(Character, {
    name: "commander zakharia",
    bio: "a really awesome magnificent powerful and scary leader, some may say everyone is a potato but him.",
    date_of_birth: "1997-12-29",
    ethnicity: "caucasian",
    gender: "male",
    color: "golden",
  });
  return await conn.manager.save(testBook);
};
