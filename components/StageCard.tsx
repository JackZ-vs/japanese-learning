import Link from 'next/link'
import type { Stage } from '@/lib/types'

export default function StageCard({ stage }: { stage: Stage }) {
  return (
    <Link href={`/stage/${stage.id}`} className="group block">
      <div className="relative bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md hover:border-gray-300 transition-all overflow-hidden">
        {/* Color bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
          style={{ backgroundColor: stage.color }}
        />

        <div className="pl-3">
          <div className="flex items-start justify-between mb-3">
            <div>
              <span
                className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2"
                style={{ backgroundColor: stage.color + '20', color: stage.color }}
              >
                {stage.titleJa}
              </span>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#1e3a5f] transition-colors">
                {stage.title}
              </h3>
            </div>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full shrink-0">
              {stage.lessonIds.length} 课
            </span>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
            {stage.description}
          </p>

          <ul className="space-y-1 mb-4">
            {stage.goals.slice(0, 2).map((goal, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-gray-500">
                <span style={{ color: stage.color }} className="mt-0.5 shrink-0">✓</span>
                {goal}
              </li>
            ))}
          </ul>

          <div
            className="text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
            style={{ color: stage.color }}
          >
            开始学习 <span>→</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
