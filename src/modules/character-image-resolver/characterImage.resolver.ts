import { ManagedUpload } from "aws-sdk/clients/s3";
import { createWriteStream } from "fs";
import { GraphQLUpload } from "graphql-upload";
import { Resolver, Arg, Query, Mutation } from "type-graphql";
import { getManager } from "typeorm";
import * as yup from "yup";
import { Character } from "../../entity/Character";
import { CharacterImages } from "../../entity/CharacterImages";
import { file } from "../../types/file";
import { CharacterImageResponse } from "./CharacterImageResponse/CharacterImageResponse";
import { uploadToS3 } from "../../util/imageUpload";
@Resolver()
export class CharacterImageResolver {
  @Query()
  async getCharacterImages(
    @Arg("characterId") charId: string
  ): Promise<CharacterImageResponse> {
    const idValidity = await yup.string().uuid().isValid(charId);
    if (!idValidity) {
      return { errors: [{ field: "charId", message: "charId is incorrect!" }] };
    }
    const manager = getManager();
    const foundCharacter = await manager.findOne(Character, charId, {
      relations: ["images"],
    });
    console.log(foundCharacter.images);
    return { images: foundCharacter.images as CharacterImages[] };
  }
  @Mutation()
  async addCharacterImage(
    @Arg("image", () => GraphQLUpload)
    { filename, createReadStream }: file,
    @Arg("charId") charId: string
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
        const foundCharacter = await manager.findOne(Character, charId);
        console.log(uploadMetaData);

        const createdCharImage = manager.create(CharacterImages, {
          charId: foundCharacter,
          imageUrl: uploadMetaData.Location,
          key: uploadMetaData.Key,
          localImageUrl,
        });
        await manager.save(createdCharImage);
        return true;
      } catch (err) {
        throw new Error("could not upload image." + err);
      }
    } else {
      throw new Error("could not upload image.");
    }
  }
}
