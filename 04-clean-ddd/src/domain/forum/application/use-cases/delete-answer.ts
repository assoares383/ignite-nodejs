import { AnswersRepository } from '../repositories/answers-repository'

interface AnswerQuestionUseCaseRequest {
  authorId: string
  answerId: string
}

interface AnswerQuestionUseCaseResponse {}

export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      throw new Error('Question not found.')
    }

    if (authorId !== answer.authorId.toString()) {
      throw new Error('Not Allowed.')
    }

    await this.answerRepository.delete(answer)

    return {}
  }
}
