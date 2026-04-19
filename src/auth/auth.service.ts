import 'dotenv/config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from 'src/db/prisma/client/client';
import { TokenPayload } from './dto';

@Injectable()
export class AuthService {
  async hashValue(value: string) {
    return await bcrypt.hash(value, '$2b$10$vZsjLv8pgin3zc8Pa5p5r.');
  }

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

  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
        algorithms: ['HS256'],
      }) as TokenPayload;
    } catch (err) {
      console.log(err);
      throw new ForbiddenException('Invalid or expired token');
    }
  }
}
