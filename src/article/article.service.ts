import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import dbClient from 'src/db/prisma/dbClient';
import { ArticleQueryDto, CreateArticleDto, UpdateArticleDto } from './dto';
import { Article, ArticleStatus } from 'src/db/prisma/client/client';

@Injectable()
export class ArticleService {
  getArticles(query: ArticleQueryDto): Promise<Article[]> {
    const { status, categoryId, tag } = query;

    return dbClient.article.findMany({
      where: {
        ...(status && { status }),
        ...(categoryId && { categoryId }),
        ...(tag && {
          tags: {
            some: {
              name: tag,
            },
          },
        }),
      },
      include: {
        tags: true,
        category: true,
      },
    });
  }

  async getArticleById(
    articleId: string,
    ExceptionClass: new (message: string) => HttpException = NotFoundException,
  ): Promise<Article> {
    const article = await dbClient.article.findUnique({
      where: {
        id: articleId,
      },
      include: {
        tags: true,
      },
    });

    if (!article) {
      throw new ExceptionClass('Article not found');
    }

    return article;
  }

  createArticle(body: CreateArticleDto): Promise<Article> {
    return dbClient.article.create({
      data: {
        ...body,
        status: body.status ?? ArticleStatus.draft,
        authorId: body.authorId ?? null,
        categoryId: body.categoryId ?? null,
        tags: {
          connectOrCreate: (body.tags ?? []).map((tagName: string) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
      include: {
        tags: true,
      },
    });
  }

  updateArticle(article: Article, body: UpdateArticleDto): Promise<Article> {
    return dbClient.article.update({
      where: { id: article.id },
      data: {
        ...body,
        tags: {
          set: [],
          connectOrCreate: (body.tags ?? []).map((tagName: string) => ({
            where: { name: tagName },
            create: { name: tagName },
          })),
        },
      },
      include: {
        tags: true,
      },
    });
  }

  deleteArticle(article: Article) {
    return dbClient.article.delete({
      where: {
        id: article.id,
      },
    });
  }
}
