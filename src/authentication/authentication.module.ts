import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationRepository } from './repository/authentication.repository';
import { AuthenticationRepositoryImpl } from './repository/authentication.repository.impl';
import { AuhtenticationService } from './service/authentication.service';
import { AuhtenticationServiceImpl } from './service/authentication.service.impl';
import { Postgres } from 'src/config/database/postgres';
import { AuthenticationController } from './controller/authentication.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    Postgres,
    { provide: AuhtenticationService, useClass: AuhtenticationServiceImpl },
    {
      provide: AuthenticationRepository,
      useClass: AuthenticationRepositoryImpl,
    },
  ],
})
export class AuthenticationModule {}
