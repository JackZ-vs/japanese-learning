'use client'
import { useState, useMemo } from 'react'
import { getExercises } from '@/lib/data'
import ExerciseBlock from '@/components/ExerciseBlock'

const levelTabs = ['全部', '入门', 'N5', 'N4'] as const
type LevelTab = typeof levelTabs[number]

const typeTabs = [
  { id: 'all', label: '全部题型' },
  { id: 'multiple-choice', label: '选择题' },
  { id: 'particle', label: '助词题' },
  { id: 'fill-blank', label: '填空题' },
  { id: 'reorder', label: '语序题' },
] as const
type TypeId = typeof typeTabs[number]['id']

const topicTabs = [
  { id: 'all', label: '全部主题' },
  { id: 'kana', label: '假名' },
  { id: 'particles', label: '助词 は/が/を/に/で' },
  { id: 'te-form', label: 'て形变形' },
  { id: 'n4-grammar', label: 'N4语法' },
] as const
type TopicId = typeof topicTabs[number]['id']

function getTopicIds(topicId: TopicId, exercises: ReturnType<typeof getExercises>): string[] {
  return exercises.filter(e => {
    if (topicId === 'all') return true
    if (topicId === 'kana') return e.lessonId?.startsWith('b-')
    if (topicId === 'particles') return e.relatedGrammarIds.some(id => ['g-wa', 'g-ga', 'g-wo', 'g-ni-place', 'g-de-place'].includes(id)) || e.type === 'particle'
    if (topicId === 'te-form') return e.lessonId === 'n5-03' || e.relatedGrammarIds.includes('g-te-iru')
    if (topicId === 'n4-grammar') return e.level === 'n4'
    return true
  }).map(e => e.id)
}

export default function PracticePage() {
  const all = getExercises()
  const [level, setLevel] = useState<LevelTab>('全部')
  const [type, setType] = useState<TypeId>('all')
  const [topic, setTopic] = useState<TopicId>('all')

  const filtered = useMemo(() => {
    return all.filter(e => {
      if (level === '入门' && e.level !== 'elementary') return false
      if (level === 'N5' && e.level !== 'n5') return false
      if (level === 'N4' && e.level !== 'n4') return false
      if (type !== 'all' && e.type !== type) return false
      if (topic !== 'all') {
        if (topic === 'kana' && !e.lessonId?.startsWith('b-')) return false
        if (topic === 'particles' && !(e.relatedGrammarIds.some(id => ['g-wa', 'g-ga', 'g-wo', 'g-ni-place', 'g-de-place'].includes(id)) || e.type === 'particle')) return false
        if (topic === 'te-form' && !(e.lessonId === 'n5-03' || e.relatedGrammarIds.includes('g-te-iru'))) return false
        if (topic === 'n4-grammar' && e.level !== 'n4') return false
      }
      return true
    })
  }, [all, level, type, topic])

  function countFor(lvl: LevelTab, t: TypeId, tp: TopicId) {
    return all.filter(e => {
      if (lvl === '入门' && e.level !== 'elementary') return false
      if (lvl === 'N5' && e.level !== 'n5') return false
      if (lvl === 'N4' && e.level !== 'n4') return false
      if (t !== 'all' && e.type !== t) return false
      if (tp !== 'all') {
        if (tp === 'kana' && !e.lessonId?.startsWith('b-')) return false
        if (tp === 'particles' && !(e.relatedGrammarIds.some(id => ['g-wa', 'g-ga', 'g-wo', 'g-ni-place', 'g-de-place'].includes(id)) || e.type === 'particle')) return false
        if (tp === 'te-form' && !(e.lessonId === 'n5-03' || e.relatedGrammarIds.includes('g-te-iru'))) return false
        if (tp === 'n4-grammar' && e.level !== 'n4') return false
      }
      return true
    }).length
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">练习中心</h1>
        <p className="text-gray-500">按级别、题型、主题筛选，每题有详细解析。共 {all.length} 道题。</p>
      </div>

      {/* Level Tabs */}
      <div className="mb-4">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">按级别</div>
        <div className="flex flex-wrap gap-2">
          {levelTabs.map(t => (
            <button
              key={t}
              onClick={() => setLevel(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                level === t
                  ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#1e3a5f]/30'
              }`}
            >
              {t}
              <span className="ml-1.5 text-xs opacity-60">({countFor(t, type, topic)})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Type Tabs */}
      <div className="mb-4">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">按题型</div>
        <div className="flex flex-wrap gap-2">
          {typeTabs.map(t => (
            <button
              key={t.id}
              onClick={() => setType(t.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                type === t.id
                  ? 'bg-gray-700 text-white border-gray-700'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
              }`}
            >
              {t.label}
              <span className="ml-1 opacity-60">({countFor(level, t.id, topic)})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Topic Tabs */}
      <div className="mb-6">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">按主题</div>
        <div className="flex flex-wrap gap-2">
          {topicTabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTopic(t.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                topic === t.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
              }`}
            >
              {t.label}
              <span className="ml-1 opacity-60">({countFor(level, type, t.id)})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-500 mb-4">
        找到 <span className="font-semibold text-gray-800">{filtered.length}</span> 道题
        {filtered.length > 0 && (
          <span className="ml-2 text-xs text-gray-400">
            （难度分布：⭐ {filtered.filter(e => e.difficulty === 1).length} 题 / ⭐⭐ {filtered.filter(e => e.difficulty === 2).length} 题 / ⭐⭐⭐ {filtered.filter(e => e.difficulty === 3).length} 题）
          </span>
        )}
      </div>

      {filtered.length > 0 ? (
        <ExerciseBlock exercises={filtered} />
      ) : (
        <div className="text-center py-16 text-gray-400">
          <div className="text-3xl mb-3">📝</div>
          <p>该组合暂无题目，请尝试其他筛选条件</p>
        </div>
      )}

      <div className="mt-8 bg-[#1e3a5f]/5 rounded-xl p-5">
        <h3 className="font-semibold text-[#1e3a5f] mb-2">💡 练习建议</h3>
        <ul className="space-y-1.5 text-sm text-gray-700">
          <li>• 做题时先认真思考，不要急着猜</li>
          <li>• 做错了不要沮丧，看懂解析比答对更重要</li>
          <li>• 一道题做错超过 2 次，说明对应语法需要回去复习</li>
          <li>• 建议每天做 5-10 题，配合课程按顺序练习效果最佳</li>
        </ul>
      </div>
    </div>
  )
}
