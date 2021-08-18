import { Field, InputType } from "type-graphql";

@InputType()
export class CreateBookInput {
  @Field(() => String)
  body: string;
  @Field(() => String)
  header: string;
  @Field(() => Number)
  status: number;
  @Field(() => String)
  subtitle: string;
  @Field(() => String)
  title: string;
  @Field(() => String)
  warning_message: string;
}
