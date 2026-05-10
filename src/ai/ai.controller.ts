import { Controller, Get, Post, HttpCode, Param, Body } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ArticleService } from 'src/article/article.service';
import { CustomParseUUIDPipe } from 'src/common/pipes/CustomParseUUIDPipe';
import { AIService } from './ai.service';
import { AiCacheService } from './cache.service';
import { RagService } from './rag.service';
import { AiUsageService } from './usage.service';
import {
  SummarizeArticleDto,
  SummarizeArticleResponseDto,
  TranslateArticleDto,
  TranslateArticleResponseDto,
  AnalyzeArticleDto,
  AnalyzeArticleResponseDto,
  GenerateContentDto,
} from './dto';
import { MaxLength, Task } from './dto/types';

@Controller('ai')
export class AIController {
  constructor(
    private readonly aiService: AIService,
    private readonly articleService: ArticleService,
    private readonly cacheService: AiCacheService,
    private readonly usageService: AiUsageService,
    private readonly ragService: RagService,
  ) {}

  @Post('articles/:articleId/summarize')
  @ApiOperation({ summary: 'Summarize article' })
  @HttpCode(200)
  async summarizeArticle(
    @Param('articleId', new CustomParseUUIDPipe()) articleId: string,
    @Body() body: SummarizeArticleDto,
  ): Promise<SummarizeArticleResponseDto> {
    this.usageService.increment('summarize');

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

  @Post('articles/:articleId/translate')
  @ApiOperation({ summary: 'Translates article' })
  @HttpCode(200)
  async translateArticle(
    @Param('articleId', new CustomParseUUIDPipe()) articleId: string,
    @Body() body: TranslateArticleDto,
  ): Promise<TranslateArticleResponseDto> {
    this.usageService.increment('translate');

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

  @Post('articles/:articleId/analyze')
  @ApiOperation({ summary: 'Analyses article' })
  @HttpCode(200)
  async analyzeArticle(
    @Param('articleId', new CustomParseUUIDPipe()) articleId: string,
    @Body() body: AnalyzeArticleDto,
  ): Promise<AnalyzeArticleResponseDto> {
    this.usageService.increment('analyse');

    const { task = Task.Review } = body;

    const article = await this.articleService.getArticleById(articleId);

    return await this.aiService.analyzeArticle(article, task);
  }

  @Post('generate')
  @ApiOperation({ summary: 'Free-form generation' })
  @HttpCode(200)
  async generateContent(@Body() body: GenerateContentDto): Promise<string> {
    this.usageService.increment('generate');
    const { prompt } = body;
    return await this.aiService.generateFreeFromContent(prompt);
  }

  @Get('usage')
  getUsage() {
    return {
      total: this.usageService.getTotalRequests(),
      byEndpoint: this.usageService.getRequestsByEndpoint(),
    };
  }
}
