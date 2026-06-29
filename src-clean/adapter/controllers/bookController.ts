import { Request, Response } from "express";
import { AddBookRequestDto } from "../../application/dtos/book/addBookRequestDto";
import { FindBookByIdRequestDto } from "../../application/dtos/book/findBookByIdRequestDto";
import { AddBookUseCaseInterface } from "../../application/useCases/book/addBookUseCaseInterface";
import { FindBookByIdUseCaseInterface } from "../../application/useCases/book/findBookByIdUseCaseInterface";

// Adapter 層（Interface Adapter）: HTTP リクエストを DTO に変換し Use Case を呼び出し、結果を HTTP レスポンスで返す。
//
// Express（Request / Response）への依存について:
// - この層は外側の層なので、フレームワーク依存をここに閉じ込めるのがクリーンアーキテクチャの意図。
// - Use Case / Domain には Express の知識を持ち込まない（依存の向きは内側へ）。
// - 責務は req/res ↔ DTO の変換のみ。ビジネスロジックは Use Case に委譲する。
//
// try/catch はここで行い、Use Case から伝播した例外をステータスコードに変換する。
export class BookController {
  constructor(
    private readonly addBookUseCase: AddBookUseCaseInterface,
    private readonly findBookByIdUseCase: FindBookByIdUseCaseInterface,
  ) {}

  // Use Case から伝播した例外（DB エラー等）を HTTP レスポンスに変換する。
  async add(req: Request, res: Response): Promise<void> {
    try {
      const requestDto: AddBookRequestDto = {
        title: req.body.title as string,
      };
      const book = await this.addBookUseCase.execute(requestDto);
      res.status(201).json(book);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "書籍の登録に失敗しました" });
    }
  }

  // Use Case から伝播した例外（未検出・DB エラー等）を HTTP レスポンスに変換する。
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const requestDto: FindBookByIdRequestDto = {
        id: req.params.id as string,
      };
      const book = await this.findBookByIdUseCase.execute(requestDto);
      res.status(200).json(book);
    } catch (error) {
      res.status(500).json({ error: "書籍の検索に失敗しました" });
    }
  }
}
