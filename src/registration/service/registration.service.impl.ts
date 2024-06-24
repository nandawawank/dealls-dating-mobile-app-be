import { Pagination } from 'src/utils/pagination';
import { ResponseJson } from 'src/utils/response';
import { RegistrationService } from './registration.service';
import { PackageType, PremiumPurchases, Prisma, Users } from '@prisma/client';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import {
  PurchasePremiumDto,
  RegistrationCreateDto,
} from 'src/model/registration.dto';
import { hashPassword } from 'src/utils/hasing';
import { RegistrationRepository } from '../repository/registration.repository';

@Injectable()
export class RegistrationServiceImpl implements RegistrationService {
  constructor(private readonly repository: RegistrationRepository) {}
  async registrationUser(
    data: RegistrationCreateDto,
  ): Promise<ResponseJson<Users, string[], Pagination>> {
    try {
      const userExist = await this.checkUserExist(data.email);
      if (userExist.code === HttpStatus.OK && userExist.data === true) {
        throw new NotAcceptableException({
          code: HttpStatus.NOT_ACCEPTABLE,
          message: 'not acceptable',
          error: ['user already exist'],
        });
      }

      const newUser: Prisma.UsersCreateInput = {
        username: data.username,
        email: data.email,
        password: await hashPassword(
          Buffer.from(data.password, 'base64').toString('ascii'),
        ),
        isPremium: data.premium?.isPremium,
        createdAt: Date.now(),
      };

      if (!data.premium?.isPremium) {
        await this.repository.registrationUser(newUser);
      } else {
        const newUserPremium: Prisma.PremiumPurchasesCreateInput = {
          packageType: PackageType[data.premium.premiumType],
          createdAt: Date.now(),
          Users: {
            connect: { id: '' },
          },
        };

        await this.repository.registrationUserPremium(newUser, newUserPremium);
      }

      return {
        code: HttpStatus.CREATED,
        message: 'craeted',
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

  async purchasePremium(
    purchase: PurchasePremiumDto,
    userId: string,
  ): Promise<ResponseJson<PremiumPurchases, string[], Pagination>> {
    try {
      const purchaseData: Prisma.PremiumPurchasesCreateInput = {
        packageType: PackageType[purchase.packageType],
        createdAt: Date.now(),
        Users: {
          connect: { id: userId },
        },
      };

      await this.repository.purchasePremium(purchaseData);
      return {
        code: HttpStatus.OK,
        message: 'ok',
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'internal server error',
      });
    }
  }

  async checkUserExist(
    email: string,
  ): Promise<ResponseJson<boolean, string[], Pagination>> {
    try {
      const userExist = await this.repository.checkUserByEmail(email);

      return {
        code: HttpStatus.OK,
        message: 'ok',
        data: !userExist.data ? false : true,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'internal server error',
      });
    }
  }
}
