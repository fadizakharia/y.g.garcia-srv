import { Field, ObjectType } from "type-graphql";
import { BookImages } from "../../../entity/BookImages";
import { FieldError } from "../../../util/FieldError";

@ObjectType()
export class bookImageResponse {
  @Field(() => [Image], { nullable: true })
  images?: BookImages;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}
