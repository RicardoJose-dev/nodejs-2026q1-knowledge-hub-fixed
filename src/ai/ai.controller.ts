import { Controller, Post, HttpCode, Param, Body } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ArticleService } from 'src/article/article.service';
import { CustomParseUUIDPipe } from 'src/common/pipes/CustomParseUUIDPipe';
import { AIService } from './ai.service';
import {
  SummarizeArticleDto,
  SummarizeArticleResponseDto,
  TranslateArticleDto,
  TranslateArticleResponseDto,
  AnalyzeArticleDto,
  AnalyzeArticleResponseDto,
} from './dto';
import { MaxLength, Task } from './dto/types';

@Controller('ai')
export class AIController {
  constructor(
    private readonly aiService: AIService,
    private readonly articleService: ArticleService,
  ) {}

  @Post('articles/:articleId/summarize')
  @ApiOperation({ summary: 'Summarize article' })
  @HttpCode(200)
  async summarizeArticle(
    @Param('articleId', new CustomParseUUIDPipe()) articleId: string,
    @Body() body: SummarizeArticleDto,
  ): Promise<SummarizeArticleResponseDto> {
    const { maxLength = MaxLength.Medium } = body;

    const article = await this.articleService.getArticleById(articleId);

    const summaryResult = await this.aiService.summarizeArticle(
      article,
      maxLength,
    );

    return {
      articleId,
      summary: summaryResult.summary,
      originalLength: summaryResult.originalLength,
      summaryLength: summaryResult.summaryLength,
    };
  }

  @Post('articles/:articleId/translate')
  @ApiOperation({ summary: 'Translates article' })
  @HttpCode(200)
  async translateArticle(
    @Param('articleId', new CustomParseUUIDPipe()) articleId: string,
    @Body() body: TranslateArticleDto,
  ): Promise<TranslateArticleResponseDto> {
    const { targetLanguage, sourceLanguage } = body;

    const article = await this.articleService.getArticleById(articleId);

    return await this.aiService.translateArticle(
      article,
      targetLanguage,
      sourceLanguage,
    );
  }

  @Post('articles/:articleId/analyze')
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
