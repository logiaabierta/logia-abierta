import type { Metadata } from 'next'
import '@puckeditor/core/puck.css'

import './styles.css'

export const metadata: Metadata = {
  title: 'Logia Abierta Builder',
  description: 'Visual page builder for Logia Abierta static Astro pages.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
