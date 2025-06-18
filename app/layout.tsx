import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ECOBOT',
  description: 'EcoBot Dashboard - Real-time monitoring of your smart bottle collection system',
  generator: 'Samwell.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
