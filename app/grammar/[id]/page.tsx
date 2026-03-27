import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getGrammar, getGrammarById } from '@/lib/data'

export async function generateStaticParams() {
  return getGrammar().map(g => ({ id: g.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const g = getGrammarById(id)
  return { title: g?.title || '语法' }
}

const levelLabels: Record<string, string> = {
  beginner: '零基础', elementary: '入门', n5: 'N5', n4: 'N4', n3: 'N3', n2: 'N2'
}
const levelColors: Record<string, string> = {
  beginner: '#10b981', elementary: '#3b82f6', n5: '#8b5cf6', n4: '#f59e0b'
}

export default async function GrammarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const g = getGrammarById(id)
  if (!g) notFound()
  const color = levelColors[g.level] || '#1e3a5f'

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#1e3a5f]">首页</Link>
        {' / '}
        <Link href="/grammar" className="hover:text-[#1e3a5f]">语法库</Link>
        {' / '}
        <span className="text-gray-900 japanese">{g.title}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-4xl font-bold text-gray-900 japanese">{g.title}</h1>
          <span
            className="text-sm font-semibold px-3 py-1 rounded-full shrink-0 ml-4"
            style={{ backgroundColor: color + '20', color }}
          >
            {levelLabels[g.level]}
          </span>
        </div>

        <p className="text-gray-700 text-lg leading-relaxed mb-5">{g.meaning}</p>

        <div className="bg-gray-50 rounded-lg px-5 py-3 mb-5">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-1">接续</span>
          <code className="text-sm text-gray-800 font-mono">{g.structure}</code>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {g.tags.map(t => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{t}</span>
          ))}
        </div>
      </div>

      {/* Usage Notes */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full" style={{ backgroundColor: color }} />
          用法说明
        </h2>
        <p className="text-gray-700 text-sm leading-relaxed">{g.usageNotes}</p>
      </div>

      {/* Examples */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full" style={{ backgroundColor: color }} />
          例句
        </h2>
        <div className="space-y-4">
          {g.examples.map((ex, i) => (
            <div key={i} className="border-l-2 pl-4" style={{ borderColor: color + '60' }}>
              <p className="text-lg japanese text-gray-900">{ex.ja}</p>
              <p className="text-xs text-gray-400 japanese mt-0.5">{ex.reading}</p>
              <p className="text-sm text-gray-500 mt-1">{ex.zh}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Common Mistakes */}
      {g.commonMistakes && (
        <div className="bg-red-50 rounded-xl border border-red-100 p-6 mb-6">
          <h2 className="font-bold text-red-700 mb-3">⚠ 常见错误 & 注意事项</h2>
          <p className="text-red-700 text-sm leading-relaxed">{g.commonMistakes}</p>
        </div>
      )}

      {/* Compare With */}
      {g.compareWith && g.compareWith.length > 0 && (
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-6 mb-6">
          <h2 className="font-bold text-blue-700 mb-3">↔ 对比学习</h2>
          <p className="text-blue-600 text-sm mb-3">以下语法点容易与本语法混淆，建议对比学习：</p>
          <div className="flex flex-wrap gap-2">
            {g.compareWith.map(cid => (
              <Link
                key={cid}
                href={`/grammar/${cid}`}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors japanese"
              >
                {cid} →
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Link href="/grammar" className="text-sm text-gray-500 hover:text-[#1e3a5f]">← 返回语法库</Link>
      </div>
    </div>
  )
}
