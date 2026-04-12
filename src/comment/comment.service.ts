import { randomUUID } from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { comments } from 'src/db/comments';
import { CreateCommentDto } from './dto';
import { Comment } from './types';
import { User } from 'src/db/prisma/client/client';
import { Article } from 'src/article/types';

@Injectable()
export class CommentService {
  getCommentById(commentId: string): Comment {
    const comment = comments.find((comment) => comment.id === commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  getArticleComments(articleId: string): Comment[] {
    return comments.filter((comment) => comment.articleId === articleId);
  }

  createComment(body: CreateCommentDto): Comment {
    const newComment: Comment = {
      id: randomUUID(),
      ...body,
      authorId: body.authorId ?? null,
      createdAt: Date.now(),
    };

    comments.push(newComment);
    return newComment;
  }

  deleteComment(comment: Comment) {
    const commentIndex = comments.findIndex(({ id }) => id === comment.id);
    comments.splice(commentIndex, 1);
  }

  deleteUserComments(user: User) {
    for (let i = comments.length - 1; i >= 0; i--) {
      if (comments[i].authorId === user.id) {
        comments.splice(i, 1);
      }
    }
  }

  removeArticleFromComment(article: Article) {
    for (let i = comments.length - 1; i >= 0; i--) {
      if (comments[i].articleId === article.id) {
        comments.splice(i, 1);
      }
    }
  }
}
