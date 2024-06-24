import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ResponseJson } from 'src/utils/response';
import { Pagination } from 'src/utils/pagination';
import { PremiumPurchases, Users } from '@prisma/client';
import { RegistrationService } from '../service/registration.service';
import {
  PurchasePremiumDto,
  RegistrationCreateDto,
} from 'src/model/registration.dto';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';

@Controller('/api/v1/registration')
export class RegistrationController {
  constructor(private readonly service: RegistrationService) {}

  @Post()
  async registrationUser(
    @Body() payload: RegistrationCreateDto,
  ): Promise<ResponseJson<Users, string[], Pagination>> {
    return await this.service.registrationUser(payload);
  }

  @Post('/premium-package')
  @UseGuards(AuthenticationGuard)
  async purchasePremium(
    @Body() payload: PurchasePremiumDto,
    @Req() request,
  ): Promise<ResponseJson<PremiumPurchases, string[], Pagination>> {
    return await this.service.purchasePremium(payload, request.user.sub);
  }
}
