import { IsString, IsOptional, IsUUID, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ArticleStatus } from '../types';

export class UpdateArticleDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  title?: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  content?: string;

  @IsEnum(ArticleStatus)
  @IsOptional()
  @ApiProperty()
  status?: ArticleStatus;

  @IsUUID()
  @ApiProperty()
  @IsOptional()
  categoryId?: string;

  @IsArray()
  @ApiProperty()
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}
