import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { getManager } from "typeorm";
import { Category } from "../../entity/Category";

import * as yup from "yup";

@Resolver()
export class CharacterCategoriesResolver {
  @Query(() => [Category])
  async getCategories(): Promise<Category[]> {
    try {
      const manager = getManager();
      const categories = await manager.find(Category, {});
      return categories;
    } catch (err) {
      throw new Error("something went wrong!");
    }
  }
  @Mutation(() => Boolean)
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
  @Mutation(() => Boolean)
  async deleteCategory(@Arg("catId") categoryId: string): Promise<boolean> {
    const manager = getManager();
    try {
      const foundCategory = await manager.findOne(Category, categoryId);
      if (!foundCategory) {
        throw new Error("could not find category!");
      }
      await manager.remove(foundCategory);
      return true;
    } catch (err) {
      throw new Error("something went wrong!" + err);
    }
  }
}
