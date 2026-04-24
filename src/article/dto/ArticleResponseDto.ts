import { Transform, Expose } from 'class-transformer';

export class ArticleResponseDto {
  @Expose()
  @Transform(({ value }) => (value instanceof Date ? value.getTime() : value))
  createdAt: number;

  @Expose()
  @Transform(({ value }) => (value instanceof Date ? value.getTime() : value))
  updatedAt: number;

  @Expose()
  id: string;

  @Expose()
  status: string;

  @Expose()
  title: string;

  @Expose()
  categoryId: string;

  @Expose()
  content: string;

  @Expose()
  authorId: string;

  @Expose()
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((tag) => tag.name) : [],
  )
  tags?: string[];
}
