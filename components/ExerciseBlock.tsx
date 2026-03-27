'use client'
import { useState } from 'react'
import type { Exercise } from '@/lib/types'

export default function ExerciseBlock({ exercises }: { exercises: Exercise[] }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  if (exercises.length === 0) return null

  const ex = exercises[current]
  const isCorrect = selected !== null && selected === ex.answer

  function handleSelect(val: string | number) {
    if (revealed) return
    setSelected(val)
  }

  function handleReveal() {
    if (selected === null) return
    setRevealed(true)
    if (selected === ex.answer) setScore(s => s + 1)
  }

  function handleNext() {
    if (current < exercises.length - 1) {
      setCurrent(c => c + 1)
      setSelected(null)
      setRevealed(false)
    } else {
      setDone(true)
    }
  }

  function handleRestart() {
    setCurrent(0)
    setSelected(null)
    setRevealed(false)
    setScore(0)
    setDone(false)
  }

  if (done) {
    const pct = Math.round((score / exercises.length) * 100)
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
        <div className="text-4xl mb-3">{pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪'}</div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">练习完成！</h3>
        <p className="text-gray-600 mb-4">
          得分：<span className="text-[#1e3a5f] font-bold text-2xl">{score}</span> / {exercises.length}
          <span className="text-gray-400 ml-2">({pct}%)</span>
        </p>
        {pct < 80 && (
          <p className="text-sm text-amber-600 bg-amber-50 rounded-lg px-4 py-2 mb-4">
            建议复习错题对应的语法点，再练一次效果更好 💡
          </p>
        )}
        <button
          onClick={handleRestart}
          className="bg-[#1e3a5f] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#1e3a5f]/90 transition-colors"
        >
          再练一次
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">第 {current + 1} 题 / 共 {exercises.length} 题</span>
        <div className="flex gap-1">
          {exercises.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full ${
                i < current ? 'bg-[#1e3a5f]' : i === current ? 'bg-[#1e3a5f]/40' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Prompt */}
      <div className="mb-5">
        <span className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">
          {ex.type === 'multiple-choice' ? '选择题' : ex.type === 'particle' ? '助词填空' : ex.type === 'fill-blank' ? '填空题' : '语序题'}
        </span>
        <p className="text-gray-900 font-medium text-base japanese leading-relaxed">
          {ex.prompt}
        </p>
      </div>

      {/* Options */}
      {ex.options && (
        <div className="space-y-2 mb-5">
          {ex.options.map((opt, i) => {
            let cls = 'w-full text-left px-4 py-3 rounded-lg border text-sm transition-all '
            if (!revealed) {
              cls += selected === i
                ? 'border-[#1e3a5f] bg-[#1e3a5f]/5 text-[#1e3a5f] font-medium'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 cursor-pointer'
            } else {
              if (i === ex.answer) {
                cls += 'border-green-400 bg-green-50 text-green-800 font-medium'
              } else if (i === selected && selected !== ex.answer) {
                cls += 'border-red-300 bg-red-50 text-red-700'
              } else {
                cls += 'border-gray-100 bg-gray-50 text-gray-400'
              }
            }
            return (
              <button key={i} className={cls} onClick={() => handleSelect(i)} disabled={revealed}>
                <span className="font-mono text-xs mr-2 text-gray-400">{String.fromCharCode(65 + i)}.</span>
                <span className="japanese">{opt}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Explanation */}
      {revealed && (
        <div className={`rounded-lg px-4 py-3 mb-5 text-sm ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className={`font-semibold mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? '✓ 正确！' : '✗ 错误'}
          </div>
          <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>
            {ex.explanation}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!revealed ? (
          <button
            onClick={handleReveal}
            disabled={selected === null}
            className="flex-1 bg-[#1e3a5f] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#1e3a5f]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            确认答案
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 bg-[#1e3a5f] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#1e3a5f]/90 transition-colors"
          >
            {current < exercises.length - 1 ? '下一题 →' : '查看结果'}
          </button>
        )}
      </div>
    </div>
  )
}
