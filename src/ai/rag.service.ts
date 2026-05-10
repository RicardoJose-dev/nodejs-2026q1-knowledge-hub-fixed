import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { ArticleService } from 'src/article/article.service';
import { GeminiService } from './gemini.service';
import {
  ReindexRequestDto,
  ReindexResponseDto,
  RagSearchRequestDto,
  RagSearchResponseDto,
} from './dto';

@Injectable()
export class RagService {
  constructor(
    private readonly articleService: ArticleService,
    private readonly geminiService: GeminiService,
  ) {}

  vectorCollection = process.env.RAG_VECTOR_COLLECTION;
  chunkSize = Number(process.env.RAG_CHUNK_SIZE ?? 800);
  chunkOverlap = Number(process.env.RAG_CHUNK_OVERLAP ?? 200);
  vectorDbUrl = process.env.RAG_VECTOR_DB_URL;

  async reindex(request: ReindexRequestDto): Promise<ReindexResponseDto> {
    let where: any = {};

    const { articleIds, onlyPublished } = request;
    const vectorCollection = this.vectorCollection;

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

    let allChunks = [];

    for (const article of articles) {
      const chunks = this.splitIntoChunks(
        article.content,
        this.chunkSize,
        this.chunkOverlap,
        article,
      );
      allChunks.push(...chunks);
    }

    const embeddings = await this.geminiService.embedChunks(allChunks);

    await this.storeVectorsInQdrant(
      this.vectorDbUrl,
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

  async search(body: RagSearchRequestDto): Promise<RagSearchResponseDto> {
    const { query, articleStatus, categoryId, tags, limit } = body;

    const queryEmbedding = await this.geminiService.embedChunks([
      { text: query },
    ]);

    const vector = queryEmbedding[0];

    const filter: any = {};

    if (articleStatus) {
      filter['published'] = articleStatus === 'published';
    }

    if (categoryId) {
      filter['categoryId'] = body.categoryId;
    }

    if (tags && tags.length > 0) {
      filter['tags'] = { hasAll: tags };
    }

    const searchBody = {
      vector,
      limit: Math.min(limit ?? 5, 20),
      filter:
        Object.keys(filter).length > 0
          ? {
              must: Object.entries(filter).map(([key, value]) => ({
                key,
                match: { value },
              })),
            }
          : undefined,
      with_payload: true,
      with_vector: false,
    };

    const response = await fetch(
      `${this.vectorDbUrl}/collections/${this.vectorCollection}/points/search`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchBody),
      },
    );

    const data = await response.json();

    const results = (data.result || []).map((item: any) => ({
      articleId: item.payload.articleId,
      articleTitle: item.payload.title,
      chunk: item.payload.text,
      similarity: item.score,
    }));

    return { results };
  }
}
