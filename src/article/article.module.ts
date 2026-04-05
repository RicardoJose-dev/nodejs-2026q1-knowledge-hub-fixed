import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { UserService } from 'src/user/user.service';
import { CategoryService } from 'src/category/category.service';
import { CommentService } from 'src/comment/comment.service';

@Module({
  imports: [],
  controllers: [ArticleController],
  providers: [ArticleService, UserService, CategoryService, CommentService],
})
export class ArticleModule {}
