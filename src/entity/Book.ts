import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { BookImages } from "./BookImages";
import { Genre } from "./Genre";
import { PurchaseOption } from "./PurchaseOption";
@ObjectType()
@Entity()
export class Book {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ type: "text", nullable: false })
  title: string;

  @Field(() => Number)
  @Column({ type: "integer", nullable: false })
  status: number; // coming soon:0, preorder:1, available:2

  @Field(() => String)
  @Column({ type: "text" })
  subtitle: string;

  @Field(() => String)
  @Column({ type: "text" })
  header: string;

  @Field(() => String)
  @Column({ type: "text" })
  body: string;

  @Field(() => String)
  @Column({ type: "text" })
  warning_message: string;

  @Field(() => [BookImages])
  @OneToMany(() => BookImages, (imgs) => imgs.bookId)
  images: BookImages[];

  @Field(() => [PurchaseOption])
  @OneToMany(() => PurchaseOption, (opts) => opts.Book)
  purchase_options: PurchaseOption[];

  @Field(() => [Genre])
  @ManyToMany(() => Genre)
  @JoinTable()
  genres: Genre[];
}
