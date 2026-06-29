import { BookRepositoryInterface } from "./bookRepositoryInterface";
// prisma generate により schema.prisma から生成された Client（npx prisma generate で更新）
// migrate dev により prisma/dev.db に Book テーブルが作成される（npx prisma migrate dev）
import { Book, PrismaClient } from "../../src-layered/generated/prisma";

export class PrismaBookRepository implements BookRepositoryInterface {
  private prisma: PrismaClient;

  constructor() {
    // DATABASE_URL（.env）経由で prisma/dev.db（SQLite）に接続
    this.prisma = new PrismaClient();
  }

  // prisma.book.create / findUnique は DML（INSERT, SELECT）。DDL（CREATE TABLE）ではない。
  // テーブル構造（DDL）は schema.prisma + migrate dev が担当。
  // data 内の title, isAvailable は schema.prisma の Book モデルのフィールド名（こちらはスキーマ由来）。
  async create(title: string): Promise<Book> {
    return await this.prisma.book.create({
      data: { title, isAvailable: true },
    });
  }

  // prisma.book.findUnique の引数オブジェクトのプロパティ名（where 等）は Prisma が定めた API。
  // where 内の id は schema.prisma の Book モデルで @id と定義されたフィールド名。
  async findById(id: string): Promise<Book | null> {
    return await this.prisma.book.findUnique({ where: { id } });
  }
}
