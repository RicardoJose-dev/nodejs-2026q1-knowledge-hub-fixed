import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  newPassword: string;
}
