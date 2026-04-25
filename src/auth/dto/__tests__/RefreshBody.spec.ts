import { validate } from 'class-validator';
import { RefreshBody } from '../RefreshBody';

describe('RefreshBody validation', () => {
  it('should fail if refreshToken is missing', async () => {
    const dto = new RefreshBody();
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some((e) => e.property === 'refreshToken')).toBe(true);
  });

  it('should fail if refreshToken is empty', async () => {
    const dto = new RefreshBody();
    dto.refreshToken = '';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'refreshToken')).toBe(true);
  });

  it('should fail if refreshToken is not a string', async () => {
    const dto = new RefreshBody();
    // @ts-expect-error refreshToken should be a string
    dto.refreshToken = 12345;
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'refreshToken')).toBe(true);
  });

  it('should pass with valid refreshToken', async () => {
    const dto = new RefreshBody();
    dto.refreshToken = 'some-valid-refresh-token';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
