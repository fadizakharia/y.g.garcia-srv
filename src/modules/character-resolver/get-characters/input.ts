import { Field, InputType } from "type-graphql";

@InputType()
export class getCharactersInput {
  @Field(() => String, { nullable: true })
  sorting?: string;
  @Field(() => String, { nullable: true })
  category?: string;
}
