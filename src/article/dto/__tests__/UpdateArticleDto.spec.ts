import { validate } from 'class-validator';
import { UpdateArticleDto } from '../UpdateArticleDto';
import { ArticleStatus } from 'src/db/prisma/client/client';

describe('UpdateArticleDto validation', () => {
  it('should pass when all fields are missing (all optional)', async () => {
    const dto = new UpdateArticleDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if title is not a string', async () => {
    const dto = new UpdateArticleDto();
    // @ts-expect-error title should be a string
    dto.title = 123;
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'title')).toBe(true);
  });

  it('should fail if content is not a string', async () => {
    const dto = new UpdateArticleDto();
    // @ts-expect-error context should be a string
    dto.content = { text: 'content' };
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'content')).toBe(true);
  });

  it('should fail if status is not a valid enum value', async () => {
    const dto = new UpdateArticleDto();
    // @ts-expect-error status should be a valid value from ArticleStatus
    dto.status = 'not-a-valid-status';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'status')).toBe(true);
  });

  it('should fail if categoryId is not a valid UUID', async () => {
    const dto = new UpdateArticleDto();
    dto.categoryId = 'not-a-uuid';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'categoryId')).toBe(true);
  });

  it('should fail if tags is not an array', async () => {
    const dto = new UpdateArticleDto();
    // @ts-expect-error tags should be a list of strings
    dto.tags = 'not-an-array';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'tags')).toBe(true);
  });

  it('should fail if tags contains non-string values', async () => {
    const dto = new UpdateArticleDto();
    // @ts-expect-error tags should be a list of strings
    dto.tags = ['tag1', 123];
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'tags')).toBe(true);
  });

  it('should pass with valid payload (all fields)', async () => {
    const dto = new UpdateArticleDto();
    dto.title = 'Updated Title';
    dto.content = 'Updated Content';
    dto.status = ArticleStatus.published;
    dto.categoryId = '123e4567-e89b-12d3-a456-426614174000';
    dto.tags = ['tech', 'news'];
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
