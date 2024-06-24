import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProfileDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsNumber()
  @IsOptional()
  currentPage: number;

  @IsNumber()
  @IsOptional()
  perPage: number;
}
