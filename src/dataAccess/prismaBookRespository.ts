import { Book, PrismaClient } from "../generated/prisma";

export class PrismaBookRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  //   Promise<Book>: 非同期処理の結果としてBookオブジェクトを返すことを示す
  async create(title: string): Promise<Book> {
    return await this.prisma.book.create({
      data: {
        title,
        isAvailable: true,
      },
    });
  }

  async findById(id: string): Promise<Book | null> {
    return await this.prisma.book.findUnique({
      where: {
        id,
      },
    });
  }
}
