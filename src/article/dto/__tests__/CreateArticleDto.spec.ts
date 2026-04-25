import { validate } from 'class-validator';
import { CreateArticleDto } from '../CreateArticleDto';
import { ArticleStatus } from 'src/db/prisma/client/client';

describe('CreateArticleDto validation', () => {
  it('should fail if required fields are missing', async () => {
    const dto = new CreateArticleDto();
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const properties = errors.map((e) => e.property);
    expect(properties).toContain('title');
    expect(properties).toContain('content');
  });

  it('should fail if title is empty', async () => {
    const dto = new CreateArticleDto();
    dto.title = '';
    dto.content = 'Some content';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'title')).toBe(true);
  });

  it('should fail if content is empty', async () => {
    const dto = new CreateArticleDto();
    dto.title = 'Title';
    dto.content = '';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'content')).toBe(true);
  });

  it('should fail if status is not a valid enum value', async () => {
    const dto = new CreateArticleDto();
    dto.title = 'Title';
    dto.content = 'Content';
    // @ts-expect-error should be value of ArticleStatus
    dto.status = 'not-a-valid-status';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'status')).toBe(true);
  });

  it('should fail if authorId is not a valid UUID', async () => {
    const dto = new CreateArticleDto();
    dto.title = 'Title';
    dto.content = 'Content';
    dto.authorId = 'not-a-uuid';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'authorId')).toBe(true);
  });

  it('should fail if categoryId is not a valid UUID', async () => {
    const dto = new CreateArticleDto();
    dto.title = 'Title';
    dto.content = 'Content';
    dto.categoryId = 'not-a-uuid';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'categoryId')).toBe(true);
  });

  it('should fail if tags is not an array', async () => {
    const dto = new CreateArticleDto();
    dto.title = 'Title';
    dto.content = 'Content';
    // @ts-expect-error tags should be a list of strings
    dto.tags = 'not-an-array';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'tags')).toBe(true);
  });

  it('should fail if tags contains non-string values', async () => {
    const dto = new CreateArticleDto();
    dto.title = 'Title';
    dto.content = 'Content';
    // @ts-expect-error tags should be a list of strings
    dto.tags = ['tag1', 123];
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'tags')).toBe(true);
  });

  it('should pass with valid payload (all fields)', async () => {
    const dto = new CreateArticleDto();
    dto.title = 'Title';
    dto.content = 'Content';
    dto.status = ArticleStatus.published;
    dto.authorId = '123e4567-e89b-12d3-a456-426614174000';
    dto.categoryId = '123e4567-e89b-12d3-a456-426614174001';
    dto.tags = ['tech', 'news'];
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass with only required fields', async () => {
    const dto = new CreateArticleDto();
    dto.title = 'Title';
    dto.content = 'Content';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
