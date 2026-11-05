import { useState } from "react";
import { questions } from "../data";

export default function Quiz({ onFinish }: { onFinish: (a: Record<number, number[]>) => void }) {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number[]>>({});
  const q = questions[i];
  const sel = answers[q.id] ?? [];
  const last = i === questions.length - 1;

  const toggle = (idx: number) => {
    setAnswers((prev) => {
      const cur = prev[q.id] ?? [];
      const next = q.multi ? (cur.includes(idx) ? cur.filter((x) => x !== idx) : [...cur, idx]) : [idx];
      return { ...prev, [q.id]: next };
    });
  };

  return (
    <section className="card quiz">
      <div className="progress-row">
        <span>Вопрос {i + 1} из {questions.length}</span>
        <span>{Math.round((i / questions.length) * 100)}%</span>
      </div>
      <div className="bar"><div className="fill" style={{ width: `${((i + 1) / questions.length) * 100}%` }} /></div>

      <div key={q.id} className="slide">
        <h2>{q.text}</h2>
        <div className="options" role={q.multi ? "group" : "radiogroup"}>
          {q.options.map((o, idx) => (
            <button key={idx} className={`opt ${sel.includes(idx) ? "on" : ""}`} onClick={() => toggle(idx)}
              aria-pressed={sel.includes(idx)}>
              <span className={q.multi ? "box" : "dot"} />{o}
            </button>
          ))}
        </div>
      </div>

      <div className="nav">
        <button className="btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>Назад</button>
        <button className="btn" disabled={sel.length === 0}
          onClick={() => (last ? onFinish(answers) : setI(i + 1))}>
          {last ? "Завершить допрос" : "Далее"}
        </button>
      </div>
    </section>
  );
}
