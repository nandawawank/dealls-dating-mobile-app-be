import { Module } from '@nestjs/common';
import { SwipesController } from './controller/swipes.controller';
import { SwipesService } from './service/swipes.service';
import { SwipesServiceImpl } from './service/swipes.service.impl';
import { SwipesRepository } from './repository/swipes.repository';
import { SwipesRepositoryImpl } from './repository/swipes.repository.impl';
import { Postgres } from 'src/config/database/postgres';

@Module({
  controllers: [SwipesController],
  providers: [
    Postgres,
    { provide: SwipesService, useClass: SwipesServiceImpl },
    { provide: SwipesRepository, useClass: SwipesRepositoryImpl },
  ],
})
export class SwipesModule {}
