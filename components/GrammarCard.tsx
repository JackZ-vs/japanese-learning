import Link from 'next/link'
import type { GrammarPoint } from '@/lib/types'

const levelColors: Record<string, string> = {
  beginner: '#10b981',
  elementary: '#3b82f6',
  n5: '#8b5cf6',
  n4: '#f59e0b',
  n3: '#ef4444',
  n2: '#ec4899',
}

const levelLabels: Record<string, string> = {
  beginner: '零基础',
  elementary: '入门',
  n5: 'N5',
  n4: 'N4',
  n3: 'N3',
  n2: 'N2',
}

export default function GrammarCard({ grammar }: { grammar: GrammarPoint }) {
  const color = levelColors[grammar.level] || '#1e3a5f'
  return (
    <Link href={`/grammar/${grammar.id}`} className="group block">
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all h-full">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 japanese group-hover:text-[#1e3a5f] transition-colors">
            {grammar.title}
          </h3>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ml-2"
            style={{ backgroundColor: color + '20', color }}
          >
            {levelLabels[grammar.level]}
          </span>
        </div>

        <p className="text-gray-700 text-sm mb-3 leading-relaxed">
          {grammar.meaning}
        </p>

        <div className="bg-gray-50 rounded-md px-3 py-1.5 mb-3">
          <code className="text-xs text-gray-600 font-mono">{grammar.structure}</code>
        </div>

        <div className="flex flex-wrap gap-1">
          {grammar.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
