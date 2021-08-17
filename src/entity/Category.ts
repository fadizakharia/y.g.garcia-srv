import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Character } from "./Character";
@ObjectType()
@Entity()
export class Category {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ type: "text" })
  title: string;

  @Field(() => [Character])
  @OneToMany(() => Character, (ch) => ch.category)
  characters: Character[];
}
