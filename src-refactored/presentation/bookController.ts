import { BookServiceInterface } from "../businessLogic/bookServiceInterface";
import { Request, Response } from "express";

// Presentation 層: HTTP リクエストを受け取り、Service を呼び出し、レスポンスを返す。
//
// メソッドの返り値が Promise<void> な理由:
// - Express はルートハンドラの return 値を使わない。res.status().json() でクライアントに返す。
// - Service/Repository は Book を return するが、Controller の返却先は HTTP クライアント（res 経由）。
// - async のため Promise、戻り値がないため void。
//
// 「呼び出し元」とは、そのメソッドを直接呼び出すコード（1つ内側の層 or フレームワーク）のこと。
//   repository.create の呼び出し元 → BookService
//   bookService.add の呼び出し元     → BookController（this.bookService.add）
//   bookController.add の呼び出し元  → Express（app.post で登録したルートハンドラ）
// Book データの最終的な受け手（返却先）は HTTP クライアント（curl 等）。Express は呼び出し元だが return 値は使わない。
export class BookController {
  constructor(private readonly bookService: BookServiceInterface) {}

  // bookService から Book を受け取り、res.status(201).json(book) で返却（return 不要）
  async add(req: Request, res: Response): Promise<void> {
    try {
      const title = req.body.title as string;
      const book = await this.bookService.add(title);
      res.status(201).json(book);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "書籍の登録に失敗しました" });
    }
  }

  // book の有無で 200 / 404 を res 経由で返却（return 不要）
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const book = await this.bookService.findById(id);
      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).json({ error: "書籍が見つかりませんでした" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "書籍の検索に失敗しました" });
    }
  }
}
