import {
  Controller,
  Query,
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ArticleService } from './article.service';
import { CategoryService } from 'src/category/category.service';
import { CommentService } from 'src/comment/comment.service';
import { ArticleQueryDto, CreateArticleDto, UpdateArticleDto } from './dto';
import { Article } from './types';

@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly userService: UserService,
    private readonly catergoryService: CategoryService,
    private readonly commentService: CommentService,
  ) {}

  @Get()
  @HttpCode(200)
  getArticles(@Query() query: ArticleQueryDto): Article[] {
    return this.articleService.getArticles(query);
  }

  @Get(':id')
  @HttpCode(200)
  getArticleById(@Param('id', new ParseUUIDPipe()) id: string): Article {
    return this.articleService.getArticleById(id);
  }

  @Post()
  @HttpCode(201)
  createArticle(@Body() body: CreateArticleDto): Article {
    const { authorId, categoryId } = body;

    if (authorId) {
      this.userService.getUserById(authorId);
    }

    if (categoryId) {
      this.catergoryService.getCategoryById(categoryId);
    }

    return this.articleService.createArticle(body);
  }

  @Put(':id')
  @HttpCode(200)
  updateArticle(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateArticleDto,
  ): Article {
    const { categoryId } = body

    if (categoryId) {
      this.catergoryService.getCategoryById(categoryId);
    }

    const article = this.articleService.getArticleById(id);
    return this.articleService.updateArticle(article, body);
  }

  @Delete(':id')
  @HttpCode(204)
  deleteArticle(@Param('id', new ParseUUIDPipe()) id: string) {
    const article = this.articleService.getArticleById(id);
    this.articleService.deleteArticle(article);
    this.commentService.removeArticleFromComment(article)
  }
}
