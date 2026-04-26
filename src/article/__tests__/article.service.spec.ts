import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

vi.mock('src/db/prisma/dbClient', () => ({
  default: {
    article: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

import dbClient from 'src/db/prisma/dbClient';
import { ArticleService } from '../article.service';
import { ArticleStatus } from 'src/db/prisma/client/enums';

describe('ArticleService', () => {
  let articleService: ArticleService;

  beforeEach(() => {
    articleService = new ArticleService();
    vi.clearAllMocks();
  });

  it('should return articles filtered by status', async () => {
    const mockArticles = [
      {
        id: '1',
        title: 'Article 1',
        status: ArticleStatus.published,
        categoryId: 'cat1',
        tags: [],
        category: {},
      },
    ];

    (dbClient.article.findMany as any).mockResolvedValue(mockArticles);

    const query = { status: ArticleStatus.published };
    const result = await articleService.getArticles(query);

    expect(dbClient.article.findMany).toHaveBeenCalledWith({
      where: { status: ArticleStatus.published },
      include: {
        tags: true,
        category: true,
      },
    });
    expect(result).toEqual(mockArticles);
  });

  it('should return articles filtered by categoryId', async () => {
    const mockArticles = [
      {
        id: '2',
        title: 'Article 2',
        status: ArticleStatus.draft,
        categoryId: 'cat2',
        tags: [],
        category: {},
      },
    ];

    (dbClient.article.findMany as any).mockResolvedValue(mockArticles);

    const query = { categoryId: 'cat2' };
    const result = await articleService.getArticles(query);

    expect(dbClient.article.findMany).toHaveBeenCalledWith({
      where: { categoryId: 'cat2' },
      include: {
        tags: true,
        category: true,
      },
    });

    expect(result).toEqual(mockArticles);
  });

  it('should return articles filtered by tag', async () => {
    const mockArticles = [
      {
        id: '3',
        title: 'Article 3',
        status: ArticleStatus.published,
        categoryId: 'cat3',
        tags: [{ name: 'tech' }],
        category: {},
      },
    ];

    (dbClient.article.findMany as any).mockResolvedValue(mockArticles);

    const query = { tag: 'tech' };
    const result = await articleService.getArticles(query);

    expect(dbClient.article.findMany).toHaveBeenCalledWith({
      where: {
        tags: {
          some: {
            name: 'tech',
          },
        },
      },
      include: {
        tags: true,
        category: true,
      },
    });
    expect(result).toEqual(mockArticles);
  });

  it('should return articles filtered by status, categoryId, and tag', async () => {
    const mockArticles = [
      {
        id: '4',
        title: 'Article 4',
        status: 'published',
        categoryId: 'cat4',
        tags: [{ name: 'science' }],
        category: {},
      },
    ];
    (dbClient.article.findMany as any).mockResolvedValue(mockArticles);

    const query = {
      status: ArticleStatus.published,
      categoryId: 'cat4',
      tag: 'science',
    };

    const result = await articleService.getArticles(query);

    expect(dbClient.article.findMany).toHaveBeenCalledWith({
      where: {
        status: ArticleStatus.published,
        categoryId: 'cat4',
        tags: {
          some: {
            name: 'science',
          },
        },
      },
      include: {
        tags: true,
        category: true,
      },
    });

    expect(result).toEqual(mockArticles);
  });

  it('should return article if found', async () => {
    const mockArticle = { id: '1', title: 'Test', tags: [{ name: 'tag1' }] };
    (dbClient.article.findUnique as any).mockResolvedValue(mockArticle);

    const result = await articleService.getArticleById('1');

    expect(dbClient.article.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
      include: { tags: true },
    });
    expect(result).toEqual(mockArticle);
  });

  it('should throw NotFoundException if article not found (default)', async () => {
    (dbClient.article.findUnique as any).mockResolvedValue(null);

    await expect(articleService.getArticleById('2')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw custom exception if provided', async () => {
    (dbClient.article.findUnique as any).mockResolvedValue(null);

    await expect(
      articleService.getArticleById('3', ForbiddenException),
    ).rejects.toThrow(ForbiddenException);
  });

  it('should pass the correct message to the exception', async () => {
    (dbClient.article.findUnique as any).mockResolvedValue(null);

    try {
      await articleService.getArticleById('4', ForbiddenException);
    } catch (e) {
      expect(e).toBeInstanceOf(ForbiddenException);
      expect(e.message).toBe('Article not found');
    }
  });

  it('should create an article with all fields and tags', async () => {
    const body = {
      title: 'Test Article',
      content: 'Content',
      status: ArticleStatus.published,
      authorId: 'author1',
      categoryId: 'cat1',
      tags: ['tech', 'news'],
    };

    const mockArticle = {
      id: '1',
      ...body,
      tags: body.tags.map((tagName) => ({ name: tagName })),
    };

    (dbClient.article.create as any).mockResolvedValue(mockArticle);

    const result = await articleService.createArticle(body);

    expect(dbClient.article.create).toHaveBeenCalledWith({
      data: {
        ...body,
        status: ArticleStatus.published,
        authorId: 'author1',
        categoryId: 'cat1',
        tags: {
          connectOrCreate: [
            { where: { name: 'tech' }, create: { name: 'tech' } },
            { where: { name: 'news' }, create: { name: 'news' } },
          ],
        },
      },
      include: {
        tags: true,
      },
    });
    expect(result).toEqual(mockArticle);
  });

  it('should set default status and nulls for missing optional fields', async () => {
    const body = {
      title: 'Draft Article',
      content: 'Draft content',
    };

    const mockArticle = {
      id: '2',
      ...body,
      status: ArticleStatus.draft,
      authorId: null,
      categoryId: null,
      tags: [],
    };

    (dbClient.article.create as any).mockResolvedValue(mockArticle);

    const result = await articleService.createArticle(body);

    expect(dbClient.article.create).toHaveBeenCalledWith({
      data: {
        ...body,
        status: ArticleStatus.draft,
        authorId: null,
        categoryId: null,
        tags: {
          connectOrCreate: [],
        },
      },
      include: {
        tags: true,
      },
    });

    expect(result).toEqual(mockArticle);
  });

  it('should handle empty tags array', async () => {
    const body = {
      title: 'No Tags Article',
      content: 'No tags here',
      tags: [],
    };

    const mockArticle = {
      id: '3',
      ...body,
      status: ArticleStatus.draft,
      authorId: null,
      categoryId: null,
      tags: [],
    };

    (dbClient.article.create as any).mockResolvedValue(mockArticle);

    const result = await articleService.createArticle(body);

    expect(dbClient.article.create).toHaveBeenCalledWith({
      data: {
        ...body,
        status: ArticleStatus.draft,
        authorId: null,
        categoryId: null,
        tags: {
          connectOrCreate: [],
        },
      },
      include: {
        tags: true,
      },
    });
    expect(result).toEqual(mockArticle);
  });

  it('should update article with new data and tags', async () => {
    const article = {
      id: '1',
      title: 'Old Title',
      content: 'Old content',
      status: ArticleStatus.draft,
      categoryId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: 'userId1',
    };

    const body = {
      title: 'Updated Title',
      content: 'Updated content',
      tags: ['tech', 'news'],
    };

    const mockArticle = {
      id: '1',
      title: 'Updated Title',
      content: 'Updated content',
      tags: [{ name: 'tech' }, { name: 'news' }],
    };

    (dbClient.article.update as any).mockResolvedValue(mockArticle);

    const result = await articleService.updateArticle(article, body);

    expect(dbClient.article.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: {
        ...body,
        tags: {
          set: [],
          connectOrCreate: [
            { where: { name: 'tech' }, create: { name: 'tech' } },
            { where: { name: 'news' }, create: { name: 'news' } },
          ],
        },
      },
      include: {
        tags: true,
      },
    });
    expect(result).toEqual(mockArticle);
  });

  it('should update article with no tags if tags are missing', async () => {
    const article = {
      id: '2',
      title: 'Old Title',
      content: 'Old content',
      status: ArticleStatus.draft,
      categoryId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: 'userId1',
    };

    const body = {
      title: 'No Tags Update',
      content: 'No tags here',
    };

    const mockArticle = {
      id: '2',
      title: 'No Tags Update',
      content: 'No tags here',
      tags: [],
    };

    (dbClient.article.update as any).mockResolvedValue(mockArticle);

    const result = await articleService.updateArticle(article, body);

    expect(dbClient.article.update).toHaveBeenCalledWith({
      where: { id: '2' },
      data: {
        ...body,
        tags: {
          set: [],
          connectOrCreate: [],
        },
      },
      include: {
        tags: true,
      },
    });
    expect(result).toEqual(mockArticle);
  });

  it('should update article with empty tags array', async () => {
    const article = {
      id: '3',
      title: 'Old Title',
      content: 'Old content',
      status: ArticleStatus.draft,
      categoryId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: 'userId1',
    };

    const body = {
      title: 'Empty Tags Update',
      content: 'Empty tags',
      tags: [],
    };

    const mockArticle = {
      id: '3',
      title: 'Empty Tags Update',
      content: 'Empty tags',
      tags: [],
    };

    (dbClient.article.update as any).mockResolvedValue(mockArticle);

    const result = await articleService.updateArticle(article, body);

    expect(dbClient.article.update).toHaveBeenCalledWith({
      where: { id: '3' },
      data: {
        ...body,
        tags: {
          set: [],
          connectOrCreate: [],
        },
      },
      include: {
        tags: true,
      },
    });
    expect(result).toEqual(mockArticle);
  });
});
