import { buildSchema } from "type-graphql";
import { BookImage } from "../modules/book-image-resolver/BookImage.resolver";

import { BookResolver } from "../modules/book-resolver/Book.resolver";
import { CharacterResolver } from "../modules/character-resolver/character.resolver";

import { customAuthChecker } from "./authchecker";

export const createSchema = async () => {
  return await buildSchema({
    resolvers: [BookImage, BookResolver, CharacterResolver],
    authChecker: customAuthChecker,
  });
};
