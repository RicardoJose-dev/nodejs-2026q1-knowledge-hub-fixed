import { plainToInstance } from 'class-transformer';
import { CommentResponseDto } from '../CommentResponseDto';

describe('CommentResponseDto', () => {
  it('should transform createdAt from Date to timestamp', () => {
    const date = new Date('2023-01-01T00:00:00Z');
    const plain = {
      createdAt: date,
      content: 'test',
      authorId: 'author1',
      id: 'id1',
      articleId: 'article1',
    };

    const dto = plainToInstance(CommentResponseDto, plain, {
      excludeExtraneousValues: true,
    });
    expect(dto.createdAt).toBe(date.getTime());
  });

  it('should keep createdAt as number if not a Date', () => {
    const timestamp = 1680000000000;
    const plain = {
      createdAt: timestamp,
      content: 'test',
      authorId: 'author1',
      id: 'id1',
      articleId: 'article1',
    };

    const dto = plainToInstance(CommentResponseDto, plain, {
      excludeExtraneousValues: true,
    });
    expect(dto.createdAt).toBe(timestamp);
  });
});
