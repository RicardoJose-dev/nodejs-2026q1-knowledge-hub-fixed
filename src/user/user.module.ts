import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ArticleService } from 'src/article/article.service';
import { CommentService } from 'src/comment/comment.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, ArticleService, CommentService],
})
export class UserModule {}
