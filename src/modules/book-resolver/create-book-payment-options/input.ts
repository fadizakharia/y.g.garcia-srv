import { GraphQLUpload } from "graphql-upload";
import { Field, InputType } from "type-graphql";
import { file } from "../../../types/file";

@InputType()
export class PaymentOptionCreateType {
  @Field(() => String)
  url: string;

  @Field(() => GraphQLUpload)
  image: file;
}
