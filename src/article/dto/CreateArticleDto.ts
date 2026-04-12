import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsArray,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ArticleStatus } from 'src/db/prisma/client/client';

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
  @ApiProperty({ required: false })
  @IsOptional()
  status?: ArticleStatus;

  @IsUUID()
  @ApiProperty({ required: false })
  @IsOptional()
  authorId?: string;

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
