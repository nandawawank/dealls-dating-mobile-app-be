import { Swipes, Users } from '@prisma/client';
import { ProfileDto } from 'src/model/profiles.dto';
import { SwipesDto } from 'src/model/swipes.dto';
import { Pagination } from 'src/utils/pagination';
import { ResponseJson } from 'src/utils/response';

export abstract class SwipesService {
  abstract findProfile(
    data: ProfileDto,
    userId: string,
  ): Promise<ResponseJson<Users[], string[], Pagination>>;

  abstract swipeProfile(
    swipe: SwipesDto,
    userId: string,
  ): Promise<ResponseJson<Swipes, string[], Pagination>>;
}
