import { IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Task } from './types';

export class AnalyzeArticleDto {
  @IsOptional()
  @IsIn([Task.Bugs, Task.Explain, Task.Optimize, Task.Review])
  @ApiProperty({ required: false })
  task?: Task;
}
