import { Injectable } from '@nestjs/common';
import dbClient from 'src/db/prisma/dbClient';
import { CreateCommentDto } from './dto';
import { Comment } from 'src/db/prisma/client/client';
import { NotFoundError } from 'src/common/errors/custom.errors';

@Injectable()
export class CommentService {
  async getCommentById(commentId: string): Promise<Comment> {
    const comment = await dbClient.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new NotFoundError('Comment not found');
    }

    return comment;
  }

  getArticleComments(articleId: string): Promise<Comment[]> {
    return dbClient.comment.findMany({
      where: { articleId },
    });
  }

  createComment(body: CreateCommentDto): Promise<Comment> {
    return dbClient.comment.create({
      data: {
        ...body,
        authorId: body.authorId ?? null,
      },
    });
  }

  deleteComment(comment: Comment) {
    return dbClient.comment.delete({
      where: {
        id: comment.id,
      },
    });
  }
}
