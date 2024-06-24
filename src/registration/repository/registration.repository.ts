import { PremiumPurchases, Prisma, Users } from '@prisma/client';
import { BaseModel } from 'src/model/base-model';
import { Pagination } from 'src/utils/pagination';

export abstract class RegistrationRepository {
  abstract registrationUser(
    user: Prisma.UsersCreateInput,
  ): Promise<BaseModel<Users, Pagination>>;
  abstract registrationUserPremium(
    user: Prisma.UsersCreateInput,
    premiumPuchase: Prisma.PremiumPurchasesCreateInput,
  ): Promise<BaseModel<PremiumPurchases, Pagination>>;
  abstract purchasePremium(
    purchase: Prisma.PremiumPurchasesCreateInput,
  ): Promise<BaseModel<PremiumPurchases, Pagination>>;
  abstract checkUserByEmail(
    email: string,
  ): Promise<BaseModel<Users, Pagination>>;
}
