import { Book } from '@prisma/client';

export interface BookRepositoryInterface {
  create(title: string): Promise<Book>;
  findById(id: string): Promise<Book | null>;
}
