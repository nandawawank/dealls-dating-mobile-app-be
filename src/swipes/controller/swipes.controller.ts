import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ResponseJson } from 'src/utils/response';
import { Pagination } from 'src/utils/pagination';
import { Swipes, Users } from '@prisma/client';
import { SwipesService } from '../service/swipes.service';
import { ProfileDto } from 'src/model/profiles.dto';
import { AuthenticationGuard } from 'src/authentication/authentication.guard';
import { SwipesDto } from 'src/model/swipes.dto';

@Controller('/api/v1/swipes')
export class SwipesController {
  constructor(private readonly service: SwipesService) {}

  @Get()
  @UseGuards(AuthenticationGuard)
  async registrationUser(
    @Query() query: ProfileDto,
    @Req() request,
  ): Promise<ResponseJson<Users[], string[], Pagination>> {
    return await this.service.findProfile(query, request.user.sub);
  }

  @Post()
  @UseGuards(AuthenticationGuard)
  async swipeUser(
    @Body() payload: SwipesDto,
    @Req() request,
  ): Promise<ResponseJson<Swipes, string[], Pagination>> {
    return await this.service.swipeProfile(payload, request.user.sub);
  }
}
