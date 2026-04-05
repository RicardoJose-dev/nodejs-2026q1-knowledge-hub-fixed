import { IsString, IsOptional, IsUUID, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ArticleStatus } from '../types';

export class UpdateArticleDto {
  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  title?: string;

  @IsString()
  @ApiProperty({ required: false })
  @IsOptional()
  content?: string;

  @IsEnum(ArticleStatus)
  @ApiProperty({ required: false })
  @IsOptional()
  status?: ArticleStatus;

  @IsUUID()
  @ApiProperty({ required: false })
  @IsOptional()
  categoryId?: string;

  @IsArray()
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}
