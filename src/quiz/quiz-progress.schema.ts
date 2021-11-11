import { Schema, Document, Types } from 'mongoose';

export const QuizProgressSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  result: { type: Schema.Types.ObjectId, default: null },
  answers: { type: [Schema.Types.ObjectId] },
});

export interface QuizProgressDocument extends Document {
  user: Types.ObjectId;
  result: Types.ObjectId | null;
  answers: Types.ObjectId[];
}
