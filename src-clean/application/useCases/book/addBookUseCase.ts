import { Book } from "../../../domain/entities/book";
import { BookRepositoryInterface } from "../../../domain/repositories/bookRepositoryInterface";
import { IdGeneratorInterface } from "../../../domain/utils/idGeneratorInterface";
import { AddBookRequestDto } from "../../dtos/book/addBookRequestDto";
import { AddBookResponseDto } from "../../dtos/book/addBookResponseDto";
import { AddBookUseCaseInterface } from "./addBookUseCaseInterface";

// Use Case 層: ビジネスロジックの実行に専念する（findBookByIdUseCase と同様、try/catch は使わない）。
export class AddBookUseCase implements AddBookUseCaseInterface {
  constructor(
    private readonly bookRepository: BookRepositoryInterface,
    private readonly idGenerator: IdGeneratorInterface,
  ) {}

  async execute(request: AddBookRequestDto): Promise<AddBookResponseDto> {
    const id = this.idGenerator.generate();
    const newBook = new Book(id, request.title, true, new Date(), new Date());
    const createdBook = await this.bookRepository.create(newBook);
    return {
      id: createdBook.id,
      title: createdBook.title,
      isAvailable: createdBook.isAvailable,
      createdAt: createdBook.createdAt,
      updatedAt: createdBook.updatedAt,
    };
  }
}
