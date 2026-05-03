import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { verifyAccessToken } from 'src/auth/utils';
import { UnauthorizedError } from '../errors/custom.errors';

@Injectable()
export class TokenGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader =
      request.headers['authorization'] || request.headers['Authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Token not found');
    }

    request.user = verifyAccessToken(token);
    return true;
  }
}
