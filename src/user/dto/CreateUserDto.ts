import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/db/prisma/client/client';

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  login: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @IsString()
  @ApiProperty({ required: false })
  @IsIn([UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER])
  @IsOptional()
  role?: UserRole;
}
