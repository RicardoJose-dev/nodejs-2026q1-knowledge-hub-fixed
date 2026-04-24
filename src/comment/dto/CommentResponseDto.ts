import { Transform } from 'class-transformer';

export class CommentResponseDto {
  @Transform(({ value }) => (value instanceof Date ? value.getTime() : value))
  createdAt: number;

  content: string;
  authorId: string;
  id: string;
  articleId: string;
}
