import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CustomParseUUIDPipe } from 'src/common/pipes/CustomParseUUIDPipe';
import { TransformInterceptor } from 'src/common/interceptors/TransformInterceptor';
import { RolesGuard, TokenGuard } from 'src/common/guards';
import { User } from 'src/db/prisma/client/client';
import { AdminAuth, EditorAuth, ViewerAuth } from 'src/common/decorators';
import { UserService } from './user.service';
import { CreateUserDto, UpdatePasswordDto, UserResponseDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(TokenGuard, RolesGuard)
  @ViewerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @HttpCode(200)
  @UseInterceptors(new TransformInterceptor(UserResponseDto))
  getUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }

  @Get(':userId')
  @UseGuards(TokenGuard, RolesGuard)
  @ViewerAuth()
  @ApiOperation({ summary: 'Get user by id' })
  @HttpCode(200)
  @UseInterceptors(new TransformInterceptor(UserResponseDto))
  async getUserById(
    @Param('userId', new CustomParseUUIDPipe()) userId: string,
  ): Promise<User> {
    return await this.userService.getUserById(userId);
  }

  @Post()
  @UseGuards(TokenGuard, RolesGuard)
  @AdminAuth()
  @ApiOperation({ summary: 'Create user' })
  @HttpCode(201)
  @UseInterceptors(new TransformInterceptor(UserResponseDto))
  async createUser(@Body() body: CreateUserDto): Promise<User> {
    return await this.userService.createUser(body);
  }

  @Put(':userId')
  @UseGuards(TokenGuard, RolesGuard)
  @EditorAuth()
  @ApiOperation({ summary: 'update user' })
  @HttpCode(200)
  @UseInterceptors(new TransformInterceptor(UserResponseDto))
  async updateUser(
    @Param('userId', new CustomParseUUIDPipe()) userId: string,
    @Body() body: UpdatePasswordDto,
  ): Promise<User> {
    const user = await this.userService.getUserById(userId);
    return await this.userService.updateUser(user, body);
  }

  @Delete(':userId')
  @UseGuards(TokenGuard, RolesGuard)
  @AdminAuth()
  @ApiOperation({ summary: 'Delete user' })
  @HttpCode(204)
  async deleteUser(@Param('userId', new CustomParseUUIDPipe()) userId: string) {
    const user = await this.userService.getUserById(userId);
    await this.userService.deleteUser(user);
  }
}
