import type { Metadata } from 'next'
import Link from 'next/link'
import { getStages, getLessonsByStage } from '@/lib/data'

export const metadata: Metadata = { title: '完整学习路径' }

export default function PathPage() {
  const stages = getStages()

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10">
        <div className="text-sm text-gray-500 mb-2">
          <Link href="/" className="hover:text-[#1e3a5f]">首页</Link> / 学习路径
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">完整学习路径</h1>
        <p className="text-gray-500 leading-relaxed">
          从零基础到JLPT N4，清晰的4阶段路径。每个阶段有明确目标，
          完成本阶段后再进入下一阶段，循序渐进效果最好。
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {stages.map((stage, i) => {
          const lessons = getLessonsByStage(stage.id)
          return (
            <div key={stage.id} className="relative flex gap-6 mb-8">
              {/* Timeline line */}
              <div className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 z-10"
                  style={{ backgroundColor: stage.color }}
                >
                  {i + 1}
                </div>
                {i < stages.length - 1 && (
                  <div className="w-0.5 flex-1 mt-2" style={{ backgroundColor: stage.color + '40' }} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: stage.color + '20', color: stage.color }}
                  >
                    {stage.titleJa}
                  </span>
                  <h2 className="text-xl font-bold text-gray-900">{stage.title}</h2>
                  <span className="text-sm text-gray-400">{lessons.length} 课</span>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-4">{stage.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">学习目标</h4>
                    <ul className="space-y-1">
                      {stage.goals.map((g, gi) => (
                        <li key={gi} className="text-xs text-gray-700 flex items-start gap-1.5">
                          <span style={{ color: stage.color }}>✓</span> {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">核心知识点</h4>
                    <div className="flex flex-wrap gap-1">
                      {stage.coreTopics.map(t => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{t}</span>
                      ))}
                    </div>
                    {stage.prerequisites.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-400">先修：{stage.prerequisites.join('、')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Link
                  href={`/stage/${stage.id}`}
                  className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2 rounded-lg text-white transition-colors"
                  style={{ backgroundColor: stage.color }}
                >
                  进入{stage.title} →
                </Link>
              </div>
            </div>
          )
        })}
      </div>

      {/* Beyond N4 */}
      <div className="mt-4 bg-gray-100 rounded-xl p-6 text-center">
        <div className="text-2xl mb-2">🚀</div>
        <h3 className="font-bold text-gray-700 mb-2">N4 之后？</h3>
        <p className="text-sm text-gray-500">N3、N2 课程正在筹备中。掌握N4后，你已经能理解日常大部分对话，可以开始接触真实日语材料了。</p>
      </div>
    </div>
  )
}
