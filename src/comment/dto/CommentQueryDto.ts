import { IsUUID, IsNotEmpty } from 'class-validator';

export class CommentQueryDto {
  @IsUUID()
  @IsNotEmpty()
  articleId: string;
}
