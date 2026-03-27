import type { VocabWord } from '@/lib/types'

const levelColors: Record<string, string> = {
  beginner: '#10b981', elementary: '#3b82f6', n5: '#8b5cf6', n4: '#f59e0b', n3: '#ef4444', n2: '#ec4899',
}
const levelLabels: Record<string, string> = {
  beginner: '零基础', elementary: '入门', n5: 'N5', n4: 'N4', n3: 'N3', n2: 'N2',
}
const posColors: Record<string, string> = {
  '名词': 'bg-blue-50 text-blue-600',
  '动词（一段）': 'bg-green-50 text-green-600',
  '动词（五段）': 'bg-emerald-50 text-emerald-600',
  '动词（不规则）': 'bg-teal-50 text-teal-600',
  'い形容词': 'bg-orange-50 text-orange-600',
  'な形容词': 'bg-amber-50 text-amber-600',
  '副词': 'bg-purple-50 text-purple-600',
  '感叹词': 'bg-pink-50 text-pink-600',
}

export default function VocabCard({ vocab }: { vocab: VocabWord }) {
  const color = levelColors[vocab.level] || '#1e3a5f'
  const posClass = posColors[vocab.partOfSpeech] || 'bg-gray-100 text-gray-600'
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <div className="text-2xl font-bold text-gray-900 japanese leading-none mb-1">
            {vocab.word}
          </div>
          <div className="text-sm text-gray-500 japanese">{vocab.reading}</div>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
          style={{ backgroundColor: color + '20', color }}
        >
          {levelLabels[vocab.level]}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${posClass}`}>
          {vocab.partOfSpeech}
        </span>
      </div>

      <p className="text-gray-800 font-medium text-sm mb-3">{vocab.meaningZh}</p>

      {vocab.exampleSentences[0] && (
        <div className="bg-gray-50 rounded-md p-3 text-xs space-y-1">
          <p className="japanese text-gray-700">{vocab.exampleSentences[0].ja}</p>
          <p className="text-gray-400 japanese text-xs">{vocab.exampleSentences[0].reading}</p>
          <p className="text-gray-500">{vocab.exampleSentences[0].zh}</p>
        </div>
      )}
    </div>
  )
}
