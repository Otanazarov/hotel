import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  Min,
} from 'class-validator';

export class CreateRoomDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Type(() => String)
  price: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  categoryId: number;

  @ApiProperty({ type: [String] })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @Transform((value) => {
    if(typeof value.value === 'string') { 
      return JSON.parse(value.value);
    } return value.value;
  })
  amenities: string[];
}
