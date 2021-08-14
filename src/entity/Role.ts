import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Permission } from "./Permission";
@ObjectType()
@Entity()
export class Role {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ type: "text" })
  title: string;

  @Field(() => String)
  @Column({ type: "text" })
  description: string;

  @Field(() => [Permission])
  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: [Permission];
}
