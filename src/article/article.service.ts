import { randomUUID } from 'crypto';
import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { articles } from 'src/db/articles';
import { ArticleQueryDto, CreateArticleDto, UpdateArticleDto } from './dto';
import { hasStatus, hasCategoryId, hasTag } from './utils';
import { Article, ArticleStatus } from './types';
import { User } from 'src/db/prisma/client/client';
import { Category } from 'src/db/prisma/client/client';

@Injectable()
export class ArticleService {
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

  getArticleById(
    articleId: string,
    ExceptionClass: new (message: string) => HttpException = NotFoundException,
  ): Article {
    const article = articles.find(({ id }) => id === articleId);
    if (!article) {
      throw new ExceptionClass('Article not found');
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
      updatedAt: Date.now(),
    };

    articles.forEach((dbArticle, index) => {
      if (dbArticle.id === article.id) {
        articles[index] = updatedArticle;
      }
    });

    return updatedArticle;
  }

  deleteArticle(article: Article) {
    const articleIndex = articles.findIndex(({ id }) => id === article.id);
    articles.splice(articleIndex, 1);
  }

  removeUserFromArticle(user: User) {
    articles.forEach((article, index) => {
      if (article.authorId === user.id) {
        articles[index].authorId = null;
      }
    });
  }

  removeCategoryFromArticle(category: Category) {
    articles.forEach((article, index) => {
      if (article.categoryId === category.id) {
        articles[index].categoryId = null;
      }
    });
  }
}
