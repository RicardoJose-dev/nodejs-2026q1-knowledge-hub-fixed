import { IsOptional, IsString } from 'class-validator';
import { ArticleStatus } from '../types';

export class ArticleQueryDto {
  @IsOptional()
  @IsString()
  status?: ArticleStatus;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  tag?: string;
}
