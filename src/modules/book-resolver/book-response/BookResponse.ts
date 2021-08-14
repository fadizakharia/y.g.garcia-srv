import { Field, ObjectType } from "type-graphql";
import { Book } from "../../../entity/Book";
import { FieldError } from "../../../util/FieldError";

@ObjectType()
export class BookResponse {
  @Field(() => Book, { nullable: true })
  Book?: Book;
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}
