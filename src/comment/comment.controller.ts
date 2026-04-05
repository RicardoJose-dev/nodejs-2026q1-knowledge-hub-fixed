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
import { ApiOperation } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { UserService } from 'src/user/user.service';
import { ArticleService } from 'src/article/article.service';
import { UnprocessableContentException } from 'src/exception';
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
  @ApiOperation({ summary: 'Get comments by article id' })
  @HttpCode(200)
  getArticleComments(@Query() query: CommentQueryDto): Comment[] {
    const { articleId } = query;
    return this.commentService.getArticleComments(articleId);
  }

  @Post()
  @ApiOperation({ summary: 'Create comment' })
  @HttpCode(201)
  createComment(@Body() body: CreateCommentDto): Comment {
    const { authorId, articleId } = body;

    if (authorId) {
      this.userService.getUserById(authorId);
    }

    if (articleId) {
      this.articleService.getArticleById(
        articleId,
        UnprocessableContentException,
      );
    }

    return this.commentService.createComment(body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete comment' })
  @HttpCode(204)
  deleteComment(@Param('id', new ParseUUIDPipe()) id: string) {
    const comment = this.commentService.getCommentById(id);
    this.commentService.deleteComment(comment);
  }
}
