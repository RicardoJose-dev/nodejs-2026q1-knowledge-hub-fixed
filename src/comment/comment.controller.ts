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
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Comment } from 'src/db/prisma/client/client';
import { RolesGuard, TokenGuard } from 'src/common/guards';
import { AdminAuth, EditorAuth, ViewerAuth } from 'src/common/decorators';
import { CommentService } from './comment.service';
import { UserService } from 'src/user/user.service';
import { ArticleService } from 'src/article/article.service';
import { UnprocessableContentException } from 'src/exception';
import { CreateCommentDto, CommentQueryDto } from './dto';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
    private readonly articleService: ArticleService,
  ) {}

  @Get()
  @UseGuards(TokenGuard, RolesGuard)
  @ViewerAuth()
  @ApiOperation({ summary: 'Get comments by article id' })
  @HttpCode(200)
  getArticleComments(@Query() query: CommentQueryDto): Promise<Comment[]> {
    const { articleId } = query;
    return this.commentService.getArticleComments(articleId);
  }

  @Post()
  @UseGuards(TokenGuard, RolesGuard)
  @EditorAuth()
  @ApiOperation({ summary: 'Create comment' })
  @HttpCode(201)
  async createComment(@Body() body: CreateCommentDto): Promise<Comment> {
    const { authorId, articleId } = body;

    if (authorId) {
      await this.userService.getUserById(authorId);
    }

    if (articleId) {
      await this.articleService.getArticleById(
        articleId,
        UnprocessableContentException,
      );
    }

    return this.commentService.createComment(body);
  }

  @Delete(':id')
  @UseGuards(TokenGuard, RolesGuard)
  @AdminAuth()
  @ApiOperation({ summary: 'Delete comment' })
  @HttpCode(204)
  async deleteComment(@Param('id', new ParseUUIDPipe()) id: string) {
    const comment = await this.commentService.getCommentById(id);
    this.commentService.deleteComment(comment);
  }
}
