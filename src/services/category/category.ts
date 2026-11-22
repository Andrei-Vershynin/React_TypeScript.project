import type { CategoryRepository } from "../../domain/post/category/repository.js";
import type { Database } from "../../prisma/db.js";



export function createCategoryRepository(
	database: Database,
): CategoryRepository {
	return {
		async getAll() {
			return (database.orm.public as any).category.orderBy((category: { id: { asc: () => any; }; }) =>
				category.id.asc(),
			).all();
		},

		async getById(id: any) {
			return (database.orm.public as any).category.where({ id }).first();
		},

		async createCategory(data: any) {
			try {
				return await (database.orm.public as any).category.create(data);
			} catch (error) {
				if (
					error instanceof Error &&
					"sqlState" in error &&
					error.sqlState === "23505"
				) {
					throw new Error("CATEGORY_ALREADY_EXISTS");
				}
				throw error;
			}
		},
	};
}