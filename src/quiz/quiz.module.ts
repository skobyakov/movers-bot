import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizService } from './quiz.service';
import { QuizRepository } from './quiz.repository';
import { QuizSchema } from './quiz.schema';
import { QuizProgressSchema } from './quiz-progress.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Quiz', schema: QuizSchema },
      { name: 'QuizProgress', schema: QuizProgressSchema },
    ]),
  ],
  controllers: [],
  providers: [QuizService, QuizRepository],
  exports: [QuizService],
})
export class QuizModule {}
