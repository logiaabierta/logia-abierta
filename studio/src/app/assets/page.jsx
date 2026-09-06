'use client';

import { useEffect, useState } from 'react';

export default function AssetsPage() {
  const [secret, setSecret] = useState('');
  const [assetUrl, setAssetUrl] = useState('');
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [listing, setListing] = useState(false);
  const [prefix, setPrefix] = useState('');

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
    setPrefix(String(formData.get('folder') || ''));
    await loadAssets(String(formData.get('folder') || ''));
  }

  async function loadAssets(nextPrefix = prefix) {
    setListing(true);
    setError('');
    localStorage.setItem('la-r2-upload-secret', secret);

    const params = new URLSearchParams();
    if (nextPrefix) params.set('prefix', nextPrefix);

    const response = await fetch(`/api/r2-upload?${params.toString()}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const payload = await response.json();
    setListing(false);

    if (!response.ok) {
      setError(payload.error || 'No se pudo leer la biblioteca R2.');
      return;
    }

    setAssets(payload.objects || []);
  }

  return (
    <main className="landing">
      <section className="panel">
        <p className="kicker">Logia Abierta Studio</p>
        <h1>Biblioteca R2</h1>
        <p>
          Sube imágenes, audios, videos o adjuntos a Cloudflare R2. Keystatic guarda la URL pública: copia el enlace y pégalo en autores, artículos, podcasts, audio o videos.
        </p>
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
          <input name="folder" defaultValue="studio" placeholder="authors, blog, podcast, audio, videos" />
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

      <section className="panel library">
        <div>
          <p className="kicker">Browse R2</p>
          <h2>Archivos publicados</h2>
        </div>
        <div className="library-controls">
          <label>
            Carpeta / prefix
            <input value={prefix} onChange={(event) => setPrefix(event.target.value)} placeholder="authors, blog, podcast, audio, videos" />
          </label>
          <button type="button" onClick={() => loadAssets()} disabled={listing || !secret}>
            {listing ? 'Cargando...' : 'Ver R2'}
          </button>
        </div>
        {assets.length > 0 ? (
          <ul className="asset-list">
            {assets.map((asset) => (
              <li key={asset.key}>
                <div>
                  <strong>{asset.key}</strong>
                  <small>{asset.lastModified ? new Date(asset.lastModified).toLocaleString() : 'Sin fecha'} · {Math.ceil(asset.size / 1024)} KB</small>
                </div>
                <div className="actions">
                  <button type="button" className="secondary" onClick={() => navigator.clipboard.writeText(asset.url)}>
                    Copiar URL
                  </button>
                  <a href={asset.url} target="_blank" rel="noreferrer">Abrir</a>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Escribe el secret y usa Ver R2 para buscar archivos existentes por carpeta/prefix.</p>
        )}
      </section>
    </main>
  );
}
