import { Prisma, Swipes, Users } from '@prisma/client';
import { BaseModel } from 'src/model/base-model';
import { SwipesRepository } from './swipes.repository';
import { Postgres } from 'src/config/database/postgres';
import { Injectable } from '@nestjs/common';
import { Pagination } from 'src/utils/pagination';
import { ProfileCondition } from 'src/model/profiles';

@Injectable()
export class SwipesRepositoryImpl implements SwipesRepository {
  constructor(private readonly prisma: Postgres) {}
  async findProfile(condition: ProfileCondition): Promise<
    BaseModel<
      Prisma.UsersGetPayload<{
        include: { PremiumPurchases: { select: { packageType: true } } };
      }>[],
      Pagination
    >
  > {
    const swipeProfile: { profileId: string }[] = await this.prisma
      .$queryRaw`select "profileId" from swipes
      where "swiperId"::text =${condition.userId}
      and date(to_timestamp("createdAt" / 1000)) = Date(now());`;

    const profile = await this.prisma.users.findMany({
      where: {
        username: {
          contains: condition.username,
          mode: 'insensitive',
        },
        id: {
          not: condition.userId,
          notIn: swipeProfile.map((row) => row.profileId),
        },
      },
      include: {
        PremiumPurchases: {
          select: {
            packageType: true,
          },
        },
      },
      take: condition.perPage,
      skip: (condition.currentPage - 1) * condition.perPage,
    });

    const pagination: Pagination = {
      currentPage: condition.currentPage,
      perPage: condition.perPage,
    };

    return { data: profile, pagination: pagination };
  }

  async checkUserById(id: string): Promise<BaseModel<Users, Pagination>> {
    const data = await this.prisma.users.findFirst({ where: { id: id } });
    return { data: data, pagination: null };
  }

  async checkUserQuota(id: string): Promise<BaseModel<boolean, Pagination>> {
    const data = await this.prisma
      .$queryRaw`select count(*) as swipes from swipes where "swiperId"::text = ${id} 
      and date(to_timestamp("createdAt" / 1000)) = Date(now());;`;

    return {
      data: Number(data[0].swipes) > 10 ? false : true,
      pagination: null,
    };
  }

  async createSwipes(
    data: Prisma.SwipesCreateInput,
  ): Promise<BaseModel<Swipes, Pagination>> {
    await this.prisma.swipes.create({ data: data });
    return { data: null, pagination: null };
  }
}
