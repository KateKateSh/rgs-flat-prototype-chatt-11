import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'РГС.Квартира — прототип',
  description: 'Исследовательский прототип чат + релевантный контент',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
