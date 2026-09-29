import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Scripture Study Workspace',
  description: 'Minimal monochrome Bible study workspace with rich notes, built-in Bible reader, and colorful sticky notes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Modern geometric grotesque font matching Suisse style */}
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
