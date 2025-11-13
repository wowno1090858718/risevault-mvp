import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RiseVault Prototype',
  description: 'MVP prototype for RiseVault',
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

