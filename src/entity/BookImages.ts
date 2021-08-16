import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Book } from "./Book";
@ObjectType()
@Entity("book_images")
export class BookImages {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: String;

  @Field(() => Book)
  @ManyToOne(() => Book, (book) => book.images, {
    cascade: ["insert", "update"],
  })
  @JoinColumn({ name: "book_id" })
  bookId: Book;

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
