import { validate } from 'class-validator';
import { UpdateCategorydDto } from '../UpdateCategoryDto';

describe('UpdateCategorydDto validation', () => {
  it('should pass when all fields are missing (all optional)', async () => {
    const dto = new UpdateCategorydDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if name is not a string', async () => {
    const dto = new UpdateCategorydDto();
    // @ts-expect-error name should a string
    dto.name = 123;
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('should fail if description is not a string', async () => {
    const dto = new UpdateCategorydDto();
    // @ts-expect-error description should be a string
    dto.description = { text: 'desc' };
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'description')).toBe(true);
  });

  it('should pass with valid payload (all fields)', async () => {
    const dto = new UpdateCategorydDto();
    dto.name = 'Updated Name';
    dto.description = 'Updated Description';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass with only one field set', async () => {
    const dto = new UpdateCategorydDto();
    dto.name = 'Only Name';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);

    const dto2 = new UpdateCategorydDto();
    dto2.description = 'Only Description';
    const errors2 = await validate(dto2);
    expect(errors2.length).toBe(0);
  });
});
