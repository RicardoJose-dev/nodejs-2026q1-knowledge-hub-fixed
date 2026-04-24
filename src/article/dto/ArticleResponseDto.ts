import { Transform } from 'class-transformer';

export class ArticleResponseDto {
  @Transform(({ value }) => (value instanceof Date ? value.getTime() : value))
  createdAt: number;

  @Transform(({ value }) => (value instanceof Date ? value.getTime() : value))
  updatedAt: number;

  id: string;
  status: string;
  title: string;
  categoryId: string;
  content: string;
  authorId: string;

  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((tag) => tag.name) : [],
  )
  tags?: string[];
}
