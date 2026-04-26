import { validate } from 'class-validator';
import { UserRole } from 'src/db/prisma/client/enums';
import { CreateUserDto } from '../CreateUserDto';

describe('CreateUserDto validation', () => {
  it('should fail if required fields are missing', async () => {
    const dto = new CreateUserDto();
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);

    const properties = errors.map((e) => e.property);
    expect(properties).toContain('login');
    expect(properties).toContain('password');
  });

  it('should fail if login is empty', async () => {
    const dto = new CreateUserDto();
    dto.login = '';
    dto.password = 'password123';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'login')).toBe(true);
  });

  it('should fail if password is empty', async () => {
    const dto = new CreateUserDto();
    dto.login = 'user1';
    dto.password = '';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });

  it('should fail if role is not a valid enum value', async () => {
    const dto = new CreateUserDto();
    dto.login = 'user1';
    dto.password = 'password123';
    // @ts-expect-error role should be a valid value from UserRole
    dto.role = 'not-a-valid-role';
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'role')).toBe(true);
  });

  it('should pass with valid payload (role omitted)', async () => {
    const dto = new CreateUserDto();
    dto.login = 'user1';
    dto.password = 'password123';

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass with valid payload (role provided)', async () => {
    const dto = new CreateUserDto();
    dto.login = 'user1';
    dto.password = 'password123';
    dto.role = UserRole.admin;
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
