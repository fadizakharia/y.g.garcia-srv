import { Field, InputType } from "type-graphql";

@InputType()
export class AddCharacterInput {
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

  @Field(() => Date)
  date_of_birth: Date;
}
