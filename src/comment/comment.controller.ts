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
import { plainToInstance } from 'class-transformer';
import { ApiOperation } from '@nestjs/swagger';
import { RolesGuard, TokenGuard } from 'src/common/guards';
import { AdminAuth, EditorAuth, ViewerAuth } from 'src/common/decorators';
import { CommentService } from './comment.service';
import { UserService } from 'src/user/user.service';
import { ArticleService } from 'src/article/article.service';
import { UnprocessableContentException } from 'src/exception';
import { CreateCommentDto, CommentQueryDto, CommentResponseDto } from './dto';

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
  async getCommentById(
    @Param('commentId', new ParseUUIDPipe()) commentId: string,
  ): Promise<CommentResponseDto> {
    const comments = await this.commentService.getCommentById(commentId);
    return plainToInstance(CommentResponseDto, comments);
  }

  @Get()
  @UseGuards(TokenGuard, RolesGuard)
  @ViewerAuth()
  @ApiOperation({ summary: 'Get comments by article id' })
  @HttpCode(200)
  async getArticleComments(
    @Query() query: CommentQueryDto,
  ): Promise<CommentResponseDto[]> {
    const { articleId } = query;
    const comments = await this.commentService.getArticleComments(articleId);
    return plainToInstance(CommentResponseDto, comments);
  }

  @Post()
  @UseGuards(TokenGuard, RolesGuard)
  @EditorAuth()
  @ApiOperation({ summary: 'Create comment' })
  @HttpCode(201)
  async createComment(
    @Body() body: CreateCommentDto,
  ): Promise<CommentResponseDto> {
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

    const comment = await this.commentService.createComment(body);
    return plainToInstance(CommentResponseDto, comment);
  }

  @Delete(':id')
  @UseGuards(TokenGuard, RolesGuard)
  @AdminAuth()
  @ApiOperation({ summary: 'Delete comment' })
  @HttpCode(204)
  async deleteComment(@Param('id', new ParseUUIDPipe()) id: string) {
    const comment = await this.commentService.getCommentById(id);
    await this.commentService.deleteComment(comment);
  }
}
