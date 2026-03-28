import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getLessons, getLessonBySlug, getStage, getGrammarById, getVocabByIds, getExercisesByIds, getLessonContent } from '@/lib/data'
import type { LessonSection } from '@/lib/types'
import VocabCard from '@/components/VocabCard'
import ExerciseBlock from '@/components/ExerciseBlock'
import AudioButton from '@/components/AudioButton'

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

function SectionBlock({ section, color }: { section: LessonSection; color: string }) {
  if (section.type === 'explainer') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {section.title && (
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full inline-block shrink-0" style={{ backgroundColor: color }} />
            {section.title}
          </h3>
        )}
        {section.text && (
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{section.text}</div>
        )}
        {section.items && (
          <ul className="space-y-1.5 mt-2">
            {section.items.map((item, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full bg-gray-400" />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  if (section.type === 'examples') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {section.title && (
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full inline-block shrink-0" style={{ backgroundColor: color }} />
            {section.title}
          </h3>
        )}
        <div className="space-y-4">
          {section.examples?.map((ex, i) => (
            <div key={i} className="border-l-2 pl-4" style={{ borderColor: color + '60' }}>
              <div className="flex items-center gap-2">
                <p className="text-base japanese text-gray-900">{ex.ja}</p>
                {ex.audioUrl && <AudioButton url={ex.audioUrl} size="sm" />}
              </div>
              <p className="text-xs text-gray-400 japanese mt-0.5">{ex.reading}</p>
              <p className="text-sm text-gray-600 mt-1">{ex.zh}</p>
              {ex.note && <p className="text-xs text-gray-400 mt-0.5 italic">※ {ex.note}</p>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (section.type === 'table' || section.type === 'compare') {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {section.title && (
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-4 rounded-full inline-block shrink-0" style={{ backgroundColor: color }} />
            {section.title}
          </h3>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            {section.rows?.map((row, ri) => (
              ri === 0 ? (
                <thead key={ri}>
                  <tr className="border-b border-gray-200">
                    {row.map((cell, ci) => (
                      <th key={ci} className="text-left text-xs font-semibold text-gray-500 pb-2 pr-4 uppercase tracking-wide">{cell}</th>
                    ))}
                  </tr>
                </thead>
              ) : null
            ))}
            <tbody>
              {section.rows?.slice(1).map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? 'bg-gray-50/50' : ''}>
                  {row.map((cell, ci) => (
                    <td key={ci} className={`py-2 pr-4 text-sm align-top ${ci === 0 ? 'font-semibold text-gray-800 japanese' : 'text-gray-600'}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (section.type === 'mistake-box') {
    return (
      <div className="bg-red-50 rounded-xl border border-red-100 p-6">
        <h3 className="font-bold text-red-700 mb-3">
          ⚠ {section.title || '常见错误 & 中文思维陷阱'}
        </h3>
        {section.text && <p className="text-red-700 text-sm leading-relaxed mb-3">{section.text}</p>}
        {section.items && (
          <ul className="space-y-3">
            {section.items.map((item, i) => (
              <li key={i} className="text-sm text-red-700 leading-relaxed flex items-start gap-2">
                <span className="shrink-0 mt-0.5 font-bold">{i + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  if (section.type === 'tip-box') {
    return (
      <div className="bg-amber-50 rounded-xl border border-amber-100 p-6">
        <h3 className="font-bold text-amber-800 mb-3">
          💡 {section.title || '学习小贴士'}
        </h3>
        {section.items && (
          <ul className="space-y-2">
            {section.items.map((item, i) => (
              <li key={i} className="text-sm text-amber-800 leading-relaxed flex items-start gap-2">
                <span className="shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  if (section.type === 'summary') {
    return (
      <div className="rounded-xl p-6" style={{ backgroundColor: color + '08', border: `1px solid ${color}20` }}>
        <h3 className="font-bold mb-3" style={{ color }}>
          ✓ {section.title || '本课小结'}
        </h3>
        {section.items && (
          <ul className="space-y-2">
            {section.items.map((item, i) => (
              <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="mt-1 shrink-0" style={{ color }}>→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return null
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
  const richContent = getLessonContent(slug)

  const hasAnyContent = richContent || vocabWords.length > 0 || grammarPoints.length > 0 || exercises.length > 0

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
                  <span className="text-[#1e3a5f] mt-0.5 shrink-0">→</span>{g}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Prerequisites */}
      {richContent?.prereqs && richContent.prereqs.length > 0 && (
        <div className="mb-6 bg-gray-50 rounded-xl border border-gray-200 px-5 py-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">前置知识</h3>
          <ul className="space-y-1">
            {richContent.prereqs.map((p, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="shrink-0 text-gray-400">•</span>{p}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Rich Content Sections */}
      {richContent && richContent.sections.length > 0 && (
        <div className="space-y-5 mb-10">
          {richContent.sections.map((section, i) => (
            <SectionBlock key={i} section={section} color={stageColor} />
          ))}
        </div>
      )}

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

      {/* Grammar Quick Reference (only when no rich content, or as supplement) */}
      {grammarPoints.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-6 rounded-full inline-block" style={{ backgroundColor: stageColor }} />
            {richContent ? '语法快速参考' : '语法讲解'}
          </h2>
          <div className="space-y-4">
            {grammarPoints.map(g => g && (
              <div key={g.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 japanese">{g.title}</h3>
                  <Link href={`/grammar/${g.id}`} className="text-xs text-[#1e3a5f] hover:underline shrink-0 ml-3">
                    查看详情 →
                  </Link>
                </div>
                <p className="text-gray-600 text-sm mb-3">{g.meaning}</p>
                <div className="bg-gray-50 rounded-lg px-4 py-2 mb-3 inline-block">
                  <span className="text-xs text-gray-500 mr-2">接续：</span>
                  <code className="text-sm text-gray-800 font-mono">{g.structure}</code>
                </div>
                <div className="space-y-2 mt-2">
                  {g.examples.slice(0, 2).map((ex, i) => (
                    <div key={i} className="border-l-2 border-gray-200 pl-3">
                      <div className="flex items-center gap-2">
                        <p className="text-sm japanese text-gray-900">{ex.ja}</p>
                        {ex.audioUrl && <AudioButton url={ex.audioUrl} size="sm" />}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{ex.zh}</p>
                    </div>
                  ))}
                </div>
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
            练习题
          </h2>
          <ExerciseBlock exercises={exercises} />
        </section>
      )}

      {/* Empty state */}
      {!hasAnyContent && (
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
