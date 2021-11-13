import { Schema, Document, Types } from 'mongoose';

export const QuizSchema = new Schema({
  title: { type: String, required: true },
  welcomeMessage: { type: String, required: true },
  questions: [
    {
      text: { type: String, required: true },
      answers: [
        {
          text: { type: String, required: true },
          resultId: { type: Schema.Types.ObjectId, required: true },
        },
      ],
    },
  ],
  results: [
    {
      text: { type: String },
    },
  ],
});

export interface QuizDocument extends Document {
  title: string;
  welcomeMessage: string;
  questions: {
    text: string;
    answers: {
      text: string;
      resultId: Types.ObjectId;
    }[];
  }[];
  results: {
    _id: Types.ObjectId;
    text: string;
  }[];
}
