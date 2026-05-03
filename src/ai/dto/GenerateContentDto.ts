import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateContentDto {
  @IsString()
  @ApiProperty({ required: true })
  prompt: string;
}
