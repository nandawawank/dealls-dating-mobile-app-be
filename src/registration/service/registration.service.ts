import { PremiumPurchases, Users } from '@prisma/client';
import {
  PurchasePremiumDto,
  RegistrationCreateDto,
} from 'src/model/registration.dto';
import { Pagination } from 'src/utils/pagination';
import { ResponseJson } from 'src/utils/response';

export abstract class RegistrationService {
  abstract registrationUser(
    data: RegistrationCreateDto,
  ): Promise<ResponseJson<Users, string[], Pagination>>;
  abstract purchasePremium(
    purchase: PurchasePremiumDto,
    userId: string,
  ): Promise<ResponseJson<PremiumPurchases, string[], Pagination>>;
  abstract checkUserExist(
    email: string,
  ): Promise<ResponseJson<boolean, string[], Pagination>>;
}
