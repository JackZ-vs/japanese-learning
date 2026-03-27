'use client'
import { useState, useMemo } from 'react'
import { getVocab } from '@/lib/data'
import VocabCard from '@/components/VocabCard'

const levels = [
  { id: 'all', label: '全部' },
  { id: 'beginner', label: '零基础' },
  { id: 'elementary', label: '入门' },
  { id: 'n5', label: 'N5' },
  { id: 'n4', label: 'N4' },
]

const posGroups = ['全部词性', '名词', '动词（一段）', '动词（五段）', '动词（不规则）', 'い形容词', 'な形容词', '副词', '感叹词']

export default function VocabularyPage() {
  const all = getVocab()
  const [level, setLevel] = useState('all')
  const [pos, setPos] = useState('全部词性')
  const [search, setSearch] = useState('')

  const allTags = useMemo(() => {
    const set = new Set<string>()
    all.forEach(v => v.tags.forEach(t => set.add(t)))
    return [...set]
  }, [all])

  const [tag, setTag] = useState('all')

  const filtered = useMemo(() => {
    return all.filter(v => {
      if (level !== 'all' && v.level !== level) return false
      if (pos !== '全部词性' && v.partOfSpeech !== pos) return false
      if (tag !== 'all' && !v.tags.includes(tag)) return false
      if (search) {
        const q = search.toLowerCase()
        return v.word.includes(q) || v.reading.includes(q) || v.meaningZh.includes(q)
      }
      return true
    })
  }, [all, level, pos, tag, search])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">词汇库</h1>
        <p className="text-gray-500">按级别和主题筛选词汇，每词附有例句。</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 space-y-3">
        <input
          type="text"
          placeholder="搜索词汇、读音、中文意思…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#1e3a5f]/40"
        />
        <div className="flex flex-wrap gap-2">
          {levels.map(l => (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              className={`px-3 py-1 rounded-full text-sm border transition-all cursor-pointer ${
                level === l.id ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' : 'border-gray-200 text-gray-600 hover:border-[#1e3a5f]/30'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {posGroups.map(p => (
            <button
              key={p}
              onClick={() => setPos(p === pos ? '全部词性' : p)}
              className={`px-2.5 py-0.5 rounded-full text-xs border transition-all cursor-pointer ${
                pos === p ? 'bg-gray-700 text-white border-gray-700' : 'border-gray-200 text-gray-500 hover:border-gray-400'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTag('all')}
            className={`px-2.5 py-0.5 rounded-full text-xs border cursor-pointer ${tag === 'all' ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-400 hover:border-gray-400'}`}
          >
            所有主题
          </button>
          {[...allTags].slice(0, 12).map(t => (
            <button
              key={t}
              onClick={() => setTag(t === tag ? 'all' : t)}
              className={`px-2.5 py-0.5 rounded-full text-xs border cursor-pointer ${tag === t ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-400 hover:border-gray-400'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-500 mb-4">{filtered.length} 个词汇</div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map(v => <VocabCard key={v.id} vocab={v} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p>没有找到匹配的词汇</p>
        </div>
      )}
    </div>
  )
}
