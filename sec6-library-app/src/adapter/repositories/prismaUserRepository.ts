import { PrismaClient } from '@prisma/client';
import { User } from '../../domain/entities/user';
import { UserRepositoryInterface } from '../../domain/repositories/userRepositoryInterface';

export class PrismaUserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaClient) {}

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        // Add propaties
      },
    });

    return new User(
      // Add propaties
    );
  }

  async findById(id: string): Promise<User | null> {
    const foundUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!foundUser) return null;

    return new User(
      // Add propaties
    );
  }
}
