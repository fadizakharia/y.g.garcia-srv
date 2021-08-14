import { graphql } from "graphql";
import { buildSchema } from "type-graphql";
import { BookResolver } from "../modules/book-resolver/Book.resolver";

export const gqlRequest = async (source: string, variables?: any) => {
  return graphql({
    schema: await buildSchema({
      resolvers: [BookResolver],
      authChecker: () => true,
    }),
    source,
    variableValues: variables,
  });
};
