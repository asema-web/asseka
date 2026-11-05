import { useEffect, useState } from "react";
import { verdict } from "../lib/scoring";
import type { Attempt } from "../types";

export default function Result({ attempt, onRestart }: { attempt: Attempt; onRestart: () => void }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let cur = 0;
    const t = setInterval(() => {
      cur += 1;
      setN(Math.min(cur, attempt.percent));
      if (cur >= attempt.percent) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [attempt.percent]);

  const r = 70, c = 2 * Math.PI * r;
  return (
    <section className="card result">
      <div className="ring">
        <svg viewBox="0 0 180 180" width="200" height="200">
          <circle cx="90" cy="90" r={r} className="ring-bg" />
          <circle cx="90" cy="90" r={r} className="ring-fg" strokeDasharray={c}
            strokeDashoffset={c * (1 - n / 100)} transform="rotate(-90 90 90)" />
        </svg>
        <div className="pct">{n}%</div>
      </div>
      <p className="lead">Совпадений</p>
      <div className="stats">
        <div><b>{attempt.correctCount}</b><span>верных</span></div>
        <div><b>{attempt.wrongCount}</b><span>неверных</span></div>
      </div>
      <h2 className="verdict">{verdict(attempt.percent)}</h2>
      <button className="btn ghost" onClick={onRestart}>На главную</button>
    </section>
  );
}
