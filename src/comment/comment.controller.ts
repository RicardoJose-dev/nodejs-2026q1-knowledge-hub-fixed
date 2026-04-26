import {
  Controller,
  Query,
  Get,
  Post,
  Delete,
  HttpCode,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CustomParseUUIDPipe } from 'src/common/pipes/CustomParseUUIDPipe';
import { RolesGuard, TokenGuard } from 'src/common/guards';
import { AdminAuth, EditorAuth, ViewerAuth } from 'src/common/decorators';
import { TransformInterceptor } from 'src/common/interceptors/TransformInterceptor';
import { CommentService } from './comment.service';
import { UserService } from 'src/user/user.service';
import { ArticleService } from 'src/article/article.service';
import { UnprocessableContentException } from 'src/exception';
import { CreateCommentDto, CommentQueryDto, CommentResponseDto } from './dto';
import { Comment } from 'src/db/prisma/client/client';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly userService: UserService,
    private readonly articleService: ArticleService,
  ) {}

  @Get(':commentId')
  @UseGuards(TokenGuard, RolesGuard)
  @ViewerAuth()
  @ApiOperation({ summary: 'Get comments by id' })
  @HttpCode(200)
  @UseInterceptors(new TransformInterceptor(CommentResponseDto))
  async getCommentById(
    @Param('commentId', new CustomParseUUIDPipe()) commentId: string,
  ): Promise<Comment> {
    return await this.commentService.getCommentById(commentId);
  }

  @Get()
  @UseGuards(TokenGuard, RolesGuard)
  @ViewerAuth()
  @ApiOperation({ summary: 'Get comments by article id' })
  @HttpCode(200)
  @UseInterceptors(new TransformInterceptor(CommentResponseDto))
  async getArticleComments(
    @Query() query: CommentQueryDto,
  ): Promise<Comment[]> {
    const { articleId } = query;
    return await this.commentService.getArticleComments(articleId);
  }

  @Post()
  @UseGuards(TokenGuard, RolesGuard)
  @EditorAuth()
  @ApiOperation({ summary: 'Create comment' })
  @HttpCode(201)
  @UseInterceptors(new TransformInterceptor(CommentResponseDto))
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

    return await this.commentService.createComment(body);
  }

  @Delete(':id')
  @UseGuards(TokenGuard, RolesGuard)
  @AdminAuth()
  @ApiOperation({ summary: 'Delete comment' })
  @HttpCode(204)
  async deleteComment(@Param('id', new CustomParseUUIDPipe()) id: string) {
    const comment = await this.commentService.getCommentById(id);
    await this.commentService.deleteComment(comment);
  }
}
