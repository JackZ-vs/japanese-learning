'use client'
import { useState } from 'react'
import { getExercises } from '@/lib/data'
import ExerciseBlock from '@/components/ExerciseBlock'

const tabs = ['全部', '入门', 'N5', 'N4', '助词', 'て形'] as const
type Tab = typeof tabs[number]

export default function PracticePage() {
  const all = getExercises()
  const [tab, setTab] = useState<Tab>('全部')

  const filtered = all.filter(e => {
    if (tab === '全部') return true
    if (tab === '入门') return e.level === 'elementary'
    if (tab === 'N5') return e.level === 'n5'
    if (tab === 'N4') return e.level === 'n4'
    if (tab === '助词') return e.relatedGrammarIds.some(id => id.startsWith('g-w') || id.startsWith('g-ni') || id.startsWith('g-de'))
    if (tab === 'て形') return e.lessonId === 'n5-03' || e.relatedGrammarIds.includes('g-te-iru')
    return true
  })

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">练习中心</h1>
        <p className="text-gray-500">按级别和主题筛选练习题，每题有详细解析。</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
              tab === t
                ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#1e3a5f]/30'
            }`}
          >
            {t}
            <span className="ml-1.5 text-xs opacity-60">
              ({all.filter(e => {
                if (t === '全部') return true
                if (t === '入门') return e.level === 'elementary'
                if (t === 'N5') return e.level === 'n5'
                if (t === 'N4') return e.level === 'n4'
                if (t === '助词') return e.relatedGrammarIds.some(id => id.startsWith('g-w') || id.startsWith('g-ni') || id.startsWith('g-de'))
                if (t === 'て形') return e.lessonId === 'n5-03' || e.relatedGrammarIds.includes('g-te-iru')
                return true
              }).length})
            </span>
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <ExerciseBlock exercises={filtered} />
      ) : (
        <div className="text-center py-16 text-gray-400">
          <div className="text-3xl mb-3">📝</div>
          <p>该分类暂无练习题</p>
        </div>
      )}

      <div className="mt-8 bg-[#1e3a5f]/5 rounded-xl p-5">
        <h3 className="font-semibold text-[#1e3a5f] mb-2">💡 练习建议</h3>
        <ul className="space-y-1.5 text-sm text-gray-700">
          <li>• 做题时先认真思考，不要急着猜</li>
          <li>• 做错了不要沮丧，看懂解析比答对更重要</li>
          <li>• 一道题做错超过2次，说明对应语法点需要复习</li>
          <li>• 建议每天做5-10题，保持语感</li>
        </ul>
      </div>
    </div>
  )
}
