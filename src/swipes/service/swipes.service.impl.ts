import { Pagination } from 'src/utils/pagination';
import { ResponseJson } from 'src/utils/response';
import { SwipesService } from './swipes.service';
import { Deriction, Prisma, Swipes, Users } from '@prisma/client';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { SwipesRepository } from '../repository/swipes.repository';
import { ProfileDto } from 'src/model/profiles.dto';
import { ProfileCondition } from 'src/model/profiles';
import { SwipesDto } from 'src/model/swipes.dto';

@Injectable()
export class SwipesServiceImpl implements SwipesService {
  constructor(private readonly repository: SwipesRepository) {}
  async findProfile(
    data: ProfileDto,
    userId: string,
  ): Promise<ResponseJson<Users[], string[], Pagination>> {
    try {
      const condition: ProfileCondition = {
        userId: userId,
        username: data.username,
        currentPage: data.currentPage ?? 1,
        perPage: data.perPage ?? 10,
      };
      const profile = await this.repository.findProfile(condition);

      const profileData = profile.data.map((row) => {
        delete row.password;
        delete row.createdAt;
        delete row.updatedAt;

        const isVerified = row.PremiumPurchases.map((premium) =>
          premium.packageType === 'VERIFIED_LABEL' ? true : false,
        ).at(-1);
        delete row.PremiumPurchases;

        return {
          ...row,
          verified: isVerified,
        };
      });

      return {
        code: HttpStatus.OK,
        message: 'ok',
        data: profileData,
        pagination: profile.pagination,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'internal server error',
      });
    }
  }

  async swipeProfile(
    swipe: SwipesDto,
    userId: string,
  ): Promise<ResponseJson<Swipes, string[], Pagination>> {
    try {
      const userExist = await this.repository.checkUserById(swipe.profileId);
      if (!userExist.data) {
        throw new NotFoundException({
          code: HttpStatus.NOT_FOUND,
          message: 'not found',
        });
      }

      const swipeQuota = await this.repository.checkUserQuota(userId);
      if (!swipeQuota.data) {
        throw new NotAcceptableException({
          code: HttpStatus.NOT_ACCEPTABLE,
          message: 'not acceptable',
        });
      }

      const data: Prisma.SwipesCreateInput = {
        swiperId: userId,
        profileId: swipe.profileId,
        deriction: Deriction[swipe.deriction],
        createdAt: Date.now(),
      };
      await this.repository.createSwipes(data);

      return {
        code: HttpStatus.CREATED,
        message: 'created',
      };
    } catch (error) {
      console.error(error);
      if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException({
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'internal server error',
        });
      }

      throw error;
    }
  }
}
