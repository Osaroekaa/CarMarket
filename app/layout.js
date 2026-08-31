import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Navbar'
import Providers from '../components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'CarMarket - Buy & Sell Cars',
  description: 'The best place to buy and sell cars in Nigeria',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}