import { Controller, Post, HttpCode, Body } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { SignupBody, LoginBody, RefreshBody } from './dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Signup user' })
  @HttpCode(201)
  async signup(@Body() body: SignupBody): Promise<{ message: string }> {
    const { login, password } = body;

    await this.userService.createUser({
      login,
      password,
    });

    return { message: 'user successfully created' };
  }

  @Post('login')
  @ApiOperation({ summary: 'Log user' })
  @HttpCode(201)
  async login(
    @Body() body: LoginBody,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { login, password } = body;
    const hashedPassword = await this.userService.hashValue(password);

    const user = await this.userService.getUserByCredentials({
      login,
      password: hashedPassword,
    });

    return {
      accessToken: this.authService.getAccessToken(user),
      refreshToken: this.authService.getRefreshToken(user),
    };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Log user' })
  @HttpCode(201)
  async refresh(
    @Body() body: RefreshBody,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { refreshToken } = body;
    const { login, userId } = this.authService.verifyRefreshToken(refreshToken);

    const user = await this.userService.getUserByCredentials({
      id: userId,
      login,
    });

    return {
      accessToken: this.authService.getAccessToken(user),
      refreshToken: this.authService.getRefreshToken(user),
    };
  }
}
