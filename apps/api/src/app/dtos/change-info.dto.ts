import { IsEmail, IsOptional, IsString } from 'class-validator';

export class ChangeInfoDto {
  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  displayName?: string;
}
