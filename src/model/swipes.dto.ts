import { IsEnum, IsString } from 'class-validator';

export enum Deriction {
  LEFT,
  RIGHT,
}
export class SwipesDto {
  @IsString()
  profileId: string;

  @IsEnum(Deriction)
  deriction: Deriction;
}
