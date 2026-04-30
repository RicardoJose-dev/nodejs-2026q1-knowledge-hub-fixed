import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from './types';

export class SummarizeArticleDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  maxLength?: MaxLength;
}
