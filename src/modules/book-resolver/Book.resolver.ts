import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { EntityManager, getManager } from "typeorm";
import { ValidationError } from "yup";

import { Book } from "../../entity/Book";
import Context from "../../types/context";
import { BookResponse } from "./book-response/BookResponse";
import { BooksResponse } from "./books-response/BooksResponse";
import { CreateBookInput } from "./create-book/CreateBookInput";
import { createBookValidator } from "./create-book/validation";
import { UpdateBookInput } from "./update-book/UpdateBookInput";
import { updateBookValidator } from "./update-book/validation";

@Resolver()
export class BookResolver {
  @Query(() => BooksResponse)
  async getBooks(@Ctx() _: Context): Promise<BooksResponse> {
    try {
      const foundBooks = await getManager().find(Book);
      if (foundBooks && foundBooks.length > 0) {
        return { Books: foundBooks };
      } else {
        return { errors: [{ field: "404", message: "no books found!" }] };
      }
    } catch (err) {
      return { errors: [{ field: "500", message: "something went wrong!" }] };
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
  @Authorized(["add:book"])
  async createBook(
    @Arg("addBookInput") bookInput: CreateBookInput,
    @Ctx() _: Context
  ): Promise<BookResponse> {
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
      const createdBook = getManager().create(Book, { ...bookInput });
      const savedBook = await getManager().save(createdBook);
      if (savedBook) {
        return { Book: { ...savedBook } };
      } else {
        throw new Error("something went wrong!");
      }
    } catch (err) {
      throw new Error("something went wrong!");
    }
  }
  @Authorized(["update:book"])
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

      Object.assign(foundBook, bookInput);
      const updatedBook = await getManager().save(foundBook);
      return { Book: updatedBook };
    } catch (err) {
      throw new Error("something went wrong!");
    }
  }
  @Authorized(["delete:book"])
  @Mutation(() => Boolean)
  async deleteBook(
    @Arg("bookId") id: string,
    @Ctx() _: Context
  ): Promise<Boolean> {
    let bookManager: EntityManager;
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
      throw new Error("could not find the requested book!");
    }
  }
}
