import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';
import { UserRole } from '../types';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsIn(['admin', 'editor', 'viewer'])
  @IsOptional()
  role?: UserRole;
}
