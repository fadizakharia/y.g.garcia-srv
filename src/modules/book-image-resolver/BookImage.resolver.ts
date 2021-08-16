import { uploadToS3 } from "../../util/imageupload";
import { createWriteStream } from "fs";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import { file } from "../../types/file";
import { ManagedUpload } from "aws-sdk/clients/s3";
import { getManager } from "typeorm";
import { BookImages } from "../../entity/BookImages";
import { Book } from "../../entity/Book";

@Resolver()
export class BookImage {
  @Query()
  async getImage(@Arg("key") key: string): Promise<String> {
    return key;
  }
  @Mutation()
  async addImage(
    @Arg("image", () => GraphQLUpload)
    { filename, createReadStream }: file,
    @Arg("bookId") bookId: string
  ): Promise<boolean> {
    const localImageUrl = __dirname + `../../images/${filename}`;
    const internalFileSaveStatus = await new Promise<boolean>(
      async (resolve, reject) => {
        createReadStream()
          .pipe(createWriteStream(localImageUrl))
          .on("finish", () => {
            resolve(true);
          })
          .on("error", () => reject(false));
      }
    );
    if (internalFileSaveStatus) {
      const readStream = createReadStream().pipe(
        createWriteStream(`images/books/${filename}`)
      );
      let uploadMetaData: ManagedUpload.SendData;
      try {
        uploadMetaData = await uploadToS3(readStream, filename);
        const manager = getManager();
        const foundBook = await manager.findOne(Book, bookId);
        manager.create(BookImages, {
          bookId: foundBook,
          imageUrl: uploadMetaData.Location,
          key: uploadMetaData.Key,
          localImageUrl,
        });
        return true;
      } catch (err) {
        throw new Error("could not upload image.");
      }
    } else {
      throw new Error("could not upload image.");
    }
  }
}
