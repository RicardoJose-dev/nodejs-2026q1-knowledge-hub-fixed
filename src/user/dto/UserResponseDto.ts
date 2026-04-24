import { Exclude, Transform } from 'class-transformer';

export class UserResponseDto {
  id: string;
  login: string;
  role: string;

  @Transform(({ value }) => (value instanceof Date ? value.getTime() : value))
  createdAt: number;

  @Transform(({ value }) => (value instanceof Date ? value.getTime() : value))
  updatedAt: number;

  @Exclude()
  password: string;
}
