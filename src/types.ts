export type Question = { id: number; text: string; multi: boolean; options: string[]; correct: number[] };
export type AnswerRecord = { questionId: number; selected: number[]; score: number };
export type Attempt = {
  id: string; date: string; percent: number; correctCount: number; wrongCount: number; answers: AnswerRecord[];
};
