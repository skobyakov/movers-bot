export interface QuizQuestion {
  text: string;
  options: string[];
}

export type QUIZ_STATUS = 'done' | 'in_progress' | 'not_started';
