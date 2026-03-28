'use client'
import { useState } from 'react'
import KanaTable from '@/components/KanaTable'
import ExerciseBlock from '@/components/ExerciseBlock'
import AudioButton from '@/components/AudioButton'
import type { Exercise } from '@/lib/types'

const tabs = ['平假名', '片假名', '特殊音'] as const
type Tab = typeof tabs[number]

// Mini quiz exercises
const kanaQuizzes: Exercise[] = [
  { id: 'q1', level: 'beginner', type: 'multiple-choice', prompt: '「き」的罗马音是什么？', options: ['ki', 'ka', 'ke', 'ko'], answer: 0, explanation: 'き = ki，か行是 ka/ki/ku/ke/ko', relatedGrammarIds: [], difficulty: 1 },
  { id: 'q2', level: 'beginner', type: 'multiple-choice', prompt: '「tsu」对应的平假名是哪个？', options: ['て', 'つ', 'た', 'と'], answer: 1, explanation: 'つ = tsu。た行是 ta/chi/tsu/te/to，注意 chi 和 tsu 的特殊发音。', relatedGrammarIds: [], difficulty: 1 },
  { id: 'q3', level: 'beginner', type: 'multiple-choice', prompt: '「ざ」是哪个假名加浊音？', options: ['か', 'さ', 'た', 'な'], answer: 1, explanation: 'ざ是さ加浊点（゛）。さ→ざ，し→じ，す→ず，せ→ぜ，そ→ぞ。', relatedGrammarIds: [], difficulty: 1 },
  { id: 'q4', level: 'beginner', type: 'multiple-choice', prompt: '「ちゃ」这个拗音怎么读？', options: ['chi+ya=chiya', 'cha', 'chi', 'tya'], answer: 1, explanation: '拗音 ちゃ 读 cha。き行/し行/ち行等的い段+小写やゆよ组合，ちゃ=cha，ちゅ=chu，ちょ=cho。', relatedGrammarIds: [], difficulty: 2 },
  { id: 'q5', level: 'beginner', type: 'multiple-choice', prompt: '「切手（きって）」中，促音っ代表什么？', options: ['多读一个"t"音，停顿', '一个"u"音', '长音符号', '鼻音n'], answer: 0, explanation: '促音っ/ッ表示停顿，让后面的辅音"双写"。きって(kitte)，在"t"上停顿一拍。', relatedGrammarIds: [], difficulty: 2 },
]

const specialSoundData = [
  {
    title: '拗音（ようおん）',
    desc: 'き/し/ち/に/ひ/み/り等的「い段」假名 + 小写やゆよ，组合成一个音节。',
    examples: [
      { kana: 'きゃ', roma: 'kya', example: '客 (きゃく)', audioUrl: '/audio/kana/kya.mp3' },
      { kana: 'しゅ', roma: 'shu', example: '首 (しゅ)', audioUrl: '/audio/kana/shu.mp3' },
      { kana: 'ちょ', roma: 'cho', example: '帳 (ちょう)', audioUrl: '/audio/kana/cho.mp3' },
      { kana: 'にゅ', roma: 'nyu', example: '入 (にゅう)', audioUrl: '/audio/kana/nyu.mp3' },
      { kana: 'びょ', roma: 'byo', example: '病院 (びょういん)', audioUrl: '/audio/kana/byo.mp3' },
    ],
    tip: '小写やゆよ不能单独使用，必须接在い段假名后面。'
  },
  {
    title: '促音（そくおん）',
    desc: '小写っ/ッ表示一个停顿（无声音节），让后面的辅音"double"，发音时憋气一拍。',
    examples: [
      { kana: 'きって', roma: 'kitte', example: '切手（邮票）', audioUrl: '/audio/kana/kitte.mp3' },
      { kana: 'ざっし', roma: 'zasshi', example: '雑誌（杂志）', audioUrl: '/audio/kana/zasshi.mp3' },
      { kana: 'はっか', roma: 'hakka', example: '発火（着火）', audioUrl: '/audio/kana/hakka.mp3' },
    ],
    tip: '促音不能出现在句末，不能在ん前面，通常在か/さ/た/ぱ行之前。'
  },
  {
    title: '长音（ちょうおん）',
    desc: '平假名中，同列元音相接（あ段+あ/い段+い/う段+う/え段+い/お段+う）表示长音。片假名中用「ー」表示长音。',
    examples: [
      { kana: 'おかあさん', roma: 'okaasan', example: '母亲（aa=长音a）', audioUrl: '/audio/kana/okaasan.mp3' },
      { kana: 'えいご', roma: 'eigo', example: '英语（ei=长音e）', audioUrl: '/audio/kana/eigo.mp3' },
      { kana: 'コーヒー', roma: 'koohii', example: '咖啡（ー=长音符号）', audioUrl: '/audio/kana/koohii.mp3' },
    ],
    tip: '长音和短音意思完全不同：おばさん（おばさん=阿姨）vs おばあさん（おばあさん=祖母）。'
  },
  {
    title: '拨音（はつおん）ん/ン',
    desc: '日语唯一能单独作为音节的辅音，读作n/m/ng，根据后面的音变化发音。',
    examples: [
      { kana: 'てんき', roma: 'tenki', example: '天気（天气）', audioUrl: '/audio/kana/tenki.mp3' },
      { kana: 'さんぽ', roma: 'sanpo', example: '散歩（散步）', audioUrl: '/audio/kana/sanpo.mp3' },
      { kana: 'にほんご', roma: 'nihongo', example: '日本語', audioUrl: '/audio/kana/nihongo.mp3' },
    ],
    tip: 'ん不能出现在词的开头。在后接な行/ま行时发n，在后接ば行/ぱ行/ま行时发m，在后接か行/が行时发ng，在句末或元音前发n。'
  },
]

export default function KanaPage() {
  const [tab, setTab] = useState<Tab>('平假名')

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">假名学习</h1>
        <p className="text-gray-500">平假名、片假名和特殊音规则。点击格子高亮练习。</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
              tab === t ? 'bg-white text-[#1e3a5f] shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Hiragana */}
      {tab === '平假名' && (
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 mb-2">清音（五十音图）</h2>
            <p className="text-sm text-gray-500 mb-6">点击任意格子可高亮。特别注意：し=shi，ち=chi，つ=tsu，ふ=fu。</p>
            <KanaTable type="hiragana" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 mb-2">浊音与半浊音</h2>
            <p className="text-sm text-gray-500 mb-6">
              浊音在假名右上角加「゛」（两点），半浊音加「゜」（小圆圈）。
            </p>
            <KanaTable type="voiced" />
          </div>

          <div className="bg-[#1e3a5f]/5 rounded-xl p-5">
            <h3 className="font-semibold text-[#1e3a5f] mb-3">💡 记忆小贴士</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• <strong>あ行</strong> 是日语最基础的5个元音：a/i/u/e/o，后续所有行都以这5个元音结尾</li>
              <li>• <strong>特殊发音</strong>：し(shi)、ち(chi)、つ(tsu)、ふ(fu)、を(wo)——这5个要特别记</li>
              <li>• <strong>每天学一行</strong>，配合書き順（笔顺）练习，10天内可以掌握全部清音</li>
              <li>• 把假名贴在家里对应的物品上：冷蔵庫(れいぞうこ)贴在冰箱上</li>
            </ul>
          </div>
        </div>
      )}

      {/* Katakana */}
      {tab === '片假名' && (
        <div className="space-y-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-2">
            <p className="text-sm text-amber-800">
              <strong>片假名的用途：</strong>外来语（コーヒー=咖啡）、外国人名/地名（アメリカ=美国）、拟声词（ドキドキ=心跳声）、强调某个词。发音规则与平假名完全相同。
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="font-bold text-gray-900 mb-2">片假名五十音</h2>
            <p className="text-sm text-gray-500 mb-6">
              片假名的长音用「ー」表示，这是片假名特有的符号。如：コーヒー(koohii)=咖啡。
            </p>
            <KanaTable type="katakana" />
          </div>
          <div className="bg-[#1e3a5f]/5 rounded-xl p-5">
            <h3 className="font-semibold text-[#1e3a5f] mb-3">💡 片假名学习技巧</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• 很多片假名来自英语，猜猜这些词的意思：テレビ / コンピューター / アイスクリーム</li>
              <li>• 片假名的「形状」比平假名更棱角分明，容易区分</li>
              <li>• 先认形（会认），再练写，日常生活中大多数情况只需要认识即可</li>
            </ul>
          </div>
        </div>
      )}

      {/* Special Sounds */}
      {tab === '特殊音' && (
        <div className="space-y-6">
          {specialSoundData.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 japanese">{item.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.desc}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {item.examples.map((ex, ei) => (
                  <div key={ei} className="bg-gray-50 rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <div className="text-xl japanese font-bold text-gray-900">{ex.kana}</div>
                      {ex.audioUrl && <AudioButton url={ex.audioUrl} size="sm" />}
                    </div>
                    <div className="text-xs text-[#1e3a5f] font-mono mb-1">{ex.roma}</div>
                    <div className="text-xs text-gray-500">{ex.example}</div>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                <span className="text-amber-700 text-xs"><strong>💡 注意：</strong>{item.tip}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mini Quiz */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">假名小测验</h2>
        <ExerciseBlock exercises={kanaQuizzes} />
      </div>
    </div>
  )
}
