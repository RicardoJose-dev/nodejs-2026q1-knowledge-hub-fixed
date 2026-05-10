import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { RagService } from './rag.service';
import {
  ReindexDto,
  ReindexResponseDto,
  RagSearchDto,
  RagSearchResponseDto,
  RagChatDto,
  RagChatResponseDto,
} from './dto';

@Controller('/ai/rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Post('index')
  @HttpCode(200)
  async reindex(@Body() body: ReindexDto): Promise<ReindexResponseDto> {
    return await this.ragService.reindex(body);
  }

  @Post('search')
  @HttpCode(200)
  async search(@Body() body: RagSearchDto): Promise<RagSearchResponseDto> {
    return await this.ragService.search(body);
  }

  @Post('chat')
  @HttpCode(200)
  async chat(@Body() body: RagChatDto): Promise<RagChatResponseDto> {
    return await this.ragService.chat(body);
  }

  @Delete('index/articles/:articleId')
  @HttpCode(204)
  async deleteArticleVectors(
    @Param('articleId') articleId: string,
  ): Promise<void> {
    await this.ragService.deleteArticleVectors(articleId);
  }
}
