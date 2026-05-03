import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ArticleService } from 'src/article/article.service';
import { AIController } from './ai.controller';
import { AIService } from './ai.service';
import { GeminiService } from './gemini.service';
import { RateLimitMiddleware } from './middlewares/ratelimit.middleware';
import { AiCacheService } from './cache.service';
import { AiUsageService } from './usage.service';

@Module({
  imports: [HttpModule],
  controllers: [AIController],
  providers: [
    AIService,
    ArticleService,
    GeminiService,
    AiCacheService,
    AiUsageService,
  ],
})
export class AIModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimitMiddleware)
      .forRoutes({ path: 'ai/*', method: RequestMethod.ALL });
  }
}
