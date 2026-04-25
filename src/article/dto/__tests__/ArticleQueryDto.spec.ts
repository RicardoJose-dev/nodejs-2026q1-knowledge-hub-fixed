import { validate } from 'class-validator';
import { ArticleQueryDto } from '../ArticleQueryDto';

describe('ArticleQueryDto validation', () => {
  it('should pass when all fields are missing (all optional)', async () => {
    const dto = new ArticleQueryDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if status is not a string', async () => {
    const dto = new ArticleQueryDto();
    // @ts-expect-error status should be string
    dto.status = 123;
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'status')).toBe(true);
  });

  it('should fail if categoryId is not a string', async () => {
    const dto = new ArticleQueryDto();
    // @ts-expect-error categoryId should be a string not an object
    dto.categoryId = { id: 'cat1' };
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'categoryId')).toBe(true);
  });

  it('should fail if tag is not a string', async () => {
    const dto = new ArticleQueryDto();
    // @ts-expect-error should be a string not a list
    dto.tag = ['tag1', 'tag2'];
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'tag')).toBe(true);
  });

  it('should pass with valid string values', async () => {
    const dto = new ArticleQueryDto();
    dto.status = 'published';
    dto.categoryId = 'cat1';
    dto.tag = 'tech';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
