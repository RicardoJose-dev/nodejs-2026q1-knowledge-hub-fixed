import {
  Controller,
  Query,
  Get,
  Post,
  Delete,
  HttpCode,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { UserService } from 'src/user/user.service';
import { ArticleService } from 'src/article/article.service';
import { CreateCommentDto, CommentQueryDto } from './dto';
import { Comment } from './types';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
    private readonly articleService: ArticleService,
  ) {}

  @Get()
  @HttpCode(200)
  getArticleComments(@Query() query: CommentQueryDto): Comment[] {
    const { articleId } = query;
    return this.commentService.getArticleComments(articleId);
  }

  @Post()
  @HttpCode(201)
  createComment(@Body() body: CreateCommentDto): Comment {
    const { authorId, articleId } = body;

    if (authorId) {
      this.userService.getUserById(authorId);
    }

    if (articleId) {
      this.articleService.getArticleById(articleId);
    }

    return this.commentService.createComment(body);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteComment(@Param('id', new ParseUUIDPipe()) id: string) {
    const comment = this.commentService.getCommentById(id);
    this.commentService.deleteComment(comment);
  }
}
