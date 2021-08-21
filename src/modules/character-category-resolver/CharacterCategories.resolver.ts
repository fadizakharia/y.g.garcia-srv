import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { getManager } from "typeorm";
import { Category } from "../../entity/Category";
import { CharactersCategoryResponse } from "./CharactersCategoryResponse/charactersCategoryResponse";
import * as yup from "yup";
import { addCharacterToCategoryInput } from "./add-character-to-category/input";
import { addCharacterToCategoryValidation } from "./add-character-to-category/validation";
import { Character } from "../../entity/Character";
@Resolver()
export class CharacterCategoriesResolver {
  @Query()
  async getCategories(): Promise<Category[]> {
    try {
      const manager = getManager();
      const categories = await manager.find(Category, {});
      return categories;
    } catch (err) {
      throw new Error("something went wrong!");
    }
  }
  @Query()
  async getCharactersInCategory(
    @Arg("catId") catId: string
  ): Promise<CharactersCategoryResponse> {
    const validity = await yup.string().uuid().isValid(catId);
    if (!validity) {
      return {
        errors: [{ field: "catId", message: "not a valid category id!" }],
      };
    }
    try {
      const manager = getManager();
      const foundCategory = await manager.findOne(Category, catId, {
        relations: ["characters"],
      });
      return { characters: foundCategory.characters };
    } catch (err) {
      throw new Error("something went wrong!");
    }
  }
  @Mutation()
  async addCategory(@Arg("title") title: string): Promise<boolean> {
    const titleValidity = yup.string().min(3).isValid(title);
    if (!titleValidity) {
      throw new Error("title must be atleast 3 characters!");
    }
    try {
      const manager = getManager();
      const createdCategory = manager.create(Category, { title });
      await manager.save(createdCategory);
      return true;
    } catch (err) {
      throw new Error("something went wrong!");
    }
  }
  @Mutation()
  async addCharacterToCategory(
    @Arg("addCharacterToCategoryInput") args: addCharacterToCategoryInput
  ): Promise<CharactersCategoryResponse> {
    const error: { field: string; message: string }[] = [];
    await addCharacterToCategoryValidation
      .validate({ ...args }, { abortEarly: false })
      .catch(function (err: yup.ValidationError) {
        err.inner.forEach((e: any) => {
          error.push({ field: e.path, message: e!.message });
        });
      });
    if (error.length > 0) {
      return { errors: error };
    }

    try {
      const manager = getManager();
      const foundCategory = await manager.findOne(Category, args.catId);
      if (!foundCategory) {
        throw new Error("category does not exist!");
      }
      const character = await manager.findOne(Character, args.charId);
      foundCategory.characters.push(character);
      const updatedCategories = await manager.save(foundCategory);
      return { characters: updatedCategories.characters };
    } catch (err) {
      throw new Error("Something went wrong!");
    }
  }
}
