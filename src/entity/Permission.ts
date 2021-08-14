import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
@ObjectType()
@Entity()
export class Permission {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ type: "text" })
  title: string;

  @Field(() => String)
  @Column({ type: "text" })
  description: string;

  @Field(() => String)
  @Column({ type: "boolean" })
  active: boolean;
}
