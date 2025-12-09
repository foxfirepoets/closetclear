import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ClosetClear - AI Smart Closet Management',
  description: 'Revolutionize your wardrobe with AI-powered closet management. Organize, style, and optimize your clothing collection effortlessly.',
  keywords: ['closet management', 'wardrobe organization', 'AI fashion', 'clothing inventory', 'style assistant'],
  authors: [{ name: 'ClosetClear Team' }],
  creator: 'ClosetClear',
  openGraph: {
    title: 'ClosetClear - AI Smart Closet Management',
    description: 'Revolutionize your wardrobe with AI-powered closet management',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClosetClear - AI Smart Closet Management',
    description: 'Revolutionize your wardrobe with AI-powered closet management',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className={`${inter.className} antialiased min-h-screen bg-gradient-to-br from-slate-50 to-blue-50`}>
        <div id="root" className="relative min-h-screen">
          {children}
        </div>
        <div id="modal-root"></div>
      </body>
    </html>
  )
}