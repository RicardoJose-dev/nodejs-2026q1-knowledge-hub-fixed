import { TransformInterceptor } from '../TransformInterceptor';
import { UserResponseDto } from 'src/user/dto';
import { ArticleResponseDto } from 'src/article/dto';
import { CommentResponseDto } from 'src/comment/dto';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of, firstValueFrom } from 'rxjs';

describe('TransformInterceptor', () => {
  let interceptor: TransformInterceptor<
    UserResponseDto | ArticleResponseDto | CommentResponseDto
  >;
  let context: ExecutionContext;

  describe('UserResponseDto', () => {
    beforeEach(() => {
      interceptor = new TransformInterceptor(UserResponseDto);
      context = {} as ExecutionContext;
    });

    it('should transform a plain user object to UserResponseDto and exclude password', async () => {
      const plainUser = {
        id: '1',
        login: 'testuser',
        role: 'admin',
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-02T00:00:00Z'),
        password: 'secret',
      };

      const callHandler: CallHandler = {
        handle: () => of(plainUser),
      };

      const result = await firstValueFrom(
        interceptor.intercept(context, callHandler),
      );

      expect(result).toBeInstanceOf(UserResponseDto);
      expect(result).toMatchObject({
        id: '1',
        login: 'testuser',
        role: 'admin',
        createdAt: new Date('2023-01-01T00:00:00Z').getTime(),
        updatedAt: new Date('2023-01-02T00:00:00Z').getTime(),
      });
      expect(result).not.toHaveProperty('password');
    });

    it('should transform an array of users', async () => {
      const plainUsers = [
        {
          id: '1',
          login: 'user1',
          role: 'admin',
          createdAt: new Date('2023-01-01T00:00:00Z'),
          updatedAt: new Date('2023-01-02T00:00:00Z'),
          password: 'secret1',
        },
        {
          id: '2',
          login: 'user2',
          role: 'viewer',
          createdAt: new Date('2023-02-01T00:00:00Z'),
          updatedAt: new Date('2023-02-02T00:00:00Z'),
          password: 'secret2',
        },
      ];

      const callHandler: CallHandler = {
        handle: () => of(plainUsers),
      };

      const result = await firstValueFrom(
        interceptor.intercept(context, callHandler),
      );

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBeInstanceOf(UserResponseDto);
      expect(result[1]).toBeInstanceOf(UserResponseDto);
      expect(result[0]).not.toHaveProperty('password');
      expect(result[1]).not.toHaveProperty('password');
      expect(result[0].createdAt).toBe(
        new Date('2023-01-01T00:00:00Z').getTime(),
      );
      expect(result[1].createdAt).toBe(
        new Date('2023-02-01T00:00:00Z').getTime(),
      );
    });

    it('should handle null or undefined gracefully', async () => {
      const callHandler: CallHandler = {
        handle: () => of(null),
      };

      const result = await firstValueFrom(
        interceptor.intercept(context, callHandler),
      );
      expect(result).toBeNull();
    });
  });

  describe('ArticleResponseDto', () => {
    beforeEach(() => {
      interceptor = new TransformInterceptor(ArticleResponseDto);
      context = {} as ExecutionContext;
    });

    it('should transform a plain article object to ArticleResponseDto', async () => {
      const plainArticle = {
        id: 'a1',
        status: 'published',
        title: 'Test Article',
        categoryId: 'cat1',
        content: 'Some content',
        authorId: 'author1',
        createdAt: new Date('2023-01-01T00:00:00Z'),
        updatedAt: new Date('2023-01-02T00:00:00Z'),
        tags: [{ name: 'tech' }, { name: 'news' }],
        extraField: 'should be excluded',
      };

      const callHandler: CallHandler = {
        handle: () => of(plainArticle),
      };

      const result = await firstValueFrom(
        interceptor.intercept(context, callHandler),
      );

      expect(result).toBeInstanceOf(ArticleResponseDto);
      expect(result).toMatchObject({
        id: 'a1',
        status: 'published',
        title: 'Test Article',
        categoryId: 'cat1',
        content: 'Some content',
        authorId: 'author1',
        createdAt: new Date('2023-01-01T00:00:00Z').getTime(),
        updatedAt: new Date('2023-01-02T00:00:00Z').getTime(),
        tags: ['tech', 'news'],
      });
      expect(result).not.toHaveProperty('extraField');
    });

    it('should transform an array of articles', async () => {
      const plainArticles = [
        {
          id: 'a1',
          status: 'published',
          title: 'Article 1',
          categoryId: 'cat1',
          content: 'Content 1',
          authorId: 'author1',
          createdAt: new Date('2023-01-01T00:00:00Z'),
          updatedAt: new Date('2023-01-02T00:00:00Z'),
          tags: [{ name: 'tech' }],
        },
        {
          id: 'a2',
          status: 'draft',
          title: 'Article 2',
          categoryId: 'cat2',
          content: 'Content 2',
          authorId: 'author2',
          createdAt: new Date('2023-02-01T00:00:00Z'),
          updatedAt: new Date('2023-02-02T00:00:00Z'),
          tags: [{ name: 'science' }, { name: 'health' }],
        },
      ];

      const callHandler: CallHandler = {
        handle: () => of(plainArticles),
      };

      const result = await firstValueFrom(
        interceptor.intercept(context, callHandler),
      );

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBeInstanceOf(ArticleResponseDto);
      expect(result[1]).toBeInstanceOf(ArticleResponseDto);
      expect(result[0].tags).toEqual(['tech']);
      expect(result[1].tags).toEqual(['science', 'health']);
      expect(result[0].createdAt).toBe(
        new Date('2023-01-01T00:00:00Z').getTime(),
      );
      expect(result[1].createdAt).toBe(
        new Date('2023-02-01T00:00:00Z').getTime(),
      );
    });

    it('should handle missing tags gracefully', async () => {
      const plainArticle = {
        id: 'a3',
        status: 'published',
        title: 'No Tags Article',
        categoryId: 'cat3',
        content: 'No tags',
        authorId: 'author3',
        createdAt: new Date('2023-03-01T00:00:00Z'),
        updatedAt: new Date('2023-03-02T00:00:00Z'),
      };

      const callHandler: CallHandler = {
        handle: () => of(plainArticle),
      };

      const result = await firstValueFrom(
        interceptor.intercept(context, callHandler),
      );
      expect(result.tags).toEqual([]);
    });

    it('should handle null or undefined gracefully', async () => {
      const callHandler: CallHandler = {
        handle: () => of(null),
      };

      const result = await firstValueFrom(
        interceptor.intercept(context, callHandler),
      );
      expect(result).toBeNull();
    });
  });

  describe('CommentResponseDto', () => {
    beforeEach(() => {
      interceptor = new TransformInterceptor(CommentResponseDto);
      context = {} as ExecutionContext;
    });

    it('should transform a plain comment object to CommentResponseDto', async () => {
      const plainComment = {
        id: 'c1',
        content: 'Nice article!',
        authorId: 'user1',
        articleId: 'a1',
        createdAt: new Date('2023-01-01T00:00:00Z'),
        extraField: 'should be excluded',
      };

      const callHandler: CallHandler = {
        handle: () => of(plainComment),
      };

      const result = await firstValueFrom(
        interceptor.intercept(context, callHandler),
      );

      expect(result).toBeInstanceOf(CommentResponseDto);
      expect(result).toMatchObject({
        id: 'c1',
        content: 'Nice article!',
        authorId: 'user1',
        articleId: 'a1',
        createdAt: new Date('2023-01-01T00:00:00Z').getTime(),
      });
      expect(result).not.toHaveProperty('extraField');
    });

    it('should transform an array of comments', async () => {
      const plainComments = [
        {
          id: 'c1',
          content: 'First comment',
          authorId: 'user1',
          articleId: 'a1',
          createdAt: new Date('2023-01-01T00:00:00Z'),
        },
        {
          id: 'c2',
          content: 'Second comment',
          authorId: 'user2',
          articleId: 'a1',
          createdAt: new Date('2023-01-02T00:00:00Z'),
        },
      ];

      const callHandler: CallHandler = {
        handle: () => of(plainComments),
      };

      const result = await firstValueFrom(
        interceptor.intercept(context, callHandler),
      );

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBeInstanceOf(CommentResponseDto);
      expect(result[1]).toBeInstanceOf(CommentResponseDto);
      expect(result[0].createdAt).toBe(
        new Date('2023-01-01T00:00:00Z').getTime(),
      );
      expect(result[1].createdAt).toBe(
        new Date('2023-01-02T00:00:00Z').getTime(),
      );
    });

    it('should handle null or undefined gracefully', async () => {
      const callHandler: CallHandler = {
        handle: () => of(null),
      };

      const result = await firstValueFrom(
        interceptor.intercept(context, callHandler),
      );
      expect(result).toBeNull();
    });
  });
});
