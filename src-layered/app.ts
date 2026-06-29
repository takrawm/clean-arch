import express from "express";
import { BookController } from "./bookController/bookController";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const bookController = new BookController();

// Express は渡された関数を「メソッド」としてではなく「普通の関数」として後から呼び出す。
// bookController.add だけ渡すと this が bookController から外れ、
// add 内の this.bookService が undefined になる。
// .bind(bookController) で this を bookController インスタンスに固定する。
app.post("/books", bookController.add.bind(bookController));
app.get("/books/:id", bookController.findById.bind(bookController));

app.listen(PORT, () => console.log("Server is running"));
