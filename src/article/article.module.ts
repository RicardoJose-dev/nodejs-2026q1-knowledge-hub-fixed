import { Module } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ArticleController } from './article.controller';
import { CategoryService } from 'src/category/category.service';
import { ArticleService } from './article.service';

@Module({
  imports: [],
  controllers: [ArticleController],
  providers: [ArticleService, UserService, CategoryService],
})
export class ArticleModule {}
