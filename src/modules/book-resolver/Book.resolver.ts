import moment from "moment";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { EntityManager, getManager } from "typeorm";
import { ValidationError } from "yup";

import { Book } from "../../entity/Book";
import { PurchaseOption } from "../../entity/PurchaseOption";
import Context from "../../types/context";

import { deleteFromS3, uploadToS3 } from "../../util/imageUpload";
import { BookResponse } from "./book-response/BookResponse";
import { BooksResponse } from "./books-response/BooksResponse";
import { PaymentOptionCreateType } from "./create-book-payment-options/input";
import { CreateBookInput } from "./create-book/input";
import { createBookValidator } from "./create-book/validation";
import { UpdateBookInput } from "./update-book/input";
import { updateBookValidator } from "./update-book/validation";

@Resolver()
export class BookResolver {
  @Query(() => BooksResponse)
  async getBooks(@Ctx() _: Context): Promise<BooksResponse> {
    try {
      const foundBooks = await getManager().find(Book, {
        relations: ["purchase_options", "images"],
      });
      if (foundBooks && foundBooks.length > 0) {
        console.log(foundBooks);

        return { Books: foundBooks };
      } else {
        return {
          errors: [
            {
              field: "No books found",
              message:
                "you can add books by clicking on the plus symbol on the top right of the table",
            },
          ],
        };
      }
    } catch (err) {
      throw new Error("something went wrong!" + err);
    }
  }
  @Query(() => BookResponse)
  async getBook(
    @Arg("bookId") id: string,
    @Ctx() _: Context
  ): Promise<BookResponse> {
    try {
      const foundBook = await getManager().findOneOrFail(Book, { id });
      if (foundBook) {
        return { Book: foundBook };
      } else {
        return { errors: [{ field: "404", message: "no books found!" }] };
      }
    } catch (err) {
      return { errors: [{ field: "500", message: "something went wrong!" }] };
    }
  }
  @Mutation(() => BookResponse)
  @Authorized(["add:books"])
  async createBook(
    @Arg("addBookInput") bookInput: CreateBookInput,
    @Ctx() _: Context
  ): Promise<BookResponse> {
    let newPaymentOptions = [] as PurchaseOption[];
    try {
      const error: { field: string; message: string }[] = [];
      await createBookValidator
        .validate({ ...bookInput }, { abortEarly: false })
        .catch(function (err: ValidationError) {
          err.inner.forEach((e: any) => {
            error.push({ field: e.path, message: e!.message });
          });
        });
      if (error.length > 0) {
        return { errors: error };
      }
      const createdBook = getManager().create(Book, {
        ...bookInput,
        genres: bookInput.genres.join(", "),
      });
      const savedBook = await getManager().save(createdBook);

      if (savedBook) {
        if (newPaymentOptions && newPaymentOptions.length > 0) {
          return {
            Book: { ...savedBook, purchase_options: newPaymentOptions },
          };
        }
        return { Book: { ...savedBook } };
      } else {
        throw new Error("something went wrong!");
      }
    } catch (err) {
      throw new Error("something went wrong!" + err);
    }
  }
  @Authorized(["update:books"])
  @Mutation(() => BookResponse)
  async updateBook(
    @Arg("updateBookInput") bookInput: UpdateBookInput,
    @Ctx() _: Context
  ): Promise<BookResponse> {
    const error: { field: string; message: string }[] = [];
    await updateBookValidator
      .validate({ ...bookInput }, { abortEarly: false })
      .catch(function (err: ValidationError) {
        err.inner.forEach((e: any) => {
          error.push({ field: e.path, message: e!.message });
        });
      });
    if (error.length > 0) {
      return { errors: error };
    }
    try {
      const foundBook = await getManager().findOne(Book, bookInput.id);
      if (bookInput.genres.length > 0) {
        Object.assign(foundBook, {
          ...bookInput,
          genres: bookInput.genres.join(", "),
        });
      } else {
        Object.assign(foundBook, bookInput);
      }
      const updatedBook = await getManager().save(foundBook);
      return { Book: updatedBook };
    } catch (err) {
      throw new Error("something went wrong!");
    }
  }
  @Authorized(["delete:books"])
  @Mutation(() => Boolean)
  async deleteBook(
    @Arg("bookId") id: string,
    @Ctx() _: Context
  ): Promise<Boolean> {
    let bookManager: EntityManager;
    console.log(id);

    try {
      bookManager = getManager();
    } catch (err) {
      throw new Error("Something went wrong!");
    }
    try {
      const foundBook = await bookManager.findOne(Book, id);

      await bookManager.remove(foundBook);
      return true;
    } catch (err) {
      throw new Error("could not find the requested book!" + err);
    }
  }
  @Authorized(["add:books"])
  @Mutation(() => Boolean)
  async addBookPaymentOption(
    @Arg("bookId") bookId: string,
    @Arg("paymentOption", () => PaymentOptionCreateType)
    paymentOption: PaymentOptionCreateType
  ) {
    let uniqueName;

    const { createReadStream, filename } = await paymentOption.image;

    let readStream = createReadStream();

    let fileNameArr = filename.split(".");
    let fileNamePre = fileNameArr[0];
    let fileNamePost = fileNameArr[1];
    uniqueName =
      (fileNamePre + moment.now()).toLowerCase() + "." + fileNamePost;
    try {
      let uploadMetaData = await uploadToS3(readStream, uniqueName);
      const manager = getManager();
      const foundBook = await manager.findOne(Book, bookId);
      console.log(uploadMetaData);
      if (foundBook && uploadMetaData) {
        const createdPurchaseOption = manager.create(PurchaseOption, {
          Book: foundBook,
          iconUrl: uploadMetaData.Location,
          title: uploadMetaData.Key,
          key: uploadMetaData.Key,
          url: paymentOption.url,
        });

        await manager.save(createdPurchaseOption);
      }
      return true;
    } catch (err) {
      throw new Error("could not upload image." + err);
    }
  }
  @Authorized(["delete:books"])
  @Mutation(() => Boolean)
  async deletePaymentOption(@Arg("paymentId", () => String) id: string) {
    try {
      const manager = getManager();
      const foundPaymentOption = await manager.findOne(PurchaseOption, id);
      if (foundPaymentOption) {
        const Key = foundPaymentOption.key;
        const Bucket = process.env.AWS_S3_BUCKET_NAME;

        await deleteFromS3({ Key, Bucket });
        await manager.remove(PurchaseOption, foundPaymentOption);
      } else {
        throw new Error("could not find payment option!");
      }
      return true;
    } catch (err) {
      throw new Error("something went wrong!");
    }
  }
}
