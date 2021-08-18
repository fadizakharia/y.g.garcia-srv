import { graphql } from "graphql";
import { buildSchema } from "type-graphql";
import { BookImage } from "../modules/book-image-resolver/BookImage.resolver";
import { BookResolver } from "../modules/book-resolver/Book.resolver";
import { CharacterResolver } from "../modules/character-resolver/character.resolver";

export const gqlRequest = async (source: string, variables?: any) => {
  return graphql({
    schema: await buildSchema({
      resolvers: [BookResolver, CharacterResolver, BookImage],
      authChecker: () => true,
    }),
    source,
    variableValues: variables,
  });
};
