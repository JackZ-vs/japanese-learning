'use client'
import { useState, useMemo } from 'react'
import { getGrammar } from '@/lib/data'
import GrammarCard from '@/components/GrammarCard'

const levels = [
  { id: 'all', label: '全部' },
  { id: 'beginner', label: '零基础' },
  { id: 'elementary', label: '入门' },
  { id: 'n5', label: 'N5' },
  { id: 'n4', label: 'N4' },
]

export default function GrammarPage() {
  const all = getGrammar()
  const [level, setLevel] = useState('all')
  const [search, setSearch] = useState('')

  const allTags = useMemo(() => {
    const set = new Set<string>()
    all.forEach(g => g.tags.forEach(t => set.add(t)))
    return [...set]
  }, [all])

  const [tag, setTag] = useState('all')

  const filtered = useMemo(() => {
    return all.filter(g => {
      if (level !== 'all' && g.level !== level) return false
      if (tag !== 'all' && !g.tags.includes(tag)) return false
      if (search) {
        const q = search.toLowerCase()
        return g.title.toLowerCase().includes(q) || g.meaning.toLowerCase().includes(q)
      }
      return true
    })
  }, [all, level, tag, search])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">语法库</h1>
        <p className="text-gray-500">所有语法点按级别整理，每条有详细讲解和例句。</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 space-y-4">
        <input
          type="text"
          placeholder="搜索语法点…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]/40 focus:ring-1 focus:ring-[#1e3a5f]/20"
        />
        <div className="flex flex-wrap gap-2">
          {levels.map(l => (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              className={`px-3 py-1 rounded-full text-sm border transition-all cursor-pointer ${
                level === l.id
                  ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                  : 'bg-transparent text-gray-600 border-gray-200 hover:border-[#1e3a5f]/30'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTag('all')}
            className={`px-2.5 py-0.5 rounded-full text-xs border transition-all cursor-pointer ${tag === 'all' ? 'bg-gray-700 text-white border-gray-700' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}
          >
            所有标签
          </button>
          {allTags.map(t => (
            <button
              key={t}
              onClick={() => setTag(t === tag ? 'all' : t)}
              className={`px-2.5 py-0.5 rounded-full text-xs border transition-all cursor-pointer ${tag === t ? 'bg-gray-700 text-white border-gray-700' : 'border-gray-200 text-gray-500 hover:border-gray-400'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-4">{filtered.length} 个语法点</div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(g => <GrammarCard key={g.id} grammar={g} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p>没有找到匹配的语法点</p>
        </div>
      )}
    </div>
  )
}
