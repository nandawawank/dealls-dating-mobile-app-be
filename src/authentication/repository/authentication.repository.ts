import { Users } from '@prisma/client';
import { BaseModel } from 'src/model/base-model';
import { Pagination } from 'src/utils/pagination';

export abstract class AuthenticationRepository {
  abstract checkUsername(
    username: string,
  ): Promise<BaseModel<Users, Pagination>>;
}
