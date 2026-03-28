'use client'
import { useState } from 'react'
import AudioButton from '@/components/AudioButton'

type KanaRow = { kana: string; roma: string }[]

const hiraganaRows: KanaRow[] = [
  [{kana:'あ',roma:'a'},{kana:'い',roma:'i'},{kana:'う',roma:'u'},{kana:'え',roma:'e'},{kana:'お',roma:'o'}],
  [{kana:'か',roma:'ka'},{kana:'き',roma:'ki'},{kana:'く',roma:'ku'},{kana:'け',roma:'ke'},{kana:'こ',roma:'ko'}],
  [{kana:'さ',roma:'sa'},{kana:'し',roma:'shi'},{kana:'す',roma:'su'},{kana:'せ',roma:'se'},{kana:'そ',roma:'so'}],
  [{kana:'た',roma:'ta'},{kana:'ち',roma:'chi'},{kana:'つ',roma:'tsu'},{kana:'て',roma:'te'},{kana:'と',roma:'to'}],
  [{kana:'な',roma:'na'},{kana:'に',roma:'ni'},{kana:'ぬ',roma:'nu'},{kana:'ね',roma:'ne'},{kana:'の',roma:'no'}],
  [{kana:'は',roma:'ha'},{kana:'ひ',roma:'hi'},{kana:'ふ',roma:'fu'},{kana:'へ',roma:'he'},{kana:'ほ',roma:'ho'}],
  [{kana:'ま',roma:'ma'},{kana:'み',roma:'mi'},{kana:'む',roma:'mu'},{kana:'め',roma:'me'},{kana:'も',roma:'mo'}],
  [{kana:'や',roma:'ya'},{kana:'',roma:''},{kana:'ゆ',roma:'yu'},{kana:'',roma:''},{kana:'よ',roma:'yo'}],
  [{kana:'ら',roma:'ra'},{kana:'り',roma:'ri'},{kana:'る',roma:'ru'},{kana:'れ',roma:'re'},{kana:'ろ',roma:'ro'}],
  [{kana:'わ',roma:'wa'},{kana:'',roma:''},{kana:'',roma:''},{kana:'',roma:''},{kana:'を',roma:'wo'}],
  [{kana:'ん',roma:'n'},{kana:'',roma:''},{kana:'',roma:''},{kana:'',roma:''},{kana:'',roma:''}],
]

const voicedRows: KanaRow[] = [
  [{kana:'が',roma:'ga'},{kana:'ぎ',roma:'gi'},{kana:'ぐ',roma:'gu'},{kana:'げ',roma:'ge'},{kana:'ご',roma:'go'}],
  [{kana:'ざ',roma:'za'},{kana:'じ',roma:'ji'},{kana:'ず',roma:'zu'},{kana:'ぜ',roma:'ze'},{kana:'ぞ',roma:'zo'}],
  [{kana:'だ',roma:'da'},{kana:'ぢ',roma:'ji'},{kana:'づ',roma:'zu'},{kana:'で',roma:'de'},{kana:'ど',roma:'do'}],
  [{kana:'ば',roma:'ba'},{kana:'び',roma:'bi'},{kana:'ぶ',roma:'bu'},{kana:'べ',roma:'be'},{kana:'ぼ',roma:'bo'}],
  [{kana:'ぱ',roma:'pa'},{kana:'ぴ',roma:'pi'},{kana:'ぷ',roma:'pu'},{kana:'ぺ',roma:'pe'},{kana:'ぽ',roma:'po'}],
]

const katakanaRows: KanaRow[] = [
  [{kana:'ア',roma:'a'},{kana:'イ',roma:'i'},{kana:'ウ',roma:'u'},{kana:'エ',roma:'e'},{kana:'オ',roma:'o'}],
  [{kana:'カ',roma:'ka'},{kana:'キ',roma:'ki'},{kana:'ク',roma:'ku'},{kana:'ケ',roma:'ke'},{kana:'コ',roma:'ko'}],
  [{kana:'サ',roma:'sa'},{kana:'シ',roma:'shi'},{kana:'ス',roma:'su'},{kana:'セ',roma:'se'},{kana:'ソ',roma:'so'}],
  [{kana:'タ',roma:'ta'},{kana:'チ',roma:'chi'},{kana:'ツ',roma:'tsu'},{kana:'テ',roma:'te'},{kana:'ト',roma:'to'}],
  [{kana:'ナ',roma:'na'},{kana:'ニ',roma:'ni'},{kana:'ヌ',roma:'nu'},{kana:'ネ',roma:'ne'},{kana:'ノ',roma:'no'}],
  [{kana:'ハ',roma:'ha'},{kana:'ヒ',roma:'hi'},{kana:'フ',roma:'fu'},{kana:'ヘ',roma:'he'},{kana:'ホ',roma:'ho'}],
  [{kana:'マ',roma:'ma'},{kana:'ミ',roma:'mi'},{kana:'ム',roma:'mu'},{kana:'メ',roma:'me'},{kana:'モ',roma:'mo'}],
  [{kana:'ヤ',roma:'ya'},{kana:'',roma:''},{kana:'ユ',roma:'yu'},{kana:'',roma:''},{kana:'ヨ',roma:'yo'}],
  [{kana:'ラ',roma:'ra'},{kana:'リ',roma:'ri'},{kana:'ル',roma:'ru'},{kana:'レ',roma:'re'},{kana:'ロ',roma:'ro'}],
  [{kana:'ワ',roma:'wa'},{kana:'',roma:''},{kana:'',roma:''},{kana:'',roma:''},{kana:'ヲ',roma:'wo'}],
  [{kana:'ン',roma:'n'},{kana:'',roma:''},{kana:'',roma:''},{kana:'',roma:''},{kana:'',roma:''}],
]

const headers = ['a','i','u','e','o']

/**
 * 通过 roma 值推导音频路径。
 * ぢ/ヂ(ji) 和 づ/ヅ(zu) 与 じ/ジ、ず/ズ 发音相同，共用同一文件。
 */
function audioUrl(roma: string): string | null {
  if (!roma) return null
  return `/audio/kana/${roma}.mp3`
}

function KanaGrid({ rows }: { rows: KanaRow[] }) {
  const [highlighted, setHighlighted] = useState<string | null>(null)

  return (
    <div className="overflow-x-auto">
      <table className="mx-auto border-collapse">
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} className="w-16 h-8 text-xs text-gray-400 font-normal">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className="p-1">
                  {cell.kana ? (
                    <div className="relative group">
                      <button
                        onClick={() => setHighlighted(cell.kana === highlighted ? null : cell.kana)}
                        className={`w-14 h-14 rounded-lg flex flex-col items-center justify-center gap-0.5 border transition-all cursor-pointer ${
                          cell.kana === highlighted
                            ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                            : 'bg-white text-gray-900 border-gray-200 hover:border-[#1e3a5f]/40 hover:bg-[#1e3a5f]/5'
                        }`}
                      >
                        <span className="text-lg font-medium japanese leading-none">{cell.kana}</span>
                        <span className={`text-xs leading-none ${cell.kana === highlighted ? 'text-white/80' : 'text-gray-400'}`}>
                          {cell.roma}
                        </span>
                      </button>
                      {/* 发音按钮：始终可见，叠加在格子右下角 */}
                      {audioUrl(cell.roma) && (
                        <div className="absolute -bottom-1 -right-1">
                          <AudioButton
                            url={audioUrl(cell.roma)!}
                            size="sm"
                            className="shadow-sm border border-white"
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-14 h-14" />
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function KanaTable({ type }: { type: 'hiragana' | 'katakana' | 'voiced' }) {
  const rows = type === 'hiragana' ? hiraganaRows : type === 'voiced' ? voicedRows : katakanaRows
  return <KanaGrid rows={rows} />
}
