import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { UserService } from 'src/user/user.service';
import { CategoryService } from 'src/category/category.service';

@Module({
  imports: [],
  controllers: [ArticleController],
  providers: [ArticleService, UserService, CategoryService],
})
export class ArticleModule {}
