import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStages, getStage, getLessonsByStage } from '@/lib/data'
import LessonCard from '@/components/LessonCard'

export async function generateStaticParams() {
  return getStages().map(s => ({ id: s.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const stage = getStage(id)
  return { title: stage?.title || '阶段' }
}

export default async function StagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const stage = getStage(id)
  if (!stage) notFound()

  const lessons = getLessonsByStage(id)

  const tips: Record<string, string[]> = {
    beginner: ['每天练习15-30分钟，比一次学很多更有效', '用便利贴把假名贴在家里的物品上', '先把平假名练熟，再学片假名'],
    elementary: ['学每个助词时多造几个自己的例句', '不要试图一次记住所有助词，先掌握は/が/を/に', '遇到不理解的句子先跳过，继续学，之后回来看往往就懂了'],
    n5: ['动词变形很重要，多练习直到条件反射', '推荐配合Anki记忆N5核心词汇', '开始尝试用NHK Easy读简单新闻'],
    n4: ['N4语法比N5复杂，遇到困难很正常', '把授受动词（あげる/もらう/くれる）当作重点反复练习', '可以开始看有字幕的日剧，不用全懂，培养语感'],
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#1e3a5f]">首页</Link>
        {' / '}
        <Link href="/path" className="hover:text-[#1e3a5f]">学习路径</Link>
        {' / '}
        <span className="text-gray-900">{stage.title}</span>
      </div>

      {/* Stage Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-8 relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: stage.color }} />
        <div className="pl-4">
          <span
            className="inline-block text-sm font-semibold px-3 py-1 rounded-full mb-3 japanese"
            style={{ backgroundColor: stage.color + '20', color: stage.color }}
          >
            {stage.titleJa}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{stage.title}</h1>
          <p className="text-gray-600 leading-relaxed mb-6 max-w-2xl">{stage.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">学习目标</h3>
              <ul className="space-y-2">
                {stage.goals.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-0.5 text-base" style={{ color: stage.color }}>✓</span>
                    {g}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">核心知识点</h3>
              <div className="flex flex-wrap gap-2">
                {stage.coreTopics.map(t => (
                  <span key={t} className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700">{t}</span>
                ))}
              </div>
              {stage.prerequisites.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">先修要求：{stage.prerequisites.join('、')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lessons */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">课程列表</h2>
          <span className="text-sm text-gray-400">{lessons.length} 课</span>
        </div>
        <div className="space-y-2">
          {lessons.map((lesson, i) => (
            <LessonCard key={lesson.id} lesson={lesson} order={i + 1} stageColor={stage.color} />
          ))}
        </div>
      </div>

      {/* Tips */}
      {tips[id] && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
          <h3 className="font-semibold text-amber-800 mb-3">💡 学习建议</h3>
          <ul className="space-y-2">
            {tips[id].map((tip, i) => (
              <li key={i} className="text-sm text-amber-700 flex items-start gap-2">
                <span className="shrink-0 mt-0.5">•</span>{tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
