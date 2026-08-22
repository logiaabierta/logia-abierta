import type { ReactNode } from 'react'

import '../(payload)/custom.css'

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
