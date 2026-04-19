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
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Article } from 'src/db/prisma/client/client';
import { UserService } from 'src/user/user.service';
import { ArticleService } from './article.service';
import { CategoryService } from 'src/category/category.service';
import { RolesGuard, TokenGuard } from 'src/common/guards';
import { AdminAuth, EditorAuth, ViewerAuth } from 'src/common/decorators';
import { ArticleQueryDto, CreateArticleDto, UpdateArticleDto } from './dto';

@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly userService: UserService,
    private readonly catergoryService: CategoryService,
  ) {}

  @Get()
  @UseGuards(TokenGuard, RolesGuard)
  @ViewerAuth()
  @ApiOperation({ summary: 'Get all articles' })
  @HttpCode(200)
  getArticles(@Query() query: ArticleQueryDto): Promise<Article[]> {
    return this.articleService.getArticles(query);
  }

  @Get(':id')
  @UseGuards(TokenGuard, RolesGuard)
  @ViewerAuth()
  @ApiOperation({ summary: 'Get articles by id' })
  @HttpCode(200)
  getArticleById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<Article> {
    return this.articleService.getArticleById(id);
  }

  @Post()
  @UseGuards(TokenGuard, RolesGuard)
  @EditorAuth()
  @ApiOperation({ summary: 'Create article' })
  @HttpCode(201)
  async createArticle(@Body() body: CreateArticleDto): Promise<Article> {
    const { authorId, categoryId } = body;

    if (authorId) {
      await this.userService.getUserById(authorId);
    }

    if (categoryId) {
      await this.catergoryService.getCategoryById(categoryId);
    }

    return this.articleService.createArticle(body);
  }

  @Put(':id')
  @UseGuards(TokenGuard, RolesGuard)
  @EditorAuth()
  @ApiOperation({ summary: 'Update article' })
  @HttpCode(200)
  async updateArticle(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateArticleDto,
  ): Promise<Article> {
    const { categoryId } = body;

    if (categoryId) {
      await this.catergoryService.getCategoryById(categoryId);
    }

    const article = await this.articleService.getArticleById(id);
    return this.articleService.updateArticle(article, body);
  }

  @Delete(':id')
  @UseGuards(TokenGuard, RolesGuard)
  @AdminAuth()
  @ApiOperation({ summary: 'Delete article' })
  @HttpCode(204)
  async deleteArticle(@Param('id', new ParseUUIDPipe()) id: string) {
    const article = await this.articleService.getArticleById(id);
    this.articleService.deleteArticle(article);
  }
}
