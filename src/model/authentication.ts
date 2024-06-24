import { IsString } from 'class-validator';

export class LoginData {
  @IsString()
  accessToken: string;
}

export class LogoutData {
  @IsString()
  userId: string;
}
