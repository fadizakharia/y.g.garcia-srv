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

  @Field(() => Date)
  @Column({ type: "date" })
  date_of_birth: Date;
  @Field(() => [CharacterImages])
  @OneToMany(() => CharacterImages, (charImage) => charImage.charId)
  images: CharacterImages[];

  @ManyToOne(() => Category, (cat) => cat.characters, {})
  @JoinColumn()
  category: Category;
}
