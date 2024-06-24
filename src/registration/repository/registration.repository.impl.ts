import { PremiumPurchases, Prisma, Users } from '@prisma/client';
import { BaseModel } from 'src/model/base-model';
import { RegistrationRepository } from './registration.repository';
import { Postgres } from 'src/config/database/postgres';
import { Injectable } from '@nestjs/common';
import { Pagination } from 'src/utils/pagination';

@Injectable()
export class RegistrationRepositoryImpl implements RegistrationRepository {
  constructor(private readonly prisma: Postgres) {}
  async registrationUser(
    user: Prisma.UsersCreateInput,
  ): Promise<BaseModel<Users, Pagination>> {
    await this.prisma.users.create({ data: user });
    return { data: null, pagination: null };
  }

  async registrationUserPremium(
    user: Prisma.UsersCreateInput,
    premiumPuchase: Prisma.PremiumPurchasesCreateInput,
  ): Promise<BaseModel<PremiumPurchases, Pagination>> {
    await this.prisma.$transaction(async (x) => {
      const { id } = await x.users.create({ data: user });
      await x.premiumPurchases.create({
        data: { ...premiumPuchase, Users: { connect: { id } } },
      });
    });
    return { data: null, pagination: null };
  }

  async purchasePremium(
    purchase: Prisma.PremiumPurchasesCreateInput,
  ): Promise<BaseModel<PremiumPurchases, Pagination>> {
    await Promise.all([
      await this.prisma.premiumPurchases.create({ data: purchase }),
      await this.prisma.users.update({
        data: { isPremium: true },
        where: { id: purchase.Users.connect.id },
      }),
    ]);

    return { data: null, pagination: null };
  }

  async checkUserByEmail(email: string): Promise<BaseModel<Users, Pagination>> {
    const userExist = await this.prisma.users.findFirst({
      where: { email },
    });

    return { data: userExist, pagination: null };
  }
}
