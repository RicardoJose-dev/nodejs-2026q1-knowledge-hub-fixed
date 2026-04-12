import { Injectable, NotFoundException } from '@nestjs/common';
import dbClient from 'src/db/prisma/dbClient';
import { CreateCommentDto } from './dto';
import { Comment } from 'src/db/prisma/client/client';

@Injectable()
export class CommentService {
  async getCommentById(commentId: string): Promise<Comment> {
    const comment = await dbClient.comment.findUnique({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async getArticleComments(articleId: string): Promise<Comment[]> {
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
    dbClient.comment.delete({
      where: {
        id: comment.id,
      },
    });
  }
}
