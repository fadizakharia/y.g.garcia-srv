import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Role } from "./Role";
@ObjectType()
@Entity()
export class User {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ type: "text" })
  username: string;

  @Field(() => String)
  @Column({ type: "text" })
  password_hash: string;

  @Field(() => String)
  @Column({ type: "text" })
  first_name: string;

  @Field(() => String)
  @Column({ type: "text" })
  middle_name: string;

  @Field(() => String)
  @Column({ type: "text" })
  last_name: string;

  @Field(() => String)
  @Column({ type: "text" })
  country: string;

  @Field(() => String)
  @Column({ type: "text" })
  address_line_1: string;

  @Field(() => String)
  @Column({ type: "text" })
  address_line_2: string;

  @Field(() => String)
  @Column({ type: "text", nullable: true })
  state: string;

  @Field(() => [Role])
  @ManyToMany(() => Role)
  @JoinTable()
  role: Role[];
}
