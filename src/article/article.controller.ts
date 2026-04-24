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
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { CustomParseUUIDPipe } from 'src/common/pipes/CustomParseUUIDPipe';
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
  async getArticles(
    @Query() query: ArticleQueryDto,
  ): Promise<ArticleResponseDto[]> {
    const articles = await this.articleService.getArticles(query);
    return plainToInstance(ArticleResponseDto, articles);
  }

  @Get(':id')
  @UseGuards(TokenGuard, RolesGuard)
  @ViewerAuth()
  @ApiOperation({ summary: 'Get articles by id' })
  @HttpCode(200)
  async getArticleById(
    @Param('id', new CustomParseUUIDPipe()) id: string,
  ): Promise<ArticleResponseDto> {
    const article = await this.articleService.getArticleById(id);
    return plainToInstance(ArticleResponseDto, article);
  }

  @Post()
  @UseGuards(TokenGuard, RolesGuard)
  @EditorAuth()
  @ApiOperation({ summary: 'Create article' })
  @HttpCode(201)
  async createArticle(
    @Body() body: CreateArticleDto,
  ): Promise<ArticleResponseDto> {
    const { authorId, categoryId } = body;

    if (authorId) {
      await this.userService.getUserById(authorId);
    }

    if (categoryId) {
      await this.catergoryService.getCategoryById(categoryId);
    }

    const article = await this.articleService.createArticle(body);
    return plainToInstance(ArticleResponseDto, article);
  }

  @Put(':id')
  @UseGuards(TokenGuard, RolesGuard)
  @EditorAuth()
  @ApiOperation({ summary: 'Update article' })
  @HttpCode(200)
  async updateArticle(
    @Param('id', new CustomParseUUIDPipe()) id: string,
    @Body() body: UpdateArticleDto,
  ): Promise<ArticleResponseDto> {
    const { categoryId } = body;

    if (categoryId) {
      await this.catergoryService.getCategoryById(categoryId);
    }

    const article = await this.articleService.getArticleById(id);
    const updatedArticle = await this.articleService.updateArticle(
      article,
      body,
    );

    return plainToInstance(ArticleResponseDto, updatedArticle);
  }

  @Delete(':id')
  @UseGuards(TokenGuard, RolesGuard)
  @AdminAuth()
  @ApiOperation({ summary: 'Delete article' })
  @HttpCode(204)
  async deleteArticle(@Param('id', new CustomParseUUIDPipe()) id: string) {
    const article = await this.articleService.getArticleById(id);
    await this.articleService.deleteArticle(article);
  }
}
