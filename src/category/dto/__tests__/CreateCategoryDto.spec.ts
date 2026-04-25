import { validate } from 'class-validator';
import { CreateCategoryDto } from '../CreateCategoryDto';

describe('CreateCategoryDto validation', () => {
  it('should fail if required fields are missing', async () => {
    const dto = new CreateCategoryDto();
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const properties = errors.map((e) => e.property);
    expect(properties).toContain('name');
    expect(properties).toContain('description');
  });

  it('should fail if name is empty', async () => {
    const dto = new CreateCategoryDto();
    dto.name = '';
    dto.description = 'A description';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('should fail if description is empty', async () => {
    const dto = new CreateCategoryDto();
    dto.name = 'Category Name';
    dto.description = '';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'description')).toBe(true);
  });

  it('should fail if name is not a string', async () => {
    const dto = new CreateCategoryDto();
    // @ts-expect-error name should be a string
    dto.name = 123;
    dto.description = 'A description';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('should fail if description is not a string', async () => {
    const dto = new CreateCategoryDto();
    dto.name = 'Category Name';
    // @ts-expect-error description should be a string
    dto.description = 123;
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'description')).toBe(true);
  });

  it('should pass with valid payload', async () => {
    const dto = new CreateCategoryDto();
    dto.name = 'Category Name';
    dto.description = 'A description';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
