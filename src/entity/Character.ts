import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
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

  @Field(() => Date)
  @Column({ type: "date" })
  date_of_birth: Date;

  @ManyToOne(() => Category, (cat) => cat.characters, {
    cascade: ["insert", "update"],
  })
  @JoinColumn()
  category: Category;
}
