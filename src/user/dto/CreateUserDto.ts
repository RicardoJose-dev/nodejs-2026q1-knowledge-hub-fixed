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
  @IsIn([UserRole.admin, UserRole.editor, UserRole.viewer])
  @IsOptional()
  role?: UserRole;
}
