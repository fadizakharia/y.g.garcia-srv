import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Category } from "./Category";
@ObjectType()
@Entity()
export class Character {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;
  @Field(() => String)
  @Column({ type: "text" })
  name: string;
  @Field(() => String)
  @Column({ type: "text" })
  bio: string;
  @ManyToOne(() => Category)
  category: Category[];
}
