import { buildSchema } from "type-graphql";

import { BookResolver } from "../modules/book-resolver/Book.resolver";

import { customAuthChecker } from "./authchecker";
console.log(__dirname + "/../modules/*/*.resolvers.ts");

export const createSchema = async () => {
  return await buildSchema({
    resolvers: [BookResolver],
    authChecker: customAuthChecker,
  });
};
