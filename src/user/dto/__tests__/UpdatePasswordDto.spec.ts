import { validate } from 'class-validator';
import { UpdatePasswordDto } from '../UpdatePasswordDto';

describe('UpdatePasswordDto validation', () => {
  it('should fail if required fields are missing', async () => {
    const dto = new UpdatePasswordDto();
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const properties = errors.map((e) => e.property);
    expect(properties).toContain('oldPassword');
    expect(properties).toContain('newPassword');
  });

  it('should fail if oldPassword is empty', async () => {
    const dto = new UpdatePasswordDto();
    dto.oldPassword = '';
    dto.newPassword = 'newSecret';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'oldPassword')).toBe(true);
  });

  it('should fail if newPassword is empty', async () => {
    const dto = new UpdatePasswordDto();
    dto.oldPassword = 'oldSecret';
    dto.newPassword = '';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'newPassword')).toBe(true);
  });

  it('should pass with valid payload', async () => {
    const dto = new UpdatePasswordDto();
    dto.oldPassword = 'oldSecret';
    dto.newPassword = 'newSecret';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
