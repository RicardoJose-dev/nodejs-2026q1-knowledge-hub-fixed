import { IsString, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @IsUUID()
  @ApiProperty()
  @IsNotEmpty()
  articleId: string;

  @IsUUID()
  @ApiProperty()
  @IsOptional()
  authorId?: string;
}
