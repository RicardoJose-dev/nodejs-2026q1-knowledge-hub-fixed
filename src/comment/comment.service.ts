import { randomUUID } from 'crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { comments } from 'src/db/comments';
import { CreateCommentDto } from './dto';
import { Comment } from './types';

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
}
