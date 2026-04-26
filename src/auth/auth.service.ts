import 'dotenv/config';
import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { User } from 'src/db/prisma/client/client';
import { TokenPayload } from './dto';
import { ForbiddenError } from 'src/common/errors/custom.errors';

@Injectable()
export class AuthService {
  getAccessToken(user: User): string {
    const payload = { userId: user.id, login: user.login, role: user.role };
    const secret = process.env.JWT_SECRET;
    const options: SignOptions = {
      expiresIn: process.env.JWT_ACCESS_TTL as any,
      algorithm: 'HS256',
    };

    return jwt.sign(payload, secret, options);
  }

  getRefreshToken(user: User) {
    const payload = { userId: user.id, login: user.login, role: user.role };
    const secret = process.env.JWT_REFRESH_SECRET;
    const options: SignOptions = {
      expiresIn: process.env.JWT_REFRESH_TTL as any,
      algorithm: 'HS256',
    };

    return jwt.sign(payload, secret, options);
  }

  verifyRefreshToken(token: string): TokenPayload {
    const secret = process.env.JWT_REFRESH_SECRET;

    try {
      return jwt.verify(token, secret, {
        algorithms: ['HS256'],
      }) as TokenPayload;
    } catch (err) {
      throw new ForbiddenError('Invalid or expired token');
    }
  }
}
