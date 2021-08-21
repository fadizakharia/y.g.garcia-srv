import { Field, ObjectType } from "type-graphql";
import { CharacterImages } from "../../../entity/CharacterImages";
import { FieldError } from "../../../util/FieldError";

@ObjectType()
export class CharacterImageResponse {
  @Field(() => [CharacterImages], { nullable: true })
  images?: CharacterImages[];
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}
