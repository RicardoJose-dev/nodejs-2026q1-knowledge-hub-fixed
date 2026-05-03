import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { MaxLength, Task, Severity } from './dto/types';
import { Article } from 'src/db/prisma/client/client';

@Injectable()
export class AIService {
  constructor(private readonly geminiService: GeminiService) {}

  async summarizeArticle(article: Article, maxLength: MaxLength) {
    const { id, content } = article;
    const summaryResult = await this.geminiService.summarizeContent(
      content,
      maxLength,
    );

    return {
      articleId: id,
      summary: summaryResult,
      originalLength: content.length,
      summaryLength: summaryResult.length,
    };
  }

  async translateArticle(
    article: Article,
    targetLanguage: string,
    sourceLanguage?: string,
  ) {
    const { id, content } = article;

    const translatedArticle = await this.geminiService.translateContent(
      content,
      targetLanguage,
      sourceLanguage,
    );

    return {
      articleId: id,
      translatedText: translatedArticle.translatedText,
      detectedLanguage: translatedArticle.detectedLanguage,
    };
  }

  async analyzeArticle(article: Article, task: Task) {
    const { id, content } = article;

    const analysedArticle = await this.geminiService.analyzeContent(
      content,
      task,
    );

    return {
      articleId: id,
      analysis: analysedArticle.analysis,
      suggestions: analysedArticle.suggestions,
      severity: analysedArticle.severity as Severity,
    };
  }

  async generateFreeFromContent(prompt: string) {
    return await this.geminiService.generateWithGemini(prompt);
  }
}
