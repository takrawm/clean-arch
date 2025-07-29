import { Book } from '@prisma/client';
import { BookRepositoryInterface } from '../dataAccess/bookRepositoryInterface';
import { BookService } from './bookService';

const mockBookRepository: jest.Mocked<BookRepositoryInterface> = {
  create: jest.fn(),
  findById: jest.fn(),
};

describe('BookService', () => {
  let bookService: BookService;

  beforeEach(() => {
    bookService = new BookService(mockBookRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('書籍の登録が成功する', async () => {
    const newBook: Book = {
      id: '1',
      title: 'Test',
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockBookRepository.create.mockResolvedValue(newBook);

    const result = await bookService.add('Test book');

    expect(result).toEqual(newBook);
    expect(mockBookRepository.create).toHaveBeenCalledWith('Test book');
  });

  it('書籍の取得が成功する', async () => {
    const book: Book = {
      id: '1',
      title: 'Test',
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockBookRepository.findById.mockResolvedValue(book);

    const result = await bookService.findById('1');

    expect(result).toEqual(book);
    expect(mockBookRepository.findById).toHaveBeenCalledWith('1');
  });
});
