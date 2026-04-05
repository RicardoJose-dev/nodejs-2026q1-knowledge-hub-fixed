import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ArticleStatus } from '../types';

export class ArticleQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  status?: ArticleStatus;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  categoryId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  tag?: string;
}
