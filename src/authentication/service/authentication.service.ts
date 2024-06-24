import { LoginData } from 'src/model/authentication';
import { LoginDto } from 'src/model/authentication.dto';
import { Pagination } from 'src/utils/pagination';
import { ResponseJson } from 'src/utils/response';

export abstract class AuhtenticationService {
  abstract login(
    data: LoginDto,
  ): Promise<ResponseJson<LoginData, string[], Pagination>>;
}
