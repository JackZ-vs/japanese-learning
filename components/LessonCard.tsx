import Link from 'next/link'
import type { Lesson } from '@/lib/types'

export default function LessonCard({ lesson, order, stageColor }: { lesson: Lesson; order: number; stageColor?: string }) {
  const color = stageColor || '#1e3a5f'
  return (
    <Link href={`/lesson/${lesson.slug}`} className="group block">
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm hover:border-gray-300 transition-all">
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
            style={{ backgroundColor: color }}
          >
            {order}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#1e3a5f] transition-colors leading-snug mb-1">
              {lesson.title}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
              {lesson.summary}
            </p>
          </div>
          <span className="text-gray-300 group-hover:text-gray-400 transition-colors text-sm shrink-0">→</span>
        </div>
      </div>
    </Link>
  )
}
