import './globals.css'
import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'

// Load the Outfit font from Google Fonts
// This provides a clean, modern, friendly font for the entire site
const outfit = Outfit({ subsets: ['latin'] })

// Metadata for SEO and browser display
// These will appear in search results and browser tabs
export const metadata: Metadata = {
  title: 'Project 60',
  description: 'White label family and friends digital edition of BBC\'s "Just a Minute" game format',
  keywords: ['game', 'web game', 'online game'],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

/**
 * Root Layout Component
 * 
 * This is the main layout that wraps all pages in your Next.js app.
 * Any content you add here (like a header or footer) will appear on all pages.
 * 
 * @param children - The page content that will be rendered inside this layout
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        {children}
      </body>
    </html>
  )
}
