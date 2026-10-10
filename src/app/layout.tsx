import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Selah — Scripture Study Workspace',
  description: 'A quiet, thoughtful Bible study workspace with rich notes, built-in Bible reader, and reflections.',
  icons: {
    icon: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
