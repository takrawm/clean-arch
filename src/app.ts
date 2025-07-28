import express from "express";
import { BookController } from "./bookController/bookController";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const bookController = new BookController();

app.post("/books", bookController.add.bind(bookController));
app.get("/books/:id", bookController.findById.bind(bookController));

app.listen(PORT, () => console.log("Server is running"));
