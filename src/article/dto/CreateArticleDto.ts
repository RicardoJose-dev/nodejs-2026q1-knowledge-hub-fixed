import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsArray,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ArticleStatus } from '../types';

export class CreateArticleDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @IsEnum(ArticleStatus)
  @ApiProperty()
  @IsOptional()
  status?: ArticleStatus;

  @IsUUID()
  @ApiProperty()
  @IsOptional()
  authorId?: string;

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
