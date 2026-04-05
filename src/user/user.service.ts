import { randomUUID } from 'crypto';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto, UpdatePasswordDto } from './dto';
import { users } from 'src/db/user';
import { User, UserRole } from 'src/user/types';

@Injectable()
export class UserService {
  getUsers(): User[] {
    return users;
  }

  getUserById(userId): User {
    const user = users.find(({ id }) => id === userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  createUser(body: CreateUserDto): User {
    const { login, password, role = UserRole.VIEWER } = body;

    const newUser: User = {
      id: randomUUID(),
      login,
      password,
      role,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    users.push(newUser);

    return newUser;
  }

  updateUser(user: User, body: UpdatePasswordDto) {
    const { newPassword, oldPassword } = body;
    const { password: currentPasswrod } = user;

    if (currentPasswrod !== oldPassword) {
      throw new BadRequestException('old password does not match');
    }

    const updatedUser = {
      ...user,
      password: newPassword,
      updatedAt: Date.now(),
    };

    users.map((dbUser) => (dbUser.id !== user.id ? dbUser : updatedUser));

    return updatedUser;
  }

  deleteUser(user: User) {
    users.filter(({ id }) => id !== user.id);
  }
}
