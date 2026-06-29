import { BookRepositoryInterface } from "../dataAccess/bookRepositoryInterface";
import { Book } from "../../src-layered/generated/prisma";

export class BookService {
  constructor(private readonly bookRepository: BookRepositoryInterface) {
    this.bookRepository = bookRepository;
  }

  async add(title: string): Promise<Book> {
    return await this.bookRepository.create(title);
  }

  async findById(id: string): Promise<Book | null> {
    return await this.bookRepository.findById(id);
  }
}
