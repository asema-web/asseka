import { useState } from "react";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Result from "./components/Result";
import Admin from "./components/Admin";
import { buildAttempt } from "./lib/scoring";
import { saveAttempt } from "./lib/storage";
import type { Attempt } from "./types";

const isAdminRoute = () =>
  window.location.pathname.replace(/\/+$/, "") === "/admin" || window.location.hash === "#/admin";

export default function App() {
  const [screen, setScreen] = useState<"home" | "quiz" | "result">("home");
  const [attempt, setAttempt] = useState<Attempt | null>(null);

  if (isAdminRoute()) return <Admin />;

  const finish = (answers: Record<number, number[]>) => {
    const a = buildAttempt(answers);
    saveAttempt(a);
    setAttempt(a);
    setScreen("result");
  };

  return (
    <main className="stage">
      <div className="glow" aria-hidden />
      {screen === "home" && <Home onStart={() => setScreen("quiz")} />}
      {screen === "quiz" && <Quiz onFinish={finish} />}
      {screen === "result" && attempt && <Result attempt={attempt} onRestart={() => setScreen("home")} />}
    </main>
  );
}
