import { Field, ObjectType } from "type-graphql";
import { Character } from "../../../entity/Character";
import { FieldError } from "../../../util/FieldError";

@ObjectType()
export class CharactersCategoryResponse {
  @Field(() => [Character], { nullable: true })
  characters?: Character[];
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}
