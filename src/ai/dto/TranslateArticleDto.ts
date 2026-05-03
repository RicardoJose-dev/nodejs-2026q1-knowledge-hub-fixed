import { IsOptional, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TranslateArticleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: true })
  targetLanguage: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  sourceLanguage?: string;
}
