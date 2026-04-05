import { randomUUID } from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { articles } from 'src/db/articles';
import { ArticleQueryDto, CreateArticleDto, UpdateArticleDto } from './dto';
import { hasStatus, hasCategoryId, hasTag } from './utils';
import { Article, ArticleStatus } from './types';

@Injectable()
export class ArticleService {
  articleHasPropValueFact;
  getArticles(query: ArticleQueryDto): Article[] {
    if (Object.values(query).length) {
      return articles.filter(
        (article) =>
          hasStatus(article, query) &&
          hasCategoryId(article, query) &&
          hasTag(article, query),
      );
    }
    return articles;
  }

  getArticleById(articleId: string): Article {
    const article = articles.find(({ id }) => id === articleId);
    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  createArticle(body: CreateArticleDto): Article {
    const newArticle: Article = {
      id: randomUUID(),
      ...body,
      status: body.status ?? ArticleStatus.DRAFT,
      authorId: body.authorId ?? null,
      categoryId: body.categoryId ?? null,
      tags: body.tags ?? [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    articles.push(newArticle);

    return newArticle;
  }

  updateArticle(article: Article, body: UpdateArticleDto) {
    const updatedArticle = {
      ...article,
      ...body,
    };

    articles.map((dbArticle) =>
      dbArticle.id !== article.id ? dbArticle : updatedArticle,
    );
    return updatedArticle;
  }

  deleteArticle(article: Article) {
    articles.filter(({ id }) => id !== article.id);
  }
}
