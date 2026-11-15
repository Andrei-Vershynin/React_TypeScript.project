import type { Post } from '../domain/post/category/entity';
import type { Repository } from '../domain/post/category/repository';

type DB = any;

export const createProductRepository = (db: DB): Repository => {
  const posts = db.orm.public.Post;

  const toPost = (row: any): Post => ({
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category,
  });

  const repository = {
    async getAll({ category, take }: { category?: Post['category']; take?: number }) {
      const query = category ? posts.where({ category }) : posts;
      const rows = await query
        .orderBy((p: any) => p.createdAt.desc())
        .limit(take ?? 20)
        .all();
      return rows.map(toPost);
    },

    async getById(id: Post['id']) {
      const row = await posts.first({ id });
      return row ? toPost(row) : null;
    },

    async addPost(input: Pick<Post, 'title' | 'content' | 'category'> & { author: string }) {
      const row = await posts.create({
        title: input.title,
        content: input.content,
        category: input.category,
        author: input.author,
      });
      return toPost(row);
    },
  };

  return repository as Repository;
};

export const createCategoryRepository = (db: any) => ({
  findAll: () => db.category.findMany({ orderBy: { id: "asc" } }),
  findById: (id: any) => db.category.findUnique({ where: { id } }),
  findByName: (name: string) => db.category.findUnique({ where: { name } }),
  create: (name: any) => db.category.create({ data: { name } }),
});

export interface RefreshSessionRecord {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export class RefreshSessionRepository {
  private readonly db: any;

  constructor(db: any) {
    this.db = db;
  }

  create(data: { userId: string; tokenHash: string; expiresAt: Date }) {
    return this.db.refreshSession.create({ data });
  }

  findByHash(tokenHash: string) {
    return this.db.refreshSession.findUnique({ where: { tokenHash } });
  }

  async deleteByHash(tokenHash: string): Promise<boolean> {
    const { count } = await this.db.refreshSession.deleteMany({ where: { tokenHash } });
    return count > 0;
  }

  deleteExpired() {
    return this.db.refreshSession.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  }
}