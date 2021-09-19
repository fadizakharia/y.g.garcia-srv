import { Arg, Authorized, Mutation, Query, Resolver } from "type-graphql";
import { getManager } from "typeorm";
import { ValidationError } from "yup";
import { Character } from "../../entity/Character";
import { AddCharacterInput } from "./add-character/input";
import { addCharacterValidator } from "./add-character/validation";
import { CharacterResponse } from "./character-response/CharacterResponse";
import { UpdateCharacterInput } from "./update-character/input";
import { updateCharacterValidator } from "./update-character/validation";
import moment from "moment";
import { idValidation } from "./delete-character/validation";
import { Category } from "../../entity/Category";
import { CharactersResponse } from "./character-response/CharactersResponse";
@Resolver()
export class CharacterResolver {
  @Query(() => CharactersResponse)
  async getCharacters(
    @Arg("cat", () => String, { nullable: true }) categoryId: string,
    @Arg("page", () => Number, { defaultValue: 0 }) page: number,
    @Arg("step", () => Number, { defaultValue: 10 }) step: number
  ): Promise<CharactersResponse> {
    const manager = getManager();
    console.log(page, step);

    try {
      let foundCharacters: any;
      let total = 0;
      let result;
      if (categoryId) {
        const foundCategory = await manager.findOne(Category, categoryId);
        if (foundCategory) {
          result = await manager.findAndCount(Character, {
            where: { category: foundCategory },
            skip: page * step,
            take: step,
            relations: ["category", "images"],
          });
          foundCharacters = result[0];
          total = result[1];
        } else {
          throw new Error("category does not exist!");
        }
      } else {
        result = await manager.findAndCount(Character, {
          skip: page * step,
          take: step,
          relations: ["category", "images"],
        });
        foundCharacters = result[0];

        total = result[1];
      }
      if (foundCharacters && foundCharacters.length > 0) {
        return {
          total,
          characters: foundCharacters,
        };
      }
      throw new Error("could not find characters!");
    } catch (err) {
      throw new Error("something went wrong!");
    }
  }

  @Mutation(() => CharacterResponse)
  @Authorized("add:character")
  async createCharacter(
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
      let savedCharacter: any;
      const manager = getManager();
      let newArg: any = {};
      if (!arg.category) {
        console.log("im here");

        Object.assign(newArg, {
          ...arg,
          date_of_birth: moment(arg.date_of_birth)
            .format("MM-DD-YYYY")
            .toString(),
          category: null,
        });

        const createdCharacter = manager.create(Character, newArg);
        savedCharacter = await manager.save(createdCharacter);
        console.log(savedCharacter);
      } else {
        console.log("im here");

        const foundCategory = await manager.findOne(Category, arg.category);
        console.log(foundCategory);

        if (foundCategory) {
          Object.assign(newArg, {
            ...arg,
            date_of_birth: moment(arg.date_of_birth)
              .format("MM-DD-YYYY")
              .toString(),
          });
          const createdCharacter = manager.create(Character, newArg);
          console.log("1");
          savedCharacter = await manager.save(createdCharacter);
          foundCategory.characters.push(savedCharacter);
          await manager.save(foundCategory);
          console.log("2");
        } else {
          throw new Error("category does not exist!");
        }
      }
      if (savedCharacter) {
        return { character: savedCharacter };
      } else {
        throw new Error("something went wrong!");
      }
    } catch (err) {
      throw new Error("something went wrong!" + err);
    }
  }
  @Authorized(["update:character"])
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
        if (arg.date_of_birth) {
          Object.assign(foundCharacter, {
            ...foundCharacter,
            ...arg,
            date_of_birth: moment(arg.date_of_birth).toDate(),
          });
        } else {
          Object.assign(foundCharacter, {
            ...foundCharacter,
            ...arg,
          });
        }
        if (arg.category) {
          const foundCategory = await manager.findOne(Category, arg.category);
          Object.assign(foundCharacter, {
            ...foundCharacter,
            ...arg,
            category: foundCategory,
          });
        } else {
          if (foundCharacter.category) {
            Object.assign(foundCharacter, {
              ...foundCharacter,
              ...arg,
              category: null,
            });
          }
        }
        const updatedCharacter = await manager.save(foundCharacter);
        return { character: updatedCharacter };
      } else {
        throw new Error("Character does not exist!");
      }
    } catch (err) {
      throw new Error("Something went wrong! please try again later.");
    }
  }
  @Authorized(["delete:character"])
  @Mutation(() => Boolean)
  async deleteCharacter(@Arg("id") id: string): Promise<Boolean> {
    const valid = await idValidation.isValid(id);
    if (!valid) {
      throw new Error("Invalid id!");
    }
    try {
      const manager = getManager();
      const foundCharacter = await manager.findOne(Character, id);
      if (!foundCharacter) {
        throw new Error("could not find character!");
      }
      await manager.remove(Character, foundCharacter);
      return true;
    } catch (err) {
      throw new Error("Something went wrong!");
    }
  }
}
