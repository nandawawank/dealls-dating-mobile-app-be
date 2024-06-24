import { BaseModel } from 'src/model/base-model';
import { Pagination } from 'src/utils/pagination';
import { AuthenticationRepository } from './authentication.repository';
import { Postgres } from 'src/config/database/postgres';
import { Users } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticationRepositoryImpl implements AuthenticationRepository {
  constructor(private readonly prisma: Postgres) {}
  async checkUsername(username: string): Promise<BaseModel<Users, Pagination>> {
    const result = await this.prisma.users.findFirst({
      where: { username },
    });
    return {
      data: result,
      pagination: null,
    };
  }
}
