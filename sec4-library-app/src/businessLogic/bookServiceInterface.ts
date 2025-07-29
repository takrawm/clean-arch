import { Book } from '@prisma/client';

export interface BookServiceInterface {
  add(title: string): Promise<Book>;
  findById(id: string): Promise<Book | null>;
}
