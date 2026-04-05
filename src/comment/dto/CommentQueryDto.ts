import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentQueryDto {
  @IsUUID()
  @ApiProperty()
  @IsNotEmpty()
  articleId: string;
}
