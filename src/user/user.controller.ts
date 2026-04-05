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
import { UserService } from './user.service';
import { CreateUserDto, UpdatePasswordDto, UserResponseDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(200)
  getUsers(): UserResponseDto[] {
    const users = this.userService.getUsers();
    return plainToInstance(UserResponseDto, users);
  }

  @Get(':userId')
  @HttpCode(200)
  getUserById(
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): UserResponseDto {
    const user = this.userService.getUserById(userId);
    return plainToInstance(UserResponseDto, user);
  }

  @Post()
  @HttpCode(201)
  createUser(@Body() body: CreateUserDto): UserResponseDto {
    const user = this.userService.createUser(body);
    return plainToInstance(UserResponseDto, user);
  }

  @Put(':userId')
  @HttpCode(200)
  updateUser(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Body() body: UpdatePasswordDto,
  ): UserResponseDto {
    const user = this.userService.getUserById(userId);
    const updatedUser = this.userService.updateUser(user, body);

    return plainToInstance(UserResponseDto, updatedUser);
  }

  @Delete(':userId')
  @HttpCode(204)
  deleteUser(@Param('userId', new ParseUUIDPipe()) userId: string) {
    const user = this.userService.getUserById(userId);
    this.userService.deleteUser(user);
  }
}
