import { Module } from '@nestjs/common';
import { Postgres } from 'src/config/database/postgres';
import { RegistrationController } from './controller/registration.controller';
import { RegistrationService } from './service/registration.service';
import { RegistrationServiceImpl } from './service/registration.service.impl';
import { RegistrationRepository } from './repository/registration.repository';
import { RegistrationRepositoryImpl } from './repository/registration.repository.impl';

@Module({
  controllers: [RegistrationController],
  providers: [
    Postgres,
    { provide: RegistrationService, useClass: RegistrationServiceImpl },
    { provide: RegistrationRepository, useClass: RegistrationRepositoryImpl },
  ],
})
export class RegistrationModule {}
