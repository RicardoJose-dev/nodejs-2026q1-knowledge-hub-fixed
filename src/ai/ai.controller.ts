import { Controller, Post, HttpCode, Param, Body } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ArticleService } from 'src/article/article.service';
import { CustomParseUUIDPipe } from 'src/common/pipes/CustomParseUUIDPipe';
import { AIService } from './ai.service';
import { AiCacheService } from './cache.service';
import {
  SummarizeArticleDto,
  SummarizeArticleResponseDto,
  TranslateArticleDto,
  TranslateArticleResponseDto,
  AnalyzeArticleDto,
  AnalyzeArticleResponseDto,
} from './dto';
import { MaxLength, Task } from './dto/types';

@Controller('ai/articles')
export class AIController {
  constructor(
    private readonly aiService: AIService,
    private readonly articleService: ArticleService,
    private readonly cacheService: AiCacheService,
  ) {}

  @Post(':articleId/summarize')
  @ApiOperation({ summary: 'Summarize article' })
  @HttpCode(200)
  async summarizeArticle(
    @Param('articleId', new CustomParseUUIDPipe()) articleId: string,
    @Body() body: SummarizeArticleDto,
  ): Promise<SummarizeArticleResponseDto> {
    const { maxLength = MaxLength.Medium } = body;

    const article = await this.articleService.getArticleById(articleId);

    const cacheKey = this.cacheService.buildCacheKey(
      articleId,
      body,
      article.updatedAt.getTime(),
    );

    const cached = this.cacheService.get(cacheKey);

    if (cached) {
      return cached as SummarizeArticleResponseDto;
    }

    const summaryResult = await this.aiService.summarizeArticle(
      article,
      maxLength,
    );

    const response = {
      articleId,
      summary: summaryResult.summary,
      originalLength: summaryResult.originalLength,
      summaryLength: summaryResult.summaryLength,
    };

    this.cacheService.set(cacheKey, response);
    return response;
  }

  @Post(':articleId/translate')
  @ApiOperation({ summary: 'Translates article' })
  @HttpCode(200)
  async translateArticle(
    @Param('articleId', new CustomParseUUIDPipe()) articleId: string,
    @Body() body: TranslateArticleDto,
  ): Promise<TranslateArticleResponseDto> {
    const { targetLanguage, sourceLanguage } = body;

    const article = await this.articleService.getArticleById(articleId);

    const cacheKey = this.cacheService.buildCacheKey(
      articleId,
      body,
      article.updatedAt.getTime(),
    );

    const cached = this.cacheService.get(cacheKey);

    if (cached) {
      return cached as TranslateArticleResponseDto;
    }

    const response = await this.aiService.translateArticle(
      article,
      targetLanguage,
      sourceLanguage,
    );

    this.cacheService.set(cacheKey, response);
    return response;
  }

  @Post(':articleId/analyze')
  @ApiOperation({ summary: 'Analyses article' })
  @HttpCode(200)
  async analyzeArticle(
    @Param('articleId', new CustomParseUUIDPipe()) articleId: string,
    @Body() body: AnalyzeArticleDto,
  ): Promise<AnalyzeArticleResponseDto> {
    const { task = Task.Review } = body;

    const article = await this.articleService.getArticleById(articleId);

    return await this.aiService.analyzeArticle(article, task);
  }
}
