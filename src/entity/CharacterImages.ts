import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Book } from "./Book";
import { Character } from "./Character";
@ObjectType()
@Entity("character_images")
export class CharacterImages {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: String;

  @Field(() => Character)
  @ManyToOne(() => Character, (char) => char.images, {
    cascade: ["insert", "update"],
  })
  @JoinColumn({ name: "character_id" })
  charId: Book;

  @Field(() => String)
  @Column("text")
  imageUrl: string;

  @Field(() => String)
  @Column("text")
  key: string;

  @Field(() => String)
  @Column("text")
  localImageUrl: string;
}
