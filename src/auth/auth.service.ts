import 'dotenv/config';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from 'src/db/prisma/client/client';
import { TokenPayload } from './dto';

@Injectable()
export class AuthService {
  async hashValue(value: string, saltRounds = 10) {
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(value, salt);
  }

  getAccessToken(user: User): string {
    const payload = { userId: user.id, login: user.login, role: user.role };
    const secret = process.env.JWT_SECRET;
    const options: SignOptions = {
      expiresIn: process.env.JWT_ACCESS_TTL as any,
    };

    return jwt.sign(payload, secret, options);
  }

  getRefreshToken(user: User) {
    const payload = { userId: user.id, login: user.login, role: user.role };
    const secret = process.env.JWT_REFRESH_SECRET;
    const options: SignOptions = {
      expiresIn: process.env.JWT_REFRESH_TTL as any,
    };

    return jwt.sign(payload, secret, options);
  }

  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_TTL) as TokenPayload;
    } catch (err) {
      throw new ForbiddenException('Invalid or expired token');
    }
  }
}
