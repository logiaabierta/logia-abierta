export default function Home() {
  return (
    <main className="landing">
      <section className="panel">
        <p className="kicker">Logia Abierta</p>
        <h1>Studio editorial</h1>
        <p>
          Keystatic publica Markdown, MDX y JSON directo al branch main. Los assets públicos se suben a Cloudflare R2.
        </p>
        <div className="actions">
          <a href="/keystatic">Abrir Keystatic</a>
          <a href="/assets" className="secondary">Subir assets R2</a>
        </div>
      </section>
    </main>
  );
}
