import { IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MaxLength } from './types';

export class SummarizeArticleDto {
  @IsOptional()
  @IsIn([MaxLength.Short, MaxLength.Medium, MaxLength.Detailed])
  @ApiProperty({ required: false })
  maxLength?: MaxLength;
}
