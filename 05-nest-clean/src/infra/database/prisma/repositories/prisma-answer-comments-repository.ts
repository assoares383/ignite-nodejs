import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/question-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaAnswerCommentsRepository implements QuestionsRepository {
  findById(id: string): Promise<Question | null> {
    throw new Error("Method not implemented.");
  }
  findManyRecent(params: PaginationParams): Promise<Question[]> {
    throw new Error("Method not implemented.");
  }
  findBySlug(slug: string): Promise<Question | null> {
    throw new Error("Method not implemented.");
  }
  create(question: Question): Promise<void> {
    throw new Error("Method not implemented.");
  }
  delete(question: Question): Promise<void> {
    throw new Error("Method not implemented.");
  }
  save(question: Question): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
