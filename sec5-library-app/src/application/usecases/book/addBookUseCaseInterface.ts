import { AddBookRequestDto } from '../../dtos/book/addBookRequestDto';
import { AddBookResponseDto } from '../../dtos/book/addBookResponseDto';

export interface AddBookUseCaseInterface {
  execute(requestDto: AddBookRequestDto): Promise<AddBookResponseDto>;
}
