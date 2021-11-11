import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { QuizDocument } from './quiz.schema';
import { QuizProgressDocument } from './quiz-progress.schema';

@Injectable()
export class QuizRepository {
  constructor(
    @InjectModel('Quiz') private quizModel: Model<QuizDocument>,
    @InjectModel('QuizProgress')
    private quizProgressModel: Model<QuizProgressDocument>,
  ) {}

  async getProgress(userId: string): Promise<QuizProgressDocument | null> {
    const progress = await this.quizProgressModel.findOne({
      user: new Types.ObjectId(userId),
    });

    return progress;
  }

  async getQuiz(): Promise<QuizDocument> {
    const [quiz] = await this.quizModel.find();

    if (!quiz) {
      throw new Error('Quiz shoud be defined in the database');
    }

    return quiz;
  }

  async refreshProgress(userId: string): Promise<void> {
    await this.quizProgressModel.findOneAndUpdate(
      { user: new Types.ObjectId(userId) },
      { $set: { user: userId, answers: [], result: null } },
      { upsert: true },
    );
  }

  async getResultText(resultId: Types.ObjectId): Promise<string> {
    const [quiz] = await this.quizModel.find();

    if (!quiz) {
      throw new Error('Quiz shoud be defined in the database');
    }

    const result = quiz.results.find((item) => item._id.equals(resultId));

    if (!result) {
      throw new Error(`Result with id ${resultId} not found`);
    }

    return result.text;
  }

  async addAnswer(
    progressId: Types.ObjectId,
    resultId: Types.ObjectId,
  ): Promise<QuizProgressDocument> {
    return this.quizProgressModel.findByIdAndUpdate(
      progressId,
      {
        $push: { answers: resultId },
      },
      { returnDocument: 'after' },
    );
  }

  async putAnswer(progressId: Types.ObjectId, result: Types.ObjectId) {
    await this.quizProgressModel.findByIdAndUpdate(progressId, {
      $set: { result },
    });
  }
}
