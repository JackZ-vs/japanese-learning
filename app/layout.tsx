import type { Metadata } from 'next'
import './globals.css'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: '日語学習 — 免费日语学习助手 | 零基础到N4',
    template: '%s | 日語学習',
  },
  description: '免费、系统的日语学习网站，从零基础到JLPT N4。中文讲解，配套练习，适合完全零基础的中文母语学习者。',
  keywords: ['日语学习', 'JLPT', 'N4', 'N5', '日语零基础', '假名', '日语语法'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <NavBar />
        <main className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
