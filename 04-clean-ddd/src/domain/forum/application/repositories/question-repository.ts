import { PaginationParams } from '@/core/repositories/pagination-params'
import { Question } from '../../enterprise/entities/question'

export interface QuestionsRepository {
  findById(id: string): Promise<Question | null>
  findManyRecent(params: PaginationParams): Promise<Question[]>
  findBySlug(slug: string): Promise<Question | null>
  create(question: Question): Promise<void>
  delete(question: Question): Promise<void>
  save(question: Question): Promise<void>
}
