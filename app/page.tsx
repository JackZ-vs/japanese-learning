import Link from 'next/link'
import { getStages, getLessons } from '@/lib/data'
import StageCard from '@/components/StageCard'
import LessonCard from '@/components/LessonCard'

export default function HomePage() {
  const stages = getStages()
  const allLessons = getLessons()
  const featuredLessons = allLessons.slice(0, 6)

  const stageColors: Record<string, string> = {
    beginner: '#10b981', elementary: '#3b82f6', n5: '#8b5cf6', n4: '#f59e0b'
  }

  return (
    <div className="space-y-20">

      {/* Hero */}
      <section className="text-center pt-8 pb-4">
        <div className="inline-flex items-center gap-2 bg-[#1e3a5f]/10 text-[#1e3a5f] text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <span>🇯🇵</span> 免费 · 系统 · 中文讲解
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
          从零开始学日语<br />
          <span className="text-[#1e3a5f]">直到 JLPT N4</span>
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          像高质量课件一样清晰、系统。全程中文讲解，每课配套练习，
          不需要老师，不需要付费，适合完全零基础的你。
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/stage/beginner"
            className="bg-[#1e3a5f] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#1e3a5f]/90 transition-colors text-sm"
          >
            从零开始 →
          </Link>
          <Link
            href="/path"
            className="bg-white text-[#1e3a5f] px-8 py-3 rounded-xl font-semibold border border-[#1e3a5f]/30 hover:bg-[#1e3a5f]/5 transition-colors text-sm"
          >
            查看完整路径
          </Link>
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '📚', title: '系统课程', desc: '从假名到N4，47课完整路径' },
            { icon: '🈶', title: '中文讲解', desc: '通俗易懂，不卖弄术语' },
            { icon: '✏️', title: '配套练习', desc: '每课选择/填空/助词题' },
            { icon: '🔗', title: '资源导航', desc: '精选免费工具推荐' },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 text-center">
              <div className="text-3xl mb-3">{f.icon}</div>
              <div className="font-semibold text-gray-900 text-sm mb-1">{f.title}</div>
              <div className="text-xs text-gray-500 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Path Preview */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">学习路径</h2>
          <Link href="/path" className="text-sm text-[#1e3a5f] hover:underline">查看完整路径 →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stages.map(stage => (
            <StageCard key={stage.id} stage={stage} />
          ))}
        </div>
      </section>

      {/* Quick Start */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">从哪里开始？</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: '完全零基础', desc: '从平假名开始，一步一步来', href: '/stage/beginner', color: '#10b981', icon: '🌱' },
            { title: '已会假名', desc: '跳到入门，直接学语法', href: '/stage/elementary', color: '#3b82f6', icon: '📖' },
            { title: '备考 N5', desc: '系统学习N5核心语法', href: '/stage/n5', color: '#8b5cf6', icon: '🎯' },
            { title: '冲击 N4', desc: '可能形、条件句、授受表达', href: '/stage/n4', color: '#f59e0b', icon: '🏆' },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="group">
              <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-gray-300 transition-all flex items-center gap-4">
                <div className="text-3xl">{item.icon}</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900 group-hover:text-[#1e3a5f] transition-colors mb-1">
                    {item.title}
                  </div>
                  <div className="text-sm text-gray-500">{item.desc}</div>
                </div>
                <span style={{ color: item.color }} className="text-lg group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Lessons */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">推荐课程</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {featuredLessons.map((lesson, i) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              order={i + 1}
              stageColor={stageColors[lesson.stageId]}
            />
          ))}
        </div>
      </section>

      {/* Z.Nail Flashcard Banner */}
      <section>
        <a href="/znail-flashcard/" className="group block">
          <div className="bg-gradient-to-r from-[#c44569] to-[#e8748a] rounded-2xl p-6 flex items-center gap-5 hover:shadow-lg transition-shadow">
            <div className="text-4xl flex-shrink-0">💅</div>
            <div className="flex-1 text-white">
              <div className="text-xs font-semibold uppercase tracking-wider opacity-75 mb-1">实用工具</div>
              <div className="text-lg font-bold leading-tight mb-1">Z.Nail 接客日语 Flashcard</div>
              <div className="text-sm opacity-80">13个场景 · 65张卡片 · 带发音 · 手机优先</div>
            </div>
            <span className="text-white text-xl opacity-70 group-hover:translate-x-1 transition-transform flex-shrink-0">→</span>
          </div>
        </a>
      </section>

      {/* Kana CTA */}
      <section className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] rounded-2xl p-8 text-center text-white">
        <div className="text-4xl mb-4 japanese">あ ア か カ</div>
        <h2 className="text-2xl font-bold mb-3">先从假名开始</h2>
        <p className="text-white/70 mb-6 max-w-md mx-auto text-sm leading-relaxed">
          平假名和片假名是日语的基础。掌握假名通常只需1-2周，
          之后的学习会顺畅很多。
        </p>
        <Link
          href="/kana"
          className="inline-block bg-white text-[#1e3a5f] px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-sm"
        >
          开始学假名
        </Link>
      </section>

    </div>
  )
}
