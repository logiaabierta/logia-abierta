'use client'

import { FormEvent, useState } from 'react'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    const response = await fetch('/api/session', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    setLoading(false)

    if (!response.ok) {
      setError('Clave incorrecta.')
      return
    }

    const url = new URL(window.location.href)
    window.location.href = url.searchParams.get('from') || '/'
  }

  return (
    <main className="login-shell">
      <form className="login-panel" onSubmit={handleSubmit}>
        <p className="builder-eyebrow">Logia Abierta Builder</p>
        <h1>Acceso al editor visual</h1>
        <input
          autoFocus
          placeholder="Clave"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error ? <p className="login-error">{error}</p> : null}
        <button disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
      </form>
    </main>
  )
}
