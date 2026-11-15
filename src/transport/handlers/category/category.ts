import type { CategoryService } from "../../../services/category.service";
import type { Request, Response } from "express";

interface CategoryHandlers {
  getCategories(req: Request, res: Response): Promise<void>;
  getCategoryById(req: Request, res: Response): Promise<void>;
  createCategory(req: Request, res: Response): Promise<void>;
}


export function createCategoryHandlers(
  categoryService: CategoryService,
): CategoryHandlers {
  return {
    async getCategories(_req, res) {
      try {
        const categories = await categoryService.getAll();
        res.status(200).json(categories);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    },

    async getCategoryById(req, res) {
      try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
          res.status(400).json({ message: "Invalid category id" });
          return;
        }
        const category = await categoryService.getById(id);
        if (!category) {
          res.status(404).json({ message: "Category not found" });
          return;
        }
        res.status(200).json(category);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    },
    async createCategory(req, res) {
      try {
        const { name } = req.body;
        if (typeof name !== "string" || name.trim().length === 0) {
          res.status(422).json({ message: "Invalid category data" });
          return;
        }
        const category = await categoryService.create({ name });
        res.status(201).json(category);
      } catch (error) {
        if (error instanceof Error &&
            error.message === "CATEGORY_ALREADY_EXISTS") {
          res.status(409).json({ message: "Category already exists" });
          return;
        }
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
    },
  };
}