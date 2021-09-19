import { Field, ObjectType } from "type-graphql";
import { Character } from "../../../entity/Character";

@ObjectType()
export class CharactersResponse {
  @Field(() => Number, { nullable: true })
  total?: number;
  @Field(() => [Character], { nullable: true })
  characters?: Character[];
}
