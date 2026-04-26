import { validate } from 'class-validator';
import { CreateCommentDto } from '../CreateCommentDto';

describe('CreateCommentDto validation', () => {
  it('should fail if required fields are missing', async () => {
    const dto = new CreateCommentDto();
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const properties = errors.map((e) => e.property);
    expect(properties).toContain('content');
    expect(properties).toContain('articleId');
  });

  it('should fail if content is empty', async () => {
    const dto = new CreateCommentDto();
    dto.content = '';
    dto.articleId = '123e4567-e89b-12d3-a456-426614174000';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'content')).toBe(true);
  });

  it('should fail if articleId is empty', async () => {
    const dto = new CreateCommentDto();
    dto.content = 'A comment';
    dto.articleId = '';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'articleId')).toBe(true);
  });

  it('should fail if articleId is not a UUID', async () => {
    const dto = new CreateCommentDto();
    dto.content = 'A comment';
    dto.articleId = 'not-a-uuid';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'articleId')).toBe(true);
  });

  it('should fail if authorId is not a UUID', async () => {
    const dto = new CreateCommentDto();
    dto.content = 'A comment';
    dto.articleId = '123e4567-e89b-12d3-a456-426614174000';
    dto.authorId = 'not-a-uuid';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'authorId')).toBe(true);
  });

  it('should pass with valid payload (authorId omitted)', async () => {
    const dto = new CreateCommentDto();
    dto.content = 'A comment';
    dto.articleId = '123e4567-e89b-12d3-a456-426614174000';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass with valid payload (authorId provided)', async () => {
    const dto = new CreateCommentDto();
    dto.content = 'A comment';
    dto.articleId = '123e4567-e89b-12d3-a456-426614174000';
    dto.authorId = '123e4567-e89b-12d3-a456-426614174001';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
