import { Types } from 'mongoose';

export interface QuizQuestion {
  text: string;
  options: string[];
}

export interface QuizAnswerEntiry {
  text: string;
  resultId: Types.ObjectId;
}

export interface QuizQuestionEntity {
  text: string;
  answers: QuizAnswerEntiry[];
}

export interface QuizResultEntity {
  _id: Types.ObjectId;
  text: string;
}

export type QUIZ_STATUS = 'done' | 'in_progress' | 'not_started';
