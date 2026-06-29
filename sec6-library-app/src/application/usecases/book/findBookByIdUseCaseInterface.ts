import { FindBookByIdRequestDto } from '../../dtos/book/findBookByIdRequestDto';
import { FindBookByIdResponseDto } from '../../dtos/book/findBookByIdResponseDto';

export interface FindBookByIdUseCaseInterface {
  execute(requestDto: FindBookByIdRequestDto): Promise<FindBookByIdResponseDto | null>;
}
