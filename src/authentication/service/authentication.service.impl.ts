import { LoginData } from 'src/model/authentication';
import { LoginDto } from 'src/model/authentication.dto';
import { Pagination } from 'src/utils/pagination';
import { ResponseJson } from 'src/utils/response';
import { AuhtenticationService } from './authentication.service';
import { AuthenticationRepository } from '../repository/authentication.repository';
import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { comparePassword } from 'src/utils/hasing';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuhtenticationServiceImpl implements AuhtenticationService {
  constructor(
    private readonly repository: AuthenticationRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    data: LoginDto,
  ): Promise<ResponseJson<LoginData, string[], Pagination>> {
    try {
      const existUser = await this.repository.checkUsername(data.username);
      if (!existUser.data) {
        return {
          code: HttpStatus.UNAUTHORIZED,
          message: 'unauthorized',
          error: ['username doesnt exist'],
        };
      }

      if (
        !comparePassword(
          Buffer.from(data.password, 'base64').toString('ascii'),
          existUser.data.password,
        )
      ) {
        return {
          code: HttpStatus.UNAUTHORIZED,
          message: 'unauthorized',
          error: ['username or password wrong'],
        };
      }

      const payloadAccessToken = {
        sub: existUser.data.id,
      };

      const accessToken = await this.jwtService.signAsync(payloadAccessToken);

      return {
        code: HttpStatus.OK,
        message: 'ok',
        data: {
          accessToken: accessToken,
        },
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
