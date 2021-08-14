import { Field, ObjectType } from "type-graphql";
import { Book } from "../../../entity/Book";
import { FieldError } from "../../../util/FieldError";

@ObjectType()
export class BooksResponse {
  @Field(() => [Book], { nullable: true })
  Books?: Book[];
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}
