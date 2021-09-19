import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Category } from "./Category";
import { CharacterImages } from "./CharacterImages";
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
  gender: string;

  @Field(() => String)
  @Column({ type: "text" })
  color: string;

  @Field(() => String)
  @Column({ type: "text" })
  ethnicity: string;

  @Field(() => String)
  @Column({ type: "text" })
  bio: string;

  @Field(() => String)
  @Column({ type: "date" })
  date_of_birth: string;

  @Field(() => [CharacterImages], { nullable: true })
  @OneToMany(() => CharacterImages, (charImage) => charImage.charId, {
    cascade: true,
    nullable: true,
  })
  images: CharacterImages[];

  @Field(() => Category, { nullable: true })
  @ManyToOne(() => Category, (cat) => cat.characters, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  category: Category;
}
