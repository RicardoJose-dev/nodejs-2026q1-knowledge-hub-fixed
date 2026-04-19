import { User } from 'src/db/prisma/client/client';

export interface TokenPayload extends Pick<User, 'login' | 'role'> {
  userId: string;
}
