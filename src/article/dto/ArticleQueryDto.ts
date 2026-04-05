import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ArticleStatus } from '../types';

export class ArticleQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  status?: ArticleStatus;

  @IsOptional()
  @IsString()
  @ApiProperty()
  categoryId?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  tag?: string;
}
