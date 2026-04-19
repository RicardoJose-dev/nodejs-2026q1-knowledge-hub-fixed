import * as jwt from 'jsonwebtoken';
import { ForbiddenException } from '@nestjs/common';
import { TokenPayload } from './dto';

export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    }) as TokenPayload;
  } catch (err) {
    throw new ForbiddenException('Invalid or expired token');
  }
}
