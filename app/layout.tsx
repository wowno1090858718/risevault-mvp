import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RiseVault — Proof of Work, Made Simple',
  description: 'Capture real student work daily and turn it into trusted proof of progress.',
  openGraph: {
    title: 'RiseVault — Proof of Work, Made Simple',
    description: 'Capture real student work daily and turn it into trusted proof of progress.',
    url: 'https://risevault.app',
    siteName: 'RiseVault',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

