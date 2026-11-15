import type { CategoryRepository } from "../../domain/post/category/repository";
import type { CategoryService } from "../category.service";


export function createCategoryService(
  repository: CategoryRepository,
): CategoryService {
  return {
    getAll() {
      return repository.getAll();
    },

    getById(id: number) {
      return repository.getById(id);
    },

    async create(dto) {
      if (typeof dto.name !== "string") {
        throw new Error("INVALID_CATEGORY_DATA");
      }
      const name = dto.name.trim();
      if (!name) throw new Error("INVALID_CATEGORY_DATA");
      return repository.create(name);
    },
  };
}