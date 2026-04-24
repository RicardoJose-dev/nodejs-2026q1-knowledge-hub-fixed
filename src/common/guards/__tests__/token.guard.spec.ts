import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UnauthorizedException } from '@nestjs/common';

vi.mock('src/auth/utils', () => ({
  verifyAccessToken: vi.fn(),
}));

import { TokenGuard } from '../token.guard';
import { verifyAccessToken } from 'src/auth/utils';

describe('TokenGuard', () => {
  let guard: TokenGuard;
  let context: any;

  beforeEach(() => {
    guard = new TokenGuard();
    vi.clearAllMocks();

    context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    };
  });

  it('should throw if Authorization header is missing', () => {
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw if Authorization header does not start with Bearer', () => {
    context.switchToHttp = () => ({
      getRequest: () => ({
        headers: { authorization: 'Token abc123' },
      }),
    });

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw if token is missing after Bearer', () => {
    context.switchToHttp = () => ({
      getRequest: () => ({
        headers: { authorization: 'Bearer ' },
      }),
    });

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should set request.user and return true if token is valid', () => {
    const mockUser = { id: '1', login: 'test' };
    (verifyAccessToken as any).mockReturnValue(mockUser);

    const req: any = {
      headers: { authorization: 'Bearer validtoken' },
    };
    context.switchToHttp = () => ({
      getRequest: () => req,
    });

    const result = guard.canActivate(context);

    expect(verifyAccessToken).toHaveBeenCalledWith('validtoken');
    expect(req.user).toEqual(mockUser);
    expect(result).toBe(true);
  });

  it('should throw if verifyAccessToken throws', () => {
    (verifyAccessToken as any).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    context.switchToHttp = () => ({
      getRequest: () => ({
        headers: { authorization: 'Bearer invalidtoken' },
      }),
    });

    expect(() => guard.canActivate(context)).toThrow();
  });
});
