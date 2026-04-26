import * as jwt from 'jsonwebtoken';
import { TokenPayload } from './dto';
import { ForbiddenError } from 'src/common/errors/custom.errors';

export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    }) as TokenPayload;
  } catch (err) {
    throw new ForbiddenError('Invalid or expired token');
  }
}
