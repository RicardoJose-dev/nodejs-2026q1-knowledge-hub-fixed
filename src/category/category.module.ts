import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { ArticleService } from 'src/article/article.service';

@Module({
  imports: [],
  controllers: [CategoryController],
  providers: [CategoryService, ArticleService],
})
export class CategoryModule {}
