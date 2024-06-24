import { Prisma, Swipes, Users } from '@prisma/client';
import { BaseModel } from 'src/model/base-model';
import { ProfileCondition } from 'src/model/profiles';
import { Pagination } from 'src/utils/pagination';

export abstract class SwipesRepository {
  abstract findProfile(condition: ProfileCondition): Promise<
    BaseModel<
      Prisma.UsersGetPayload<{
        include: { PremiumPurchases: { select: { packageType: true } } };
      }>[],
      Pagination
    >
  >;
  abstract checkUserById(id: string): Promise<BaseModel<Users, Pagination>>;
  abstract checkUserQuota(id: string): Promise<BaseModel<boolean, Pagination>>;
  abstract createSwipes(
    data: Prisma.SwipesCreateInput,
  ): Promise<BaseModel<Swipes, Pagination>>;
}
