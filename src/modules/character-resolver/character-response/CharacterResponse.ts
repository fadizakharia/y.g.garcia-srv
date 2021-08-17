import { Field, ObjectType } from "type-graphql";
import { Character } from "../../../entity/Character";
import { FieldError } from "../../../util/FieldError";

@ObjectType()
export class CharacterResponse {
  @Field(() => Character)
  character?: Character;

  @Field(() => [FieldError])
  errors?: FieldError[];
}
