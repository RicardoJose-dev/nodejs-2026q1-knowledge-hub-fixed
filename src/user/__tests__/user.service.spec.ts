import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ForbiddenError, NotFoundError } from 'src/common/errors/custom.errors';

vi.mock('bcryptjs', () => ({
  hash: vi.fn(),
}));

vi.mock('src/db/prisma/dbClient', () => ({
  default: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import * as bcrypt from 'bcryptjs';
import dbClient from 'src/db/prisma/dbClient';
import { UserService } from '../user.service';
import { UserRole } from 'src/db/prisma/client/enums';

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService();
    vi.clearAllMocks();
  });

  it('should return users from dbClient.user.findMany', async () => {
    const mockUsers = [
      { id: '1', login: 'user1', role: 'admin' },
      { id: '2', login: 'user2', role: 'viewer' },
    ];

    (dbClient.user.findMany as any).mockResolvedValue(mockUsers);

    const result = await userService.getUsers();

    expect(dbClient.user.findMany).toHaveBeenCalled();
    expect(result).toEqual(mockUsers);
  });

  it('should return user if found', async () => {
    const mockUser = { id: '1', login: 'user1', role: 'admin' };
    (dbClient.user.findUnique as any).mockResolvedValue(mockUser);

    const result = await userService.getUserById('1');

    expect(dbClient.user.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundError if user not found', async () => {
    (dbClient.user.findUnique as any).mockResolvedValue(null);

    await expect(userService.getUserById('2')).rejects.toThrow(NotFoundError);
  });

  it('should return user if credentials are valid', async () => {
    const mockUser = { id: '1', login: 'user1', role: 'admin' };
    (dbClient.user.findUnique as any).mockResolvedValue(mockUser);

    const where = { login: 'user1' };
    const result = await userService.getUserByCredentials(where);

    expect(dbClient.user.findUnique).toHaveBeenCalledWith({ where });
    expect(result).toEqual(mockUser);
  });

  it('should throw ForbiddenError if credentials are invalid', async () => {
    (dbClient.user.findUnique as any).mockResolvedValue(null);

    const where = { login: 'user2' };
    await expect(userService.getUserByCredentials(where)).rejects.toThrow(
      ForbiddenError,
    );
  });

  it('should call bcrypt.hash with correct arguments and return the result', async () => {
    (bcrypt.hash as any).mockResolvedValue('mocked-hash');

    const value = 'myPassword';
    const result = await userService.hashValue(value);

    expect(bcrypt.hash).toHaveBeenCalledWith(value, userService.salt);
    expect(result).toBe('mocked-hash');
  });

  it('should create a user with hashed password and default role', async () => {
    const body = { login: 'testuser', password: 'plainpassword' };
    const hashedPassword = 'hashed-password';
    const mockUser = {
      id: '1',
      login: 'testuser',
      password: hashedPassword,
      role: UserRole.viewer,
    };

    userService.hashValue = vi.fn().mockResolvedValue(hashedPassword);
    (dbClient.user.create as any).mockResolvedValue(mockUser);

    const result = await userService.createUser(body);

    expect(userService.hashValue).toHaveBeenCalledWith('plainpassword');
    expect(dbClient.user.create).toHaveBeenCalledWith({
      data: {
        login: 'testuser',
        password: hashedPassword,
        role: UserRole.viewer,
      },
    });
    expect(result).toEqual(mockUser);
  });

  it('should create a user with provided role', async () => {
    const body = {
      login: 'adminuser',
      password: 'adminpass',
      role: UserRole.admin,
    };

    const hashedPassword = 'hashed-admin';

    const mockUser = {
      id: '2',
      login: 'adminuser',
      password: hashedPassword,
      role: UserRole.admin,
    };

    userService.hashValue = vi.fn().mockResolvedValue(hashedPassword);
    (dbClient.user.create as any).mockResolvedValue(mockUser);

    const result = await userService.createUser(body);

    expect(userService.hashValue).toHaveBeenCalledWith('adminpass');
    expect(dbClient.user.create).toHaveBeenCalledWith({
      data: {
        login: 'adminuser',
        password: hashedPassword,
        role: UserRole.admin,
      },
    });
    expect(result).toEqual(mockUser);
  });

  it('should update user password if old password matches', async () => {
    const user = {
      id: '1',
      login: 'userlogin',
      password: 'hashed-old',
      role: UserRole.editor,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const body = { oldPassword: 'oldpass', newPassword: 'newpass' };
    const updatedUser = { id: '1', password: 'newpass' };

    userService.hashValue = vi.fn().mockResolvedValue('hashed-old');
    (dbClient.user.update as any).mockResolvedValue(updatedUser);

    const result = await userService.updateUser(user, body);

    expect(userService.hashValue).toHaveBeenCalledWith('oldpass');
    expect(dbClient.user.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { password: 'newpass' },
    });
    expect(result).toEqual(updatedUser);
  });

  it('should throw ForbiddenError if old password does not match', async () => {
    const user = {
      id: '1',
      login: 'userlogin',
      password: 'hashed-old',
      role: UserRole.editor,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const body = { oldPassword: 'wrongpass', newPassword: 'newpass' };

    userService.hashValue = vi.fn().mockResolvedValue('hashed-wrong');

    await expect(userService.updateUser(user, body)).rejects.toThrow(
      ForbiddenError,
    );

    expect(userService.hashValue).toHaveBeenCalledWith('wrongpass');
    expect(dbClient.user.update).not.toHaveBeenCalled();
  });

  it('should call dbClient.user.delete with correct user id and return the result', async () => {
    const user = {
      id: '1',
      login: 'user1',
      password: 'pass',
      role: UserRole.viewer,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const deletedUser = { ...user };
    (dbClient.user.delete as any).mockResolvedValue(deletedUser);

    const result = await userService.deleteUser(user);

    expect(dbClient.user.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toEqual(deletedUser);
  });
});
