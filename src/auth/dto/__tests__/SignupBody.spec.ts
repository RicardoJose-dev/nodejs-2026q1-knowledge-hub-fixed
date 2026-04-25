import { validate } from 'class-validator';
import { SignupBody } from '../SignupBody';

describe('SignupBody validation', () => {
  it('should fail if required fields are missing', async () => {
    const dto = new SignupBody();
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    const properties = errors.map((e) => e.property);
    expect(properties).toContain('login');
    expect(properties).toContain('password');
  });

  it('should fail if login is empty', async () => {
    const dto = new SignupBody();
    dto.login = '';
    dto.password = 'password123';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'login')).toBe(true);
  });

  it('should fail if password is empty', async () => {
    const dto = new SignupBody();
    dto.login = 'user1';
    dto.password = '';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });

  it('should fail if login is not a string', async () => {
    const dto = new SignupBody();
    // @ts-expect-error login should be a string
    dto.login = 123;
    dto.password = 'password123';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'login')).toBe(true);
  });

  it('should fail if password is not a string', async () => {
    const dto = new SignupBody();
    dto.login = 'user1';
    // @ts-expect-error password should be a string
    dto.password = 123;
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });

  it('should pass with valid payload', async () => {
    const dto = new SignupBody();
    dto.login = 'user1';
    dto.password = 'password123';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
