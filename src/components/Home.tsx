export default function Home({ onStart }: { onStart: () => void }) {
  return (
    <section className="card hero">
      <h1 className="title">THE INTERROGATION</h1>
      <p className="lead">Думаешь, ты знаешь её вкус? Сейчас проверим.</p>
      <button className="btn" onClick={onStart}>НАЧАТЬ ДОПРОС</button>
    </section>
  );
}
