import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: '关于本站' }

const faqs = [
  {
    q: '这个网站收费吗？',
    a: '完全免费，没有付费功能，也没有广告。所有语法、词汇、练习内容均可自由访问。'
  },
  {
    q: '内容质量有保证吗？',
    a: '所有内容参考《大家的日语》《新标准日语》等主流教材，以及日本国际交流基金会（JF）的 JLPT 官方标准编写，并由对日语有深入理解的学习者审校。如发现错误欢迎反馈。'
  },
  {
    q: '从零开始能学吗？',
    a: '可以。网站第一章「零基础入门」从日语的书写系统（假名）讲起，不假设任何日语基础。建议从假名学习页开始，掌握平假名后再进入正式课程。'
  },
  {
    q: '能覆盖 N5、N4 考试吗？',
    a: '本站覆盖 JLPT N5 和 N4 的核心语法与词汇，练习题也参考真题风格设计。但备考还需配合官方历年真题练习，本站建议的外部资源页有相关推荐。'
  },
  {
    q: '为什么没有 AI 对话功能？',
    a: '本站定位是「清晰、可靠的结构化讲义」，专注于系统性讲解和记忆强化。AI 对话练习推荐使用 ChatGPT 或 Claude，把本站学到的语法放在对话中验证。'
  },
  {
    q: '网站会持续更新吗？',
    a: '计划持续补充内容：N3 阶段的语法和词汇、更多练习题、听力材料推荐。更新会优先填补现有章节的不足，而不是盲目扩张。'
  },
]

const principles = [
  {
    icon: '🎯',
    title: '结构优先',
    desc: '不追求「快速记住100个单词」，而是帮你建立正确的语法框架。框架对了，词汇自然会往上堆。',
  },
  {
    icon: '🇨🇳',
    title: '中文解释',
    desc: '不用蹩脚英文，直接用中文类比讲清楚。中文母语者学日语有天然优势（汉字！），要充分利用。',
  },
  {
    icon: '⚠️',
    title: '点出易错点',
    desc: '每个语法点都有「常见错误」和「对比学习」。知道哪里容易错，比只知道规则更有用。',
  },
  {
    icon: '🔗',
    title: '不造轮子',
    desc: 'NHK Web Easy、沪江、Anki 都做得很好了，不重复这些工作。本站专注讲解，外部资源页指向最好的工具。',
  },
]

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">关于本站</h1>
        <p className="text-gray-500 leading-relaxed">
          这是一个由中文母语者写给中文母语者的日语学习网站。目标是：
          用最清晰的方式讲解从零到 N4 的日语，免费，无广告，不废话。
        </p>
      </div>

      {/* Why */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">为什么做这个网站？</h2>
        <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
          <p>
            网上日语学习资源不少，但要么是英文讲解（对中文学习者不友好），
            要么过于碎片化（缺乏系统性），要么夹杂大量付费内容。
          </p>
          <p>
            中文学习者有独特的优势：汉字理解、语序直觉（部分相似）。
            但这些优势在以英文为中心的日语学习材料里完全被忽视了。
          </p>
          <p>
            本站想做的事很简单：<strong>一份对中文学习者友好的系统性日语讲义</strong>，
            覆盖假名到 N4 的核心内容，每个知识点都讲清楚「是什么」「为什么」「怎么用」「容易错在哪」。
          </p>
        </div>
      </div>

      {/* Principles */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">设计原则</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {principles.map(p => (
            <div key={p.title} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="text-2xl mb-2">{p.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{p.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content Scope */}
      <div className="bg-[#1e3a5f]/5 rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-[#1e3a5f] mb-4">内容范围</h2>
        <div className="space-y-3">
          {[
            { stage: '零基础', scope: '平假名、片假名、特殊音（拗音/促音/长音/拨音）', done: true },
            { stage: '入门', scope: 'は/が/を/に/で/へ等助词、基本句型、数词、存在表达', done: true },
            { stage: 'N5', scope: '动词变形（て形/ない形/た形）、时态、比较、意志、请求', done: true },
            { stage: 'N4', scope: '使役/被动/条件（と/ば/たら/なら）、敬语基础、复合动词', done: true },
            { stage: 'N3（计划中）', scope: '待补充', done: false },
          ].map(item => (
            <div key={item.stage} className="flex items-start gap-3">
              <span className={`mt-0.5 text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                item.done ? 'bg-[#1e3a5f] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {item.stage}
              </span>
              <span className="text-sm text-gray-700">{item.scope}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">常见问题</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-amber-800 mb-2">⚠ 版权说明</h3>
        <p className="text-sm text-amber-700 leading-relaxed">
          本站原创内容（语法讲解、例句、练习题）采用 CC BY-NC 4.0 许可证发布，可自由分享但须注明来源，不得用于商业目的。
          资源导航页所列的外部链接均指向第三方网站，本站不转载其内容，版权归原始网站所有。
        </p>
      </div>

      {/* CTA */}
      <div className="text-center py-6 border-t border-gray-100">
        <p className="text-gray-500 text-sm mb-4">准备好开始学习了吗？</p>
        <div className="flex justify-center gap-3">
          <Link
            href="/kana"
            className="px-5 py-2.5 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#1e3a5f]/90 transition-colors"
          >
            从假名开始
          </Link>
          <Link
            href="/path"
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:border-[#1e3a5f]/30 transition-colors"
          >
            查看学习路径
          </Link>
        </div>
      </div>
    </div>
  )
}
