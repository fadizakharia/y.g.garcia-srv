import { Field, ObjectType } from "type-graphql";
import { FieldError } from "../../../util/FieldError";

@ObjectType()
export class EmployeeResponse {
  @Field(() => [String], { nullable: true })
  permissions?: string[];
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}
