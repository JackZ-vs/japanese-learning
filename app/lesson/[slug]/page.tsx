import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLessons, getLessonBySlug, getStage, getGrammarById, getVocabByIds, getExercisesByIds } from '@/lib/data'
import VocabCard from '@/components/VocabCard'
import ExerciseBlock from '@/components/ExerciseBlock'

export async function generateStaticParams() {
  return getLessons().map(l => ({ slug: l.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const lesson = getLessonBySlug(slug)
  return { title: lesson?.title || '课程' }
}

const levelColors: Record<string, string> = {
  beginner: '#10b981', elementary: '#3b82f6', n5: '#8b5cf6', n4: '#f59e0b'
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const lesson = getLessonBySlug(slug)
  if (!lesson) notFound()

  const stage = getStage(lesson.stageId)
  const stageColor = stage ? (levelColors[stage.level] || '#1e3a5f') : '#1e3a5f'
  const grammarPoints = lesson.grammarIds.map(id => getGrammarById(id)).filter(Boolean)
  const vocabWords = getVocabByIds(lesson.vocabIds)
  const exercises = getExercisesByIds(lesson.exerciseIds)

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-[#1e3a5f]">首页</Link>
        {' / '}
        {stage && <><Link href={`/stage/${stage.id}`} className="hover:text-[#1e3a5f]">{stage.title}</Link> / </>}
        <span className="text-gray-900">{lesson.title}</span>
      </div>

      {/* Lesson Header */}
      <div className="mb-8">
        <span
          className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-3"
          style={{ backgroundColor: stageColor + '20', color: stageColor }}
        >
          {stage?.titleJa || lesson.stageId}
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{lesson.title}</h1>
        <p className="text-gray-600 leading-relaxed mb-4">{lesson.summary}</p>

        {lesson.goals.length > 0 && (
          <div className="bg-[#1e3a5f]/5 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-[#1e3a5f] mb-2">本课学习目标</h3>
            <ul className="space-y-1">
              {lesson.goals.map((g, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-[#1e3a5f] mt-0.5">→</span>{g}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Vocab */}
      {vocabWords.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full inline-block" style={{ backgroundColor: stageColor }} />
            本课词汇
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vocabWords.map(v => <VocabCard key={v.id} vocab={v} />)}
          </div>
        </section>
      )}

      {/* Grammar */}
      {grammarPoints.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full inline-block" style={{ backgroundColor: stageColor }} />
            语法讲解
          </h2>
          <div className="space-y-6">
            {grammarPoints.map(g => g && (
              <div key={g.id} className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-2xl font-bold text-gray-900 japanese mb-1">{g.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{g.meaning}</p>

                <div className="bg-gray-50 rounded-lg px-4 py-2 mb-4 inline-block">
                  <span className="text-xs text-gray-500 mr-2">接续：</span>
                  <code className="text-sm text-gray-800 font-mono">{g.structure}</code>
                </div>

                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">用法说明</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{g.usageNotes}</p>
                </div>

                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">例句</h4>
                  <div className="space-y-3">
                    {g.examples.map((ex, i) => (
                      <div key={i} className="border-l-2 border-gray-200 pl-4">
                        <p className="text-base japanese text-gray-900">{ex.ja}</p>
                        <p className="text-xs text-gray-400 japanese mt-0.5">{ex.reading}</p>
                        <p className="text-sm text-gray-500 mt-1">{ex.zh}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {g.commonMistakes && (
                  <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                    <h4 className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-2">⚠ 常见错误</h4>
                    <p className="text-sm text-red-700 leading-relaxed">{g.commonMistakes}</p>
                  </div>
                )}

                {g.compareWith && g.compareWith.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-xs text-gray-500">对比学习：</span>
                    {g.compareWith.map(cid => (
                      <Link key={cid} href={`/grammar/${cid}`} className="text-xs text-[#1e3a5f] hover:underline ml-2">
                        {cid}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Exercises */}
      {exercises.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full inline-block" style={{ backgroundColor: stageColor }} />
            练习
          </h2>
          <ExerciseBlock exercises={exercises} />
        </section>
      )}

      {/* Empty state */}
      {vocabWords.length === 0 && grammarPoints.length === 0 && exercises.length === 0 && (
        <div className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-10 text-center text-gray-400">
          <div className="text-3xl mb-3">📝</div>
          <p className="font-medium mb-1">本课内容正在完善中</p>
          <p className="text-sm">详细讲解和练习题即将上线，请先浏览其他已完成的课程。</p>
        </div>
      )}

      {/* Prev/Next */}
      <div className="flex gap-3 mt-10 pt-6 border-t border-gray-200">
        {lesson.prevLessonSlug && (
          <Link
            href={`/lesson/${lesson.prevLessonSlug}`}
            className="flex-1 bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600 hover:border-gray-300 hover:text-[#1e3a5f] transition-colors"
          >
            ← 上一课
          </Link>
        )}
        {lesson.nextLessonSlug && (
          <Link
            href={`/lesson/${lesson.nextLessonSlug}`}
            className="flex-1 text-right bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600 hover:border-gray-300 hover:text-[#1e3a5f] transition-colors"
          >
            下一课 →
          </Link>
        )}
      </div>
    </div>
  )
}
