import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { getManager } from "typeorm";
import { ValidationError } from "yup";
import { Character } from "../../entity/Character";
import { AddCharacterInput } from "./add-character/AddCharacterInput";
import { addCharacterValidator } from "./add-character/AddCharacterValidation";
import { CharacterResponse } from "./character-response/CharacterResponse";

@Resolver()
export class CharacterResolver {
  @Query()
  async getCharacters() {}

  @Mutation()
  async addCharacter(
    @Arg("addCharacterInput") arg: AddCharacterInput
  ): Promise<CharacterResponse> {
    const error: { field: string; message: string }[] = [];
    await addCharacterValidator
      .validate({ ...arg }, { abortEarly: false })
      .catch(function (err: ValidationError) {
        err.inner.forEach((e: any) => {
          error.push({ field: e.path, message: e!.message });
        });
      });
    if (error.length > 0) {
      return { errors: error };
    }
    try {
      const manager = getManager();
      const createdCharacter = manager.create(Character, { ...arg });
      const savedCharacter = await manager.save(createdCharacter);
      if (savedCharacter) {
        return { character: savedCharacter };
      } else {
        throw new Error("something went wrong!");
      }
    } catch (err) {
      throw new Error("something went wrong!");
    }
  }
}
