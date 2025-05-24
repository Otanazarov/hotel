import { PartialType } from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';
import { CreateAdminDto } from './create-admin.dto';
import { IsName } from 'src/common/dtos/name.dto';
import { IsPassword } from 'src/common/dtos/password.dto';

export class UpdateAdminDto  {
  @IsName(false)
  name?: string;
  
  @IsPassword(false)
  newPassword?: string;

  @IsPassword(false)
  oldPassword?: string;
}
