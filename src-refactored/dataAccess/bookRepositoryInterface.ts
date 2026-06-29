import { Book } from "../../src-layered/generated/prisma";

export interface BookRepositoryInterface {
    create(title: string): Promise<Book>;
    findById(id: string): Promise<Book | null>;
}