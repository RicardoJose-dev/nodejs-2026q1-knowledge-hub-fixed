import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ApiOperation } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdatePasswordDto, UserResponseDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @HttpCode(200)
  async getUsers(): Promise<UserResponseDto[]> {
    const users = await this.userService.getUsers();
    return plainToInstance(UserResponseDto, users);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get user by id' })
  @HttpCode(200)
  async getUserById(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<UserResponseDto> {
    const user = await this.userService.getUserById(userId);
    return plainToInstance(UserResponseDto, user);
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @HttpCode(201)
  async createUser(@Body() body: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.userService.createUser(body);
    return plainToInstance(UserResponseDto, user);
  }

  @Put(':userId')
  @ApiOperation({ summary: 'update user' })
  @HttpCode(200)
  async updateUser(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() body: UpdatePasswordDto,
  ): Promise<UserResponseDto> {
    const user = await this.userService.getUserById(userId);
    const updatedUser = this.userService.updateUser(user, body);

    return plainToInstance(UserResponseDto, updatedUser);
  }

  @Delete(':userId')
  @ApiOperation({ summary: 'Delete user' })
  @HttpCode(204)
  async deleteUser(@Param('userId', new ParseUUIDPipe()) userId: string) {
    const user = await this.userService.getUserById(userId);
    this.userService.deleteUser(user);
  }
}
