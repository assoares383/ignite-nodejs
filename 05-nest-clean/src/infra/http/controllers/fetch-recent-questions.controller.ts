import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { BadRequestException, Controller, Get, Query } from "@nestjs/common";
import { z } from "zod";
import { QuestionPresenter } from "../presenters/question-presenter";

const pageQueryParamsSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamsSchema);

type PageQueryParamsSchema = z.infer<typeof pageQueryParamsSchema>;

@Controller("/questions")
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) { }

  @Get()
  async handle(
    @Query("page", queryValidationPipe) page: PageQueryParamsSchema,
  ) {
    const result = await this.fetchRecentQuestions.execute({
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const questions = result.value.questions

    return {
      questions: questions.map(QuestionPresenter.toHTTP),
    };
  }
}
