import { Field, InputType } from "type-graphql";

@InputType()
export class AddCharacterInput {
  @Field(() => String, { nullable: true })
  category?: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  gender: string;

  @Field(() => String)
  color: string;

  @Field(() => String)
  ethnicity: string;

  @Field(() => String)
  bio: string;

  @Field(() => String)
  date_of_birth: string;
}
