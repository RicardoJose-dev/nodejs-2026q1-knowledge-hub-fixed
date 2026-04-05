import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id: string;
  login: string;
  role: string;
  createdAt: number;
  updatedAt: number;

  @Exclude()
  password: string;
}
