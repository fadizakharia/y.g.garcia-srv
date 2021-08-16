import { buildSchema } from "type-graphql";
import { BookImage } from "../modules/book-image-resolver/BookImage.resolver";

import { BookResolver } from "../modules/book-resolver/Book.resolver";

import { customAuthChecker } from "./authchecker";
console.log(__dirname + "/../modules/*/*.resolvers.ts");

export const createSchema = async () => {
  return await buildSchema({
    resolvers: [BookResolver, BookImage],
    authChecker: customAuthChecker,
  });
};
