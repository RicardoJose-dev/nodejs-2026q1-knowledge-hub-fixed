import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategorydDto {
  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  name?: string;

  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  description?: string;
}
