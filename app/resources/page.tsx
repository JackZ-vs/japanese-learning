import type { Metadata } from 'next'
import { getResources } from '@/lib/data'
import ResourceCard from '@/components/ResourceCard'

export const metadata: Metadata = { title: '推荐资源' }

const categories = [
  { id: 'official', label: '官方资源', icon: '🏛' },
  { id: 'platform', label: '学习平台', icon: '📚' },
  { id: 'reading', label: '阅读素材', icon: '📰' },
  { id: 'tool', label: '工具', icon: '🔧' },
  { id: 'community', label: '社区', icon: '💬' },
]

export default function ResourcesPage() {
  const resources = getResources()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">推荐资源</h1>
        <p className="text-gray-500 max-w-2xl leading-relaxed">
          精选免费（或有免费层）的日语学习资源。每个资源都标明了「适合谁」和「为什么推荐」。
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8 text-sm text-blue-700">
        <strong>说明：</strong>本页仅做资源导航，所有链接跳转到第三方网站。我们不转载这些网站的原文内容，仅做摘要介绍。部分资源有付费功能，已在「注意」栏注明。
      </div>

      {/* By category */}
      {categories.map(cat => {
        const items = resources.filter(r => r.category === cat.id)
        if (items.length === 0) return null
        return (
          <section key={cat.id} className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">{cat.icon}</span>
              {cat.label}
              <span className="text-sm text-gray-400 font-normal">{items.length} 个</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map(r => <ResourceCard key={r.id} resource={r} />)}
            </div>
          </section>
        )
      })}
    </div>
  )
}
