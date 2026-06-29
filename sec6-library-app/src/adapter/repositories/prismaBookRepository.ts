import { PrismaClient } from '@prisma/client';
import { BookRepositoryInterface } from '../../domain/repositories/bookRepositoryInterface';
import { Book } from '../../domain/entities/book';

export class PrismaBookRepository implements BookRepositoryInterface {
  constructor(private readonly prisma: PrismaClient) {}

  async create(book: Book): Promise<Book> {
    const createdBook = await this.prisma.book.create({
      data: {
        id: book.id,
        title: book.title,
        isAvailable: book.isAvailable,
        createdAt: book.createdAt,
        updatedAt: book.updatedAt,
      },
    });

    return new Book(
      createdBook.id,
      createdBook.title,
      createdBook.isAvailable,
      createdBook.createdAt,
      createdBook.updatedAt,
    );
  }

  async findById(id: string): Promise<Book | null> {
    
    const foundBook = await this.prisma.book.findUnique({
      where: {
        id,
      },
    });

    if (!foundBook) {
      return null;
    }

    return new Book(
      foundBook.id,
      foundBook.title,
      foundBook.isAvailable,
      foundBook.createdAt,
      foundBook.updatedAt,
    );
  }
}
