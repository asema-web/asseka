import { questions } from "../data";
import type { Attempt, Question } from "../types";

// Одиночный выбор: 1 балл за верный ответ, иначе 0.
// Множественный: (верные выбранные − неверные выбранные) / число верных, не меньше 0.
export function scoreQuestion(q: Question, sel: number[]): number {
  const hits = sel.filter((i) => q.correct.includes(i)).length;
  const wrong = sel.length - hits;
  if (!q.multi) return hits === 1 && wrong === 0 ? 1 : 0;
  return Math.max(0, (hits - wrong) / q.correct.length);
}

export function buildAttempt(answers: Record<number, number[]>): Attempt {
  const recs = questions.map((q) => {
    const selected = answers[q.id] ?? [];
    return { questionId: q.id, selected, score: scoreQuestion(q, selected) };
  });
  const total = recs.reduce((s, r) => s + r.score, 0);
  const correctCount = recs.filter((r) => r.score === 1).length;
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    date: new Date().toISOString(),
    percent: Math.round((total / questions.length) * 100),
    correctCount,
    wrongCount: questions.length - correctCount,
    answers: recs,
  };
}

export function verdict(p: number): string {
  if (p <= 30) return "Дияна, вы вообще знакомы?";
  if (p <= 50) return "Что-то знаешь, но расследование провалено";
  if (p <= 70) return "Неплохо, но есть пробелы";
  if (p <= 90) return "Ты действительно хорошо её знаешь!";
  return "Ты официально эксперт по её типажу";
}
