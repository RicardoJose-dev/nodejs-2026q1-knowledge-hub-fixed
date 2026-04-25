import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from '../roles.guard';
import { ForbiddenError } from 'src/common/errors/custom.errors';

describe('RolesGuard', () => {
  let reflector: Reflector;
  let guard: RolesGuard;
  let context: any;

  beforeEach(() => {
    reflector = {
      get: vi.fn(),
    } as any;
    guard = new RolesGuard(reflector);

    context = {
      getHandler: vi.fn(),
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    };
  });

  it('should return true if no required roles are set', () => {
    (reflector.get as any).mockReturnValue(undefined);

    const result = guard.canActivate(context);

    expect(result).toBe(true);
    expect(reflector.get).toHaveBeenCalled();
  });

  it('should return true if user has required role', () => {
    (reflector.get as any).mockReturnValue(['admin']);

    const req = { user: { role: 'admin' } };
    context.switchToHttp = () => ({
      getRequest: () => req,
    });

    const result = guard.canActivate(context);

    expect(result).toBe(true);
  });

  it('should throw ForbiddenError if user is missing', () => {
    (reflector.get as any).mockReturnValue(['admin']);

    const req = {};
    context.switchToHttp = () => ({
      getRequest: () => req,
    });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenError);
  });

  it('should throw ForbiddenError if user does not have required role', () => {
    (reflector.get as any).mockReturnValue(['admin']);

    const req = { user: { role: 'viewer' } };
    context.switchToHttp = () => ({
      getRequest: () => req,
    });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenError);
  });
});
