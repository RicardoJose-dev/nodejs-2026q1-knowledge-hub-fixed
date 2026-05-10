import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsArray,
  IsIn,
} from 'class-validator';

export class RagSearchDto {
  @IsString()
  query: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number = 5;

  @IsOptional()
  @IsIn(['draft', 'published', 'archived'])
  articleStatus?: 'draft' | 'published' | 'archived';

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
