import express from "express";
import { PrismaClient } from "../../../src-layered/generated/prisma";
import { BookController } from "../../adapter/controllers/bookController";
import { PrismaBookRepository } from "../../adapter/repositories/prismaBookRepository";
import { UuidGenerator } from "../../adapter/utils/uuidGenerator";
import { AddBookUseCase } from "../../application/useCases/book/addBookUseCase";
import { FindBookByIdUseCase } from "../../application/useCases/book/findBookByIdUseCase";
import { bookRoutes } from "./routers/bookRouter";

// Infrastructure 層（Composition Root）: 各層の具象実装を組み立て、HTTP サーバーを起動する。
//
// 依存の向き（内側へ）:
//   Controller → Use Case → Repository Interface ← PrismaBookRepository
//
// Prisma Client は prisma/schema.prisma の output 先（src-layered/generated/prisma）を参照する。
const app = express();
app.use(express.json());

const prisma = new PrismaClient();
const uuidGenerator = new UuidGenerator();

// 具象クラスを生成し、インターフェース経由で Use Case / Controller に注入する。
const bookRepository = new PrismaBookRepository(prisma);
const addBookUseCase = new AddBookUseCase(bookRepository, uuidGenerator);
const findBookByIdUseCase = new FindBookByIdUseCase(bookRepository);
const bookController = new BookController(addBookUseCase, findBookByIdUseCase);

app.use("/books", bookRoutes(bookController));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

export default app;
