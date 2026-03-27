import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-[#1e3a5f] rounded-md flex items-center justify-center text-white font-bold text-xs">日</div>
              <span className="font-bold text-[#1e3a5f]">日語学習</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              免费日语学习助手，面向零基础到N4学习者。系统课程，中文讲解，配套练习。
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 text-sm">学习</h3>
            <ul className="space-y-1.5 text-sm text-gray-500">
              <li><Link href="/path" className="hover:text-[#1e3a5f] transition-colors">学习路径</Link></li>
              <li><Link href="/kana" className="hover:text-[#1e3a5f] transition-colors">假名学习</Link></li>
              <li><Link href="/grammar" className="hover:text-[#1e3a5f] transition-colors">语法库</Link></li>
              <li><Link href="/vocabulary" className="hover:text-[#1e3a5f] transition-colors">词汇库</Link></li>
              <li><Link href="/practice" className="hover:text-[#1e3a5f] transition-colors">练习中心</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-3 text-sm">关于</h3>
            <ul className="space-y-1.5 text-sm text-gray-500">
              <li><Link href="/resources" className="hover:text-[#1e3a5f] transition-colors">推荐资源</Link></li>
              <li><Link href="/about" className="hover:text-[#1e3a5f] transition-colors">关于本站</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-gray-400">
          <p>© 2025 日語学習网站 · 仅供学习参考，非商业用途</p>
          <p>讲解内容为原创 · 外部资源仅做导航，不转载原文</p>
        </div>
      </div>
    </footer>
  )
}
