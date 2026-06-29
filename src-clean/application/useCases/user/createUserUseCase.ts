import { UserRepositoryInterface } from '../../../domain/repositories/userRepositoryInterface';
import { User } from '../../../domain/entities/user';
import { CreateUserRequestDto } from '../../dtos/user/createUserRequestDto';
import { CreateUserResponseDto } from '../../dtos/user/createUserResponseDto';
import { CreateUserUseCaseInterface } from './createUserUseCaseInterface';

export class CreateUserUseCase implements CreateUserUseCaseInterface {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(requestDto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    // Implement usecase logic
  }
}
