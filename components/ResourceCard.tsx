import type { Resource } from '@/lib/types'

const categoryConfig: Record<string, { label: string; icon: string; color: string }> = {
  official: { label: '官方', icon: '🏛', color: 'bg-red-50 text-red-600' },
  platform: { label: '学习平台', icon: '📚', color: 'bg-blue-50 text-blue-600' },
  reading: { label: '阅读素材', icon: '📰', color: 'bg-green-50 text-green-600' },
  tool: { label: '工具', icon: '🔧', color: 'bg-purple-50 text-purple-600' },
  community: { label: '社区', icon: '💬', color: 'bg-orange-50 text-orange-600' },
}

export default function ResourceCard({ resource }: { resource: Resource }) {
  const cat = categoryConfig[resource.category] || { label: '其他', icon: '🔗', color: 'bg-gray-50 text-gray-600' }
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{cat.icon}</span>
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[#1e3a5f] hover:underline text-base"
          >
            {resource.title}
          </a>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ml-2 ${cat.color}`}>
          {cat.label}
        </span>
      </div>

      <p className="text-gray-600 text-sm leading-relaxed mb-3">
        {resource.description}
      </p>

      <div className="space-y-2 text-xs">
        <div className="flex items-start gap-2">
          <span className="text-gray-400 shrink-0 mt-0.5">👤 适合：</span>
          <span className="text-gray-600">{resource.recommendedFor}</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-gray-400 shrink-0 mt-0.5">⭐ 推荐原因：</span>
          <span className="text-gray-600">{resource.why}</span>
        </div>
        {resource.caution && (
          <div className="flex items-start gap-2 bg-amber-50 rounded-md px-3 py-2">
            <span className="text-amber-500 shrink-0">⚠</span>
            <span className="text-amber-700">{resource.caution}</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {resource.level.map(lv => (
          <span key={lv} className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
            {lv === 'beginner' ? '零基础' : lv === 'elementary' ? '入门' : lv.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  )
}
