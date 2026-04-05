import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategorydDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  name?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  description?: string;
}
