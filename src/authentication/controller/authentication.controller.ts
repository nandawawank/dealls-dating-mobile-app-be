import { Body, Controller, Post } from '@nestjs/common';
import { AuhtenticationService } from '../service/authentication.service';
import { LoginDto } from 'src/model/authentication.dto';
import { ResponseJson } from 'src/utils/response';
import { LoginData } from 'src/model/authentication';
import { Pagination } from 'src/utils/pagination';

@Controller('/api/v1/authentication')
export class AuthenticationController {
  constructor(private readonly service: AuhtenticationService) {}

  @Post('/login')
  async login(
    @Body() payload: LoginDto,
  ): Promise<ResponseJson<LoginData, string[], Pagination>> {
    return await this.service.login(payload);
  }
}
