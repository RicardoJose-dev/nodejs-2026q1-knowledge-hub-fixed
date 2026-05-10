import { Module } from '@nestjs/common';
import { RagController } from './rag.controller';
import { RagService } from './rag.service';
import { ArticleService } from 'src/article/article.service';
import { GeminiService } from './gemini.service';

@Module({
  imports: [],
  controllers: [RagController],
  providers: [RagService, ArticleService, GeminiService],
})
export class RagModule {}
