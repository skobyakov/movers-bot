import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';

import { QuizQuestion, QUIZ_STATUS } from './quiz.types';
import { QuizDocument } from './quiz.schema';
import { QuizRepository } from './quiz.repository';

@Injectable()
export class QuizService {
  constructor(private readonly quizRepository: QuizRepository) {}

  private calculateResult(
    results: Types.ObjectId[],
    quiz: QuizDocument,
  ): Types.ObjectId {
    const score = {};
    quiz.results.forEach((item) => {
      score[item._id.toString()] = 0;
    });

    results.forEach((item) => {
      score[item.toString()] += 1;
    });

    let max = 0;
    let resultId = null;

    Object.keys(score).forEach((item) => {
      if (score[item] > max) {
        max = score[item];
        resultId = item;
      }
    });

    return new Types.ObjectId(resultId);
  }

  async getStatus(userId: string): Promise<QUIZ_STATUS> {
    const progress = await this.quizRepository.getProgress(userId);
    if (!progress) {
      return 'not_started';
    }

    if (progress.result) {
      return 'done';
    }

    return 'in_progress';
  }

  async start(
    userId: string,
  ): Promise<{ welcomeMessage: string; firstQuestion: QuizQuestion }> {
    await this.quizRepository.refreshProgress(userId);
    const quiz = await this.quizRepository.getQuiz();
    return {
      welcomeMessage: quiz.welcomeMessage,
      firstQuestion: {
        text: quiz.questions[0].text,
        options: quiz.questions[0].answers.map((item) => item.text),
      },
    };
  }

  async getResult(userId: string): Promise<string> {
    const progress = await this.quizRepository.getProgress(userId);

    if (!progress || !progress.result) {
      throw new Error('Result is not awailable');
    }

    return this.quizRepository.getResultText(progress.result);
  }

  async putAnswer(
    userId: string,
    answerText: string,
  ): Promise<QuizQuestion | null> {
    const progress = await this.quizRepository.getProgress(userId);
    const quiz = await this.quizRepository.getQuiz();

    if (!progress) {
      throw new Error('Progress is not awailable');
    }

    const step = progress.answers.length;
    const question = quiz.questions[step];

    if (!question) {
      throw new Error('Answer without question');
    }

    const answerIndex = question.answers.findIndex(
      (item) => item.text.toLowerCase() === answerText.toLowerCase(),
    );

    if (answerIndex === -1) {
      throw new Error('Answer is not valid');
    }

    const nextProgress = await this.quizRepository.addAnswer(
      progress._id,
      question.answers[answerIndex].resultId,
    );

    const nextQuestion = quiz.questions[step + 1];

    if (!nextQuestion) {
      const result = this.calculateResult(nextProgress.answers, quiz);
      await this.quizRepository.putAnswer(nextProgress._id, result);
      return null;
    }

    return {
      text: nextQuestion.text,
      options: nextQuestion.answers.map((item) => item.text),
    };
  }
}
