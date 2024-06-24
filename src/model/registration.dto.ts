import { PackageType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBase64,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

enum PremiumTypeEnum {
  NO_SWIPE_QUOTA = 'NO_SWIPE_QUOTA',
  VERIFIED_LABEL = 'VERIFIED_LABEL',
}

export class PremiumType {
  @IsOptional()
  @IsBoolean()
  isPremium?: boolean;

  @IsEnum(PremiumTypeEnum, { each: true })
  @IsOptional()
  premiumType?: PremiumTypeEnum;
}

export class RegistrationCreateDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsBase64()
  @IsNotEmpty()
  password: string;

  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => PremiumType)
  premium?: PremiumType;
}

export class PurchasePremiumDto {
  @IsEnum(PackageType, { each: true })
  packageType: PackageType;
}
