'use client';

import { useEffect, useState } from 'react';

export default function AssetsPage() {
  const [secret, setSecret] = useState('');
  const [assetUrl, setAssetUrl] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setSecret(localStorage.getItem('la-r2-upload-secret') || '');
  }, []);

  async function upload(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setAssetUrl('');
    localStorage.setItem('la-r2-upload-secret', secret);

    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/r2-upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}` },
      body: formData,
    });
    const payload = await response.json();
    setBusy(false);

    if (!response.ok) {
      setError(payload.error || 'No se pudo subir el archivo.');
      return;
    }

    setAssetUrl(payload.url);
  }

  return (
    <main className="landing">
      <section className="panel">
        <p className="kicker">Logia Abierta Studio</p>
        <h1>Assets R2</h1>
        <p>Sube imágenes, audios, videos o adjuntos a Cloudflare R2. Luego pega la URL pública en Keystatic.</p>
        <div className="actions">
          <a href="/keystatic">Abrir Keystatic</a>
          <a href="/" className="secondary">Inicio</a>
        </div>
      </section>

      <form className="panel form" onSubmit={upload}>
        <label>
          Secret del uploader
          <input name="secret" type="password" value={secret} onChange={(event) => setSecret(event.target.value)} required />
        </label>
        <label>
          Archivo
          <input name="file" type="file" required />
        </label>
        <label>
          Carpeta en R2
          <input name="folder" defaultValue="studio" placeholder="blog, authors, pages, podcast" />
        </label>
        <label>
          Nombre SEO del archivo
          <input name="filename" placeholder="historia-real-arco" />
        </label>
        <button type="submit" disabled={busy}>{busy ? 'Subiendo...' : 'Subir a R2'}</button>
      </form>

      {(assetUrl || error) && (
        <section className="panel result">
          {error ? (
            <p className="error">{error}</p>
          ) : (
            <>
              <p className="kicker">URL pública</p>
              <code>{assetUrl}</code>
              <div className="actions">
                <button type="button" className="secondary" onClick={() => navigator.clipboard.writeText(assetUrl)}>
                  Copiar URL
                </button>
                <a href={assetUrl} target="_blank" rel="noreferrer">Abrir asset</a>
              </div>
            </>
          )}
        </section>
      )}
    </main>
  );
}
