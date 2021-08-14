import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Book } from "./Book";
@ObjectType()
@Entity("purchase_option")
export class PurchaseOption {
  @Field(() => String)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => String)
  @Column({ type: "text" })
  icon: string;

  @Field(() => String)
  @Column({ type: "text" })
  url: string;

  @Field(() => Book)
  @ManyToOne(() => Book, (book) => book.purchase_options)
  Book: Book;
}
