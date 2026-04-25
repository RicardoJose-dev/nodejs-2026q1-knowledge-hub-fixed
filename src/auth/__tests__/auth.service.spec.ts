import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForbiddenError } from 'src/common/errors/custom.errors';

vi.mock('jsonwebtoken', () => ({
  sign: vi.fn(),
  verify: vi.fn(),
}));

import * as jwt from 'jsonwebtoken';
import { AuthService } from '../auth.service';
import { User } from '../../db/prisma/client/client';
import { UserRole } from '../../db/prisma/client/enums';

describe('AuthService', () => {
  let authService: AuthService;

  const refreshSecret = 'test-refresh-secret';

  const user: User = {
    id: '123',
    login: 'testuser',
    password: 'testuserpassword',
    role: UserRole.admin,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    authService = new AuthService();
    vi.clearAllMocks();

    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_ACCESS_TTL = '15m';
    process.env.JWT_REFRESH_SECRET = refreshSecret;
    process.env.JWT_REFRESH_TTL = '7d';
  });

  it('should generate access token with correct payload and options', () => {
    (jwt.sign as any).mockReturnValue('access-token');

    const token = authService.getAccessToken(user);

    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: '123', login: 'testuser', role: 'admin' },
      'test-secret',
      { expiresIn: '15m', algorithm: 'HS256' },
    );

    expect(token).toBe('access-token');
  });

  it('should generate refresh token with correct payload and options', () => {
    (jwt.sign as any).mockReturnValue('refresh-token');

    const token = authService.getRefreshToken(user);

    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: '123', login: 'testuser', role: 'admin' },
      refreshSecret,
      { expiresIn: '7d', algorithm: 'HS256' },
    );
    expect(token).toBe('refresh-token');
  });

  it('should return payload if token is valid', () => {
    const token = 'test-refresh-token';
    const payload = { userId: '123', login: 'testuser', role: UserRole.admin };

    (jwt.verify as any).mockReturnValue(payload);

    const result = authService.verifyRefreshToken(token);

    expect(jwt.verify).toHaveBeenCalledWith(token, refreshSecret, {
      algorithms: ['HS256'],
    });
    expect(result).toBe(payload);
  });

  it('should throw ForbiddenError if token is invalid', () => {
    (jwt.verify as any).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    expect(() => authService.verifyRefreshToken('invalid token')).toThrow(
      ForbiddenError,
    );
  });
});
