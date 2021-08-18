import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getManager } from "typeorm";
import { ValidationError } from "yup";
import { Character } from "../../entity/Character";
import Context from "../../types/Context";
import { AddCharacterInput } from "./add-character/input";
import { addCharacterValidator } from "./add-character/validation";
import { CharacterResponse } from "./character-response/CharacterResponse";
import { UpdateCharacterInput } from "./update-character/input";
import { updateCharacterValidator } from "./update-character/validation";
import moment from "moment";
@Resolver()
export class CharacterResolver {
  @Query(() => String)
  async getCharacters() {
    return "placeholder";
  }

  @Mutation(() => CharacterResponse)
  @Authorized("add:character")
  async createCharacter(
    @Arg("addCharacterInput") arg: AddCharacterInput,
    @Ctx() _: Context
  ): Promise<CharacterResponse> {
    const error: { field: string; message: string }[] = [];
    await addCharacterValidator
      .validate({ ...arg }, { abortEarly: false })
      .catch(function (err: ValidationError) {
        err.inner.forEach((e: any) => {
          error.push({ field: e.path, message: e!.message });
        });
      });
    if (!moment(arg.date_of_birth, moment.ISO_8601, true).isValid()) {
      error.push({ field: "date_of_birth", message: "not a valid date" });
    } else {
      if (moment(arg.date_of_birth).isSameOrAfter(moment())) {
        error.push({ field: "date_of_birth", message: "not a valid date" });
      }
    }
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
  @Mutation(() => CharacterResponse)
  async updateCharacter(
    @Arg("updateCharacterInput") arg: UpdateCharacterInput
  ): Promise<CharacterResponse> {
    const error: { field: string; message: string }[] = [];
    await updateCharacterValidator
      .validate({ ...arg }, { abortEarly: false })
      .catch(function (err: ValidationError) {
        err.inner.forEach((e: any) => {
          error.push({ field: e.path, message: e!.message });
        });
      });
    if (!moment(arg.date_of_birth, moment.ISO_8601, true).isValid()) {
      error.push({ field: "date_of_birth", message: "not a valid date" });
    } else {
      if (moment(arg.date_of_birth).isSameOrAfter(moment())) {
        error.push({ field: "date_of_birth", message: "not a valid date" });
      }
    }
    if (error.length > 0) {
      return { errors: error };
    }
    try {
      const manager = getManager();
      const foundCharacter = await manager.findOne(Character, arg.id);
      if (foundCharacter) {
        Object.assign(foundCharacter, { ...arg });
        const updatedCharacter = await manager.save(foundCharacter);
        return { character: updatedCharacter };
      } else {
        throw new Error("Character does not exist!");
      }
    } catch (err) {
      throw new Error("Something went wrong! please try again later.");
    }
  }
}
