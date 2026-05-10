import { Controller, Post, Body } from '@nestjs/common';
import { RagService } from './rag.service';
import { ReindexRequestDto, ReindexResponseDto } from './dto';

@Controller('/ai/rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Post('index')
  async reindex(@Body() body: ReindexRequestDto): Promise<ReindexResponseDto> {
    return await this.ragService.reindex(body);
  }
}
