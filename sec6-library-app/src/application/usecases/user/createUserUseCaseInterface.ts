import { CreateUserRequestDto } from '../../dtos/user/createUserRequestDto';
import { CreateUserResponseDto } from '../../dtos/user/createUserResponseDto';

export interface CreateUserUseCaseInterface {
  execute(requestDto: CreateUserRequestDto): Promise<CreateUserResponseDto>;
}
