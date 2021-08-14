import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateBookInput {
  @Field(() => String, { nullable: false })
  id: string;
  @Field(() => String, { nullable: true })
  body?: string;
  @Field(() => String, { nullable: true })
  header?: string;
  @Field(() => Number, { nullable: true })
  status?: number;
  @Field(() => String, { nullable: true })
  subtitle?: string;
  @Field(() => String, { nullable: true })
  title?: string;
  @Field(() => String, { nullable: true })
  warning_message?: string;
}
