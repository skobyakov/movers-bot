import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { QuizQuestionEntity, QuizResultEntity } from './quiz.types';

export type QuizDocument = Quiz & mongoose.Document;

@Schema()
export class Quiz {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  welcomeMessage: string;

  @Prop(
    raw([
      {
        text: { type: String, required: true },
        answers: [
          {
            text: { type: String, required: true },
            resultId: { type: mongoose.Schema.Types.ObjectId, required: true },
          },
        ],
      },
    ]),
  )
  questions: QuizQuestionEntity[];

  @Prop(raw([{ text: { type: String } }]))
  results: QuizResultEntity[];
}

export const QuizSchema = SchemaFactory.createForClass(Quiz);
