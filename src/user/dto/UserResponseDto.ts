import { Exclude, Transform, Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  login: string;

  @Expose()
  role: string;

  @Expose()
  @Transform(({ value }) => (value instanceof Date ? value.getTime() : value))
  createdAt: number;

  @Expose()
  @Transform(({ value }) => (value instanceof Date ? value.getTime() : value))
  updatedAt: number;

  @Exclude()
  password: string;
}
