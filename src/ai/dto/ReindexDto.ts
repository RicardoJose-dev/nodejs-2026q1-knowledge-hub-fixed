import { IsOptional, IsBoolean, IsArray, IsString } from 'class-validator';

export class ReindexDto {
  @IsOptional()
  @IsBoolean()
  onlyPublished?: boolean = true;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  articleIds?: string[];
}
