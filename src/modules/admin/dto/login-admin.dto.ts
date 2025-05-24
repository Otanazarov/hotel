import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginAdminDto {
  @ApiProperty({ example: 'string' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'string' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
