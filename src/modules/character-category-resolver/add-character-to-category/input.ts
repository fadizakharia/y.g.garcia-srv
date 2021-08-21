import { Field, InputType } from "type-graphql";

@InputType()
export class addCharacterToCategoryInput {
  @Field(() => String)
  catId: string;
  @Field(() => String)
  charId: string;
}
