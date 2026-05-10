import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { ArticleService } from 'src/article/article.service';
import { GeminiService } from './gemini.service';
import { ReindexRequestDto, ReindexResponseDto } from './dto';

@Injectable()
export class RagService {
  constructor(
    private readonly articleService: ArticleService,
    private readonly geminiService: GeminiService,
  ) {}

  async reindex(request: ReindexRequestDto): Promise<ReindexResponseDto> {
    let where: any = {};

    const { articleIds, onlyPublished } = request;
    const vectorCollection = process.env.RAG_VECTOR_COLLECTION;

    if (articleIds && articleIds.length > 0) {
      where.id = { in: request.articleIds };
    }

    if (onlyPublished ?? true) {
      where.published = true;
    }

    const articles = await this.articleService.findBy(where);

    if (!articles || articles.length === 0) {
      return {
        indexedArticles: 0,
        indexedChunks: 0,
        vectorCollection,
      };
    }

    const chunkSize = Number(process.env.RAG_CHUNK_SIZE ?? 800);
    const chunkOverlap = Number(process.env.RAG_CHUNK_OVERLAP ?? 200);

    let allChunks = [];

    for (const article of articles) {
      const chunks = this.splitIntoChunks(
        article.content,
        chunkSize,
        chunkOverlap,
        article,
      );
      allChunks.push(...chunks);
    }

    const embeddings = await this.geminiService.embedChunks(allChunks);

    const vectorDbUrl = process.env.RAG_VECTOR_DB_URL;

    await this.storeVectorsInQdrant(
      vectorDbUrl,
      vectorCollection,
      embeddings,
      allChunks,
    );

    return {
      indexedArticles: articles.length,
      indexedChunks: allChunks.length,
      vectorCollection,
    };
  }

  splitIntoChunks(
    text: string,
    size: number,
    overlap: number,
    article: any,
  ): any[] {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
      const end = Math.min(start + size, text.length);
      const chunkText = text.slice(start, end);
      chunks.push({
        text: chunkText,
        articleId: article.id,
        title: article.title,
      });
      start += size - overlap;
    }
    return chunks;
  }

  async storeVectorsInQdrant(
    dbUrl: string,
    collection: string,
    embeddings: number[][],
    chunks: any[],
  ) {
    const points = embeddings.map((vector, idx) => ({
      id: `${chunks[idx].articleId}_${idx}`,
      vector,
      payload: {
        text: chunks[idx].text,
        articleId: chunks[idx].articleId,
        title: chunks[idx].title,
      },
    }));

    await fetch(`${dbUrl}/collections/${collection}/points?wait=true`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ points }),
    });
  }
}
