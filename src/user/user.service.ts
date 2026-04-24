import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import dbClient from 'src/db/prisma/dbClient';
import { User, UserRole } from 'src/db/prisma/client/client';
import { CreateUserDto, UpdatePasswordDto } from './dto';

@Injectable()
export class UserService {
  public readonly salt = '$2b$10$vZsjLv8pgin3zc8Pa5p5r.';

  getUsers(): Promise<User[]> {
    return dbClient.user.findMany();
  }

  async getUserById(userId): Promise<User> {
    const user = await dbClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUserByCredentials(where): Promise<User> {
    const user = await dbClient.user.findUnique({
      where,
    });

    if (!user) {
      throw new ForbiddenException('Authentication failed');
    }

    return user;
  }

  hashValue(value: string) {
    return bcrypt.hash(value, this.salt);
  }

  async createUser(body: CreateUserDto): Promise<User> {
    const { login, password, role = UserRole.viewer } = body;
    const hashedPassword = await this.hashValue(password);

    const newUser = await dbClient.user.create({
      data: {
        login,
        password: hashedPassword,
        role,
      },
    });

    return newUser;
  }

  async updateUser(user: User, body: UpdatePasswordDto) {
    const { newPassword, oldPassword } = body;
    const { password: currentPasswrod } = user;

    const hashedOldPassword = await this.hashValue(oldPassword);

    if (currentPasswrod !== hashedOldPassword) {
      throw new ForbiddenException('old password does not match');
    }

    const updatedUser = await dbClient.user.update({
      where: { id: user.id },
      data: {
        password: newPassword,
      },
    });

    return updatedUser;
  }

  deleteUser(user: User) {
    return dbClient.user.delete({ where: { id: user.id } });
  }
}
