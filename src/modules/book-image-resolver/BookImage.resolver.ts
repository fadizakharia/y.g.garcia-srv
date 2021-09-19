import { deleteFromS3, uploadToS3 } from "../../util/imageUpload";
import { createWriteStream } from "fs";
import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { GraphQLUpload } from "graphql-upload";
import { file } from "../../types/file";
import { ManagedUpload } from "aws-sdk/clients/s3";
import { getManager } from "typeorm";
import { BookImages } from "../../entity/BookImages";
import { Book } from "../../entity/Book";
import * as yup from "yup";
import { bookImageResponse } from "./BookImagesResponse/BookImagesResponse";
import moment from "moment";

@Resolver()
export class BookImage {
  @Query(() => String)
  async getImage(
    @Arg("imageId", () => String) imageId: string
  ): Promise<bookImageResponse> {
    const idValidity = await yup.string().uuid().isValid(imageId);
    if (!idValidity) {
      return {
        errors: [{ field: "imageId", message: "imageId is incorrect" }],
      };
    }
    const manager = getManager();
    const image = await manager.findOne(BookImages, imageId);
    console.log(image);
    return { images: image as BookImages };
  }
  @Authorized(["add:books"])
  @Mutation(() => Boolean)
  async addBookImage(
    @Arg("image", () => GraphQLUpload)
    { filename, createReadStream }: file,
    @Arg("bookId") bookId: string
  ): Promise<boolean> {
    let fileNameArr = filename.split(".");
    let fileNamePre = fileNameArr[0];
    let fileNamePost = fileNameArr[1];
    let uniqueName =
      (fileNamePre + moment.now()).toLowerCase() + "." + fileNamePost;

    const localImageUrl = __dirname + `/../../images/${uniqueName}`;
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
        uploadMetaData = await uploadToS3(readStream, uniqueName);
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
  @Authorized(["delete:books"])
  @Mutation(() => Boolean)
  async deleteBookImage(@Arg("imageId") imageId: string): Promise<Boolean> {
    try {
      const manager = getManager();
      const foundImage = await manager.findOne(BookImages, imageId);
      if (foundImage) {
        const Key = foundImage.key;
        const Bucket = process.env.AWS_S3_BUCKET_NAME;

        await deleteFromS3({ Key, Bucket });
        await manager.remove(foundImage);
        return true;
      }
      throw new Error("could not find image");
    } catch (err) {
      throw new Error(err);
    }
  }
}
