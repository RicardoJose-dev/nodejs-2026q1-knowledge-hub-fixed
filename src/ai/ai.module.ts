import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ArticleService } from 'src/article/article.service';
import { AIController } from './ai.controller';
import { AIService } from './ai.service';
import { GeminiService } from './gemini.service';

@Module({
  imports: [HttpModule],
  controllers: [AIController],
  providers: [AIService, ArticleService, GeminiService],
})
export class AIModule {}
