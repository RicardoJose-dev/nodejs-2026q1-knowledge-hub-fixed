import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupBody {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  login: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
