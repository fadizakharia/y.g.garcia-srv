import { buildSchema } from "type-graphql";
import { BookImage } from "../modules/book-image-resolver/BookImage.resolver";

import { BookResolver } from "../modules/book-resolver/Book.resolver";
import { CharacterCategoriesResolver } from "../modules/character-category-resolver/CharacterCategories.resolver";
import { CharacterImageResolver } from "../modules/character-image-resolver/characterImage.resolver";
import { CharacterResolver } from "../modules/character-resolver/character.resolver";
import { EmployeeResolver } from "../modules/employee-resolver/employee.resolver";

import { customAuthChecker } from "./authchecker";

export const createSchema = async () => {
  return await buildSchema({
    resolvers: [
      BookImage,
      BookResolver,
      CharacterResolver,
      EmployeeResolver,
      CharacterCategoriesResolver,
      CharacterImageResolver,
    ],
    authChecker: customAuthChecker,
  });
};
