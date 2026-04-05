import { IsString, IsOptional } from 'class-validator';

export class UpdateCategorydDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
