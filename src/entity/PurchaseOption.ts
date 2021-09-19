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
  title: string;

  @Field(() => String)
  @Column({ type: "text" })
  url: string;

  @Field(() => String)
  @Column({ type: "text" })
  iconUrl: string;

  @Field(() => String)
  @Column({ type: "text" })
  key: string;

  @Field(() => Book)
  @ManyToOne(() => Book, (book) => book.purchase_options, {
    cascade: ["insert", "update"],
  })
  Book: Book;
}
