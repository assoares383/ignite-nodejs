import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { CommentWithAuthor } from "@/domain/forum/enterprise/entities/value-objects/comments-with-author";
import { Injectable } from "@nestjs/common";
import { PrismaAnswerCommentMapper } from "../mappers/prisma-answer-comment-mapper";
import { PrismaCommentWithAuthorMapper } from "../mappers/prisma-comment-with-author-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  constructor(private prisma: PrismaService) { }

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    if (!answerComment) {
      return null;
    }

    return PrismaAnswerCommentMapper.toDomain(answerComment);
  }
  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams
  ): Promise<AnswerComment[]> {
    const question = await this.prisma.comment.findMany({
      where: {
        answerId
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return question.map(PrismaAnswerCommentMapper.toDomain);
  }
  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<CommentWithAuthor[]> {
    const answerComments = await this.prisma.comment.findMany({
      where: {
        answerId
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (page - 1) * 20,
    });

    return answerComments.map(PrismaCommentWithAuthorMapper.toDomain);
  }
  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment);

    await this.prisma.comment.create({
      data,
    });
  }
  save(question: Question): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async delete(answerComment: AnswerComment): Promise<void> {
    await this.prisma.comment.delete({
      where: {
        id: answerComment.id.toString(),
      },
    });
  }
}
