import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { UserService } from 'src/user/user.service';
import { ArticleService } from 'src/article/article.service';

@Module({
  imports: [],
  controllers: [CommentController],
  providers: [CommentService, UserService, ArticleService],
})
export class CommentModule {}
