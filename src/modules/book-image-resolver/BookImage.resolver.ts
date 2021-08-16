import { uploadToS3 } from "../../util/imageUpload";
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
  @Query(() => String)
  async getImage(@Arg("key") key: string): Promise<String> {
    return key;
  }
  // @Authorized(["add:book"])
  @Mutation(() => Boolean)
  async addImage(
    @Arg("image", () => GraphQLUpload)
    { filename, createReadStream }: file,
    @Arg("bookId") bookId: string
  ): Promise<boolean> {
    const localImageUrl = __dirname + `/../../images/${filename}`;
    const internalFileSaveStatus = await new Promise<boolean>(
      async (resolve, reject) => {
        createReadStream()
          .pipe(createWriteStream(localImageUrl))
          .on("finish", () => {
            resolve(true);
          })
          .on("error", (err) => reject(err));
      }
    );
    console.log(internalFileSaveStatus);

    if (internalFileSaveStatus) {
      const readStream = createReadStream();

      let uploadMetaData: ManagedUpload.SendData;

      try {
        uploadMetaData = await uploadToS3(readStream, filename);
        const manager = getManager();
        const foundBook = await manager.findOne(Book, bookId);
        console.log(uploadMetaData);

        const createdBookImage = manager.create(BookImages, {
          bookId: foundBook,
          imageUrl: uploadMetaData.Location,
          key: uploadMetaData.Key,
          localImageUrl,
        });
        await manager.save(createdBookImage);
        return true;
      } catch (err) {
        throw new Error("could not upload image." + err);
      }
    } else {
      throw new Error("could not upload image.");
    }
  }
}
