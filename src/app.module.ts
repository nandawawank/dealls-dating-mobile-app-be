import { Module } from '@nestjs/common';
import { RegistrationModule } from './registration/registration.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exception/http.exception.filter';
import { AuthenticationModule } from './authentication/authentication.module';
import { SwipesModule } from './swipes/swipes.module';

@Module({
  imports: [RegistrationModule, AuthenticationModule, SwipesModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
