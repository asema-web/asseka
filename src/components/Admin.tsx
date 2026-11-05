import { useState } from "react";
import { ADMIN_PIN } from "../config";
import { questions } from "../data";
import { clearAttempts, loadAttempts } from "../lib/storage";
import type { Attempt } from "../types";

const AUTH = "interrogation.admin";
const fmt = (d: string) => new Date(d).toLocaleString("ru-RU");

export default function Admin() {
  const [ok, setOk] = useState(sessionStorage.getItem(AUTH) === "1");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>(loadAttempts());
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  const login = () => {
    if (pin === ADMIN_PIN) { sessionStorage.setItem(AUTH, "1"); setOk(true); } else setErr(true);
  };

  if (!ok) {
    return (
      <main className="stage"><div className="glow" aria-hidden />
        <section className="card hero">
          <h2>Доступ закрыт</h2>
          <input className="pin" type="password" inputMode="numeric" placeholder="PIN-код" value={pin}
            onChange={(e) => { setPin(e.target.value); setErr(false); }}
            onKeyDown={(e) => e.key === "Enter" && login()} />
          {err && <p className="err">Неверный PIN-код</p>}
          <button className="btn" onClick={login}>Войти</button>
        </section>
      </main>
    );
  }

  const sorted = [...attempts].sort((a, b) => b.date.localeCompare(a.date));
  const avg = attempts.length ? Math.round(attempts.reduce((s, a) => s + a.percent, 0) / attempts.length) : 0;
  const opened = attempts.find((a) => a.id === openId);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), attempts }, null, 2)],
      { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `interrogation-results-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="stage admin"><div className="glow" aria-hidden />
      <section className="card wide">
        <h2>Админ-панель</h2>
        <div className="stats">
          <div><b>{attempts.length}</b><span>завершённых тестов</span></div>
          <div><b>{avg}%</b><span>средний результат</span></div>
          <div><b>{sorted[0] ? `${sorted[0].percent}%` : "—"}</b><span>последний результат</span></div>
        </div>
        {sorted[0] && <p className="muted">Последнее прохождение: {fmt(sorted[0].date)}</p>}
        <div className="nav wrap">
          <button className="btn ghost" onClick={() => setAttempts(loadAttempts())}>Обновить данные</button>
          <button className="btn ghost" onClick={exportJson} disabled={!attempts.length}>Экспортировать результаты</button>
          {!confirm
            ? <button className="btn danger" onClick={() => setConfirm(true)} disabled={!attempts.length}>Удалить результаты</button>
            : <>
                <button className="btn danger" onClick={() => { clearAttempts(); setAttempts([]); setOpenId(null); setConfirm(false); }}>
                  Да, удалить всё
                </button>
                <button className="btn ghost" onClick={() => setConfirm(false)}>Отмена</button>
              </>}
        </div>
      </section>

      <section className="card wide">
        <h3>История прохождений</h3>
        {!sorted.length && <p className="muted">Пока никто не проходил тест.</p>}
        {sorted.map((a) => (
          <button key={a.id} className={`row ${a.id === openId ? "on" : ""}`} onClick={() => setOpenId(a.id === openId ? null : a.id)}>
            <span>{fmt(a.date)}</span><span>{a.percent}%</span><span>{a.correctCount} верных</span>
          </button>
        ))}
      </section>

      {opened && (
        <section className="card wide">
          <h3>Ответы от {fmt(opened.date)}</h3>
          {questions.map((q) => {
            const r = opened.answers.find((x) => x.questionId === q.id);
            const sel = r?.selected ?? [];
            const score = r?.score ?? 0;
            return (
              <div key={q.id} className="qa">
                <h4>{q.id}. {q.text}</h4>
                <ul>
                  {q.options.map((o, idx) => (
                    <li key={idx} className={`${q.correct.includes(idx) ? "right" : ""} ${sel.includes(idx) ? "picked" : ""}`}>
                      {o}
                      {sel.includes(idx) && <em> — выбрала Дияна</em>}
                      {q.correct.includes(idx) && <em> — правильный</em>}
                    </li>
                  ))}
                </ul>
                <p className={score === 1 ? "ok" : score > 0 ? "part" : "bad"}>
                  {score === 1 ? "Верно" : score > 0 ? "Частично" : "Неверно"} · баллы: {score.toFixed(2)} из 1
                </p>
              </div>
            );
          })}
        </section>
      )}
    </main>
  );
}
