import { BookRepositoryInterface } from "../../../domain/repositories/bookRepositoryInterface";
import { FindBookByIdRequestDto } from "../../dtos/book/findBookByIdRequestDto";
import { FindBookByIdResponseDto } from "../../dtos/book/findBookByIdResponseDto";
import { FindBookByIdUseCaseInterface } from "./findBookByIdUseCaseInterface";

// Use Case 層: ビジネスロジックの実行に専念する。
//
// try/catch を使わない理由:
// - 「本が見つからない」は if で扱う想定内の結果であり、catch 対象の例外ではない。
// - Repository の DB エラー等は握りつぶさず、そのまま上位（Controller）へ伝播させる。
// - HTTP ステータスやログ出力は Adapter 層（BookController）の責務。
export class FindBookByIdUseCase implements FindBookByIdUseCaseInterface {
  constructor(private readonly bookRepository: BookRepositoryInterface) {}

  async execute(
    requestDto: FindBookByIdRequestDto,
  ): Promise<FindBookByIdResponseDto> {
    const foundBook = await this.bookRepository.findById(requestDto.id);
    // 見つからない場合は throw し、HTTP への変換は Controller の catch が担う。
    if (!foundBook) {
      throw new Error("Book not found");
    }
    return {
      id: foundBook.id,
      title: foundBook.title,
      isAvailable: foundBook.isAvailable,
      createdAt: foundBook.createdAt,
      updatedAt: foundBook.updatedAt,
    };
  }
}
