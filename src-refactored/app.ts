// 起動前の準備（プロジェクトルートで実行）:
//   npm install
//   npx prisma migrate dev --name init   … prisma/dev.db に Book テーブルを作成
//   npx prisma generate                  … Prisma Client を生成（migrate 内で実行されることもある）
// 起動: npx ts-node-dev --respawn --transpile-only src-refactored/app.ts
import express from "express";
import { BookController } from "./presentation/bookController";
import { BookService } from "./businessLogic/bookService";
import { PrismaBookRepository } from "./dataAccess/prismaBookRepository";

const app = express();
app.use(express.json());

const bookRepository = new PrismaBookRepository();
const bookService = new BookService(bookRepository);
const bookController = new BookController(bookService);

app.post("/books", bookController.add.bind(bookController));
app.get("/books/:id", bookController.findById.bind(bookController));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
