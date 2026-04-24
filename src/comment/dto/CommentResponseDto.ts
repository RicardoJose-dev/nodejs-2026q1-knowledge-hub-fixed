import { Transform, Expose } from 'class-transformer';

export class CommentResponseDto {
  @Expose()
  @Transform(({ value }) => (value instanceof Date ? value.getTime() : value))
  createdAt: number;

  @Expose()
  content: string;

  @Expose()
  authorId: string;

  @Expose()
  id: string;

  @Expose()
  articleId: string;
}
