import { validate } from 'class-validator';
import { CommentQueryDto } from '../CommentQueryDto';

describe('CommentQueryDto validation', () => {
  it('should fail if articleId is missing', async () => {
    const dto = new CommentQueryDto();
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === 'articleId')).toBe(true);
  });

  it('should fail if articleId is not a UUID', async () => {
    const dto = new CommentQueryDto();
    dto.articleId = 'not-a-uuid';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'articleId')).toBe(true);
  });

  it('should fail if articleId is empty', async () => {
    const dto = new CommentQueryDto();
    dto.articleId = '';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'articleId')).toBe(true);
  });

  it('should pass with a valid UUID', async () => {
    const dto = new CommentQueryDto();
    dto.articleId = '123e4567-e89b-12d3-a456-426614174000';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
