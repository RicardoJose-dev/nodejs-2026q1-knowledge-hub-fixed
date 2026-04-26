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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CustomParseUUIDPipe } from 'src/common/pipes/CustomParseUUIDPipe';
import { TransformInterceptor } from 'src/common/interceptors/TransformInterceptor';
import { UserService } from 'src/user/user.service';
import { ArticleService } from './article.service';
import { CategoryService } from 'src/category/category.service';
import { RolesGuard, TokenGuard } from 'src/common/guards';
import { AdminAuth, EditorAuth, ViewerAuth } from 'src/common/decorators';
import {
  ArticleQueryDto,
  CreateArticleDto,
  UpdateArticleDto,
  ArticleResponseDto,
} from './dto';
import { Article } from 'src/db/prisma/client/client';

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
  @UseInterceptors(new TransformInterceptor(ArticleResponseDto))
  getArticles(@Query() query: ArticleQueryDto): Promise<Article[]> {
    return this.articleService.getArticles(query);
  }

  @Get(':id')
  @UseGuards(TokenGuard, RolesGuard)
  @ViewerAuth()
  @ApiOperation({ summary: 'Get articles by id' })
  @HttpCode(200)
  @UseInterceptors(new TransformInterceptor(ArticleResponseDto))
  async getArticleById(
    @Param('id', new CustomParseUUIDPipe()) id: string,
  ): Promise<Article> {
    return await this.articleService.getArticleById(id);
  }

  @Post()
  @UseGuards(TokenGuard, RolesGuard)
  @EditorAuth()
  @ApiOperation({ summary: 'Create article' })
  @HttpCode(201)
  @UseInterceptors(new TransformInterceptor(ArticleResponseDto))
  async createArticle(@Body() body: CreateArticleDto): Promise<Article> {
    const { authorId, categoryId } = body;

    if (authorId) {
      await this.userService.getUserById(authorId);
    }

    if (categoryId) {
      await this.catergoryService.getCategoryById(categoryId);
    }

    return await this.articleService.createArticle(body);
  }

  @Put(':id')
  @UseGuards(TokenGuard, RolesGuard)
  @EditorAuth()
  @ApiOperation({ summary: 'Update article' })
  @HttpCode(200)
  @UseInterceptors(new TransformInterceptor(ArticleResponseDto))
  async updateArticle(
    @Param('id', new CustomParseUUIDPipe()) id: string,
    @Body() body: UpdateArticleDto,
  ): Promise<Article> {
    const { categoryId } = body;

    if (categoryId) {
      await this.catergoryService.getCategoryById(categoryId);
    }

    const article = await this.articleService.getArticleById(id);
    const updatedArticle = await this.articleService.updateArticle(
      article,
      body,
    );

    return updatedArticle;
  }

  @Delete(':id')
  @UseGuards(TokenGuard, RolesGuard)
  @AdminAuth()
  @ApiOperation({ summary: 'Delete article' })
  @HttpCode(204)
  async deleteArticle(@Param('id', new CustomParseUUIDPipe()) id: string) {
    const article = await this.articleService.getArticleById(id);
    return await this.articleService.deleteArticle(article);
  }
}
