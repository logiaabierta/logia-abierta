import './styles.css';

export const metadata = {
  title: 'Logia Abierta Studio',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
