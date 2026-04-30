import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Task } from './types';

export class AnalyzeArticleDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  task?: Task;
}
