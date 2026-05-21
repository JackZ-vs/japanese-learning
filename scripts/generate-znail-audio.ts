/**
 * 为 Z.Nail 接客 Flashcard 的所有卡片生成日文发音 mp3
 * 输出到 public/znail-flashcard/audio/{id}.mp3
 *
 * 用法：
 *   npx tsx scripts/generate-znail-audio.ts
 *   npx tsx scripts/generate-znail-audio.ts --force
 */

import { resolve } from 'path'
import { readFileSync, existsSync } from 'fs'
import { synthesize, DEFAULT_TTS_CONFIG } from '../lib/tts/alibabaTts'

function loadEnv() {
  const envPath = resolve(process.cwd(), '.env.local')
  if (!existsSync(envPath)) return
  const lines = readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (key && !(key in process.env)) process.env[key] = val
  }
}

const cards: Array<{ id: string; jp: string }> = [
  // Deck 1
  { id: 'w1',    jp: 'いらっしゃいませ' },
  { id: 'w2',    jp: 'こちらにどうぞ' },
  { id: 'w3',    jp: 'こちらにおかけください' },
  // Deck 2
  { id: 'ad-q',  jp: '今日はどんなデザインにしますか？' },
  // Deck 3
  { id: 'da1',   jp: 'ワンカラーにしたいです' },
  { id: 'da2',   jp: 'マグネットにしたいです' },
  { id: 'da3',   jp: 'この写真みたいにしたいです' },
  { id: 'da3b',  jp: '色をかえたいです' },
  { id: 'da4',   jp: 'シンプルな感じにしたいです' },
  { id: 'da5',   jp: 'かわいい感じにしたいです' },
  { id: 'da6',   jp: 'ストーンを付けたいです' },
  { id: 'da7',   jp: 'ラメを入れたいです' },
  { id: 'da8',   jp: 'まだ決めてないです' },
  { id: 'da9',   jp: 'ポイントカラーを入れたいです' },
  // Deck 4
  { id: 'fu1',   jp: 'サンプル見ますか？' },
  { id: 'fu2',   jp: '色はどうしますか？' },
  { id: 'fu3',   jp: '見せてください、ありがとうございます' },
  { id: 'fu4',   jp: '見せてもらえますか？' },
  // Deck 5
  { id: 'cs1',   jp: 'かしこまりました' },
  { id: 'cs2',   jp: 'このデザインですね' },
  { id: 'cs3',   jp: 'では始めますね' },
  // Deck 6
  { id: 'o1',    jp: '痛かったら教えてください' },
  // Deck 7
  { id: 'as-q',  jp: '爪の形はどうしますか？' },
  // Deck 8
  { id: 'sa1',   jp: 'オーバルにしたいです' },
  { id: 'sa2',   jp: 'スクエアオフにしたいです' },
  { id: 'sa3',   jp: 'アーモンドにしたいです' },
  { id: 'sa4',   jp: '短めにしたいです' },
  { id: 'sa5',   jp: '今と同じ感じでお願いします' },
  // Deck 9
  { id: 'lc-q',  jp: 'この長さで大丈夫ですか？' },
  { id: 'lc1',   jp: '大丈夫です' },
  { id: 'lc2',   jp: 'もう少し短くしてください' },
  { id: 'lc3',   jp: '少し長いです' },
  { id: 'lc4',   jp: '少し短いです' },
  // Deck 10
  { id: 'sc-q',  jp: 'この形で大丈夫ですか？' },
  { id: 'sc1',   jp: '大丈夫です' },
  { id: 'sc2',   jp: 'はい、これで大丈夫です' },
  { id: 'sc3',   jp: 'いい感じです' },
  { id: 'sc4',   jp: 'もう少し短くしてください' },
  { id: 'sc5',   jp: 'もう少し丸くしてください' },
  { id: 'sc6',   jp: 'もう少し四角くしてください' },
  { id: 'sc7',   jp: 'もう少し尖らせてください' },
  { id: 'sc8',   jp: 'あまり尖らせないでください' },
  { id: 'sc9',   jp: 'あまり四角くしないでください' },
  { id: 'sc10',  jp: '左右が少し違います' },
  { id: 'sc11',  jp: '角が少し尖っています' },
  { id: 'sc12',  jp: 'ここをもう少し整えてください' },
  { id: 'sc13',  jp: '反対の指と同じにしてください' },
  { id: 'sc14',  jp: 'お任せで大丈夫です' },
  { id: 'sc-re', jp: 'これで大丈夫ですか？' },
  // Deck 11
  { id: 'dw1',   jp: 'これ大丈夫ですか？' },
  { id: 'dw2',   jp: 'ライトお願いします' },
  { id: 'dw3',   jp: '反対の手お願いします' },
  { id: 'dw3b',  jp: '反対お願いします' },
  // Deck 12
  { id: 'dn1',   jp: '完成です' },
  { id: 'dn2',   jp: '見てください' },
  { id: 'dn3',   jp: '確認お願いします' },
  { id: 'dn4',   jp: 'かわいいですね' },
  { id: 'dn5',   jp: 'お写真撮ってもいいですか？' },
  // Deck 13
  { id: 'py1',   jp: '本日は〇〇円です' },
  { id: 'py2',   jp: 'どちらでも大丈夫です' },
  { id: 'py3',   jp: '現金・カード大丈夫です' },
  // Deck 14
  { id: 'fw1',   jp: '本日はありがとうございました' },
  { id: 'fw2',   jp: 'またお待ちしております' },
  { id: 'fw3',   jp: 'また来てください' },
  { id: 'fw4',   jp: 'またお願いします' },
]

const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const GRAY = '\x1b[90m'
const RESET = '\x1b[0m'

async function main() {
  loadEnv()

  const force = process.argv.includes('--force')
  let { rmSync } = await import('fs')

  let ok = 0, skip = 0, fail = 0

  console.log(`\nZ.Nail 音频生成，共 ${cards.length} 条${force ? '（--force）' : ''}\n`)

  for (let i = 0; i < cards.length; i++) {
    const { id, jp } = cards[i]
    const outputPath = `public/znail-flashcard/audio/${id}.mp3`
    const absPath = resolve(process.cwd(), outputPath)
    const prefix = `[${String(i + 1).padStart(2, ' ')}/${cards.length}]`

    if (force && existsSync(absPath)) rmSync(absPath)

    try {
      const result = await synthesize(
        { id, type: 'reading' as const, level: 'znail', text: jp, outputPath, audioUrl: `/znail-flashcard/audio/${id}.mp3`, page: '/znail-flashcard/', sourceId: id },
        DEFAULT_TTS_CONFIG
      )
      if (result.skipped) {
        skip++
        console.log(`${GRAY}– ${prefix} 跳过 ${id}${RESET}`)
      } else if (result.success) {
        ok++
        console.log(`${GREEN}✓ ${prefix} ${id}  ${jp}${RESET}`)
      } else {
        fail++
        console.log(`${RED}✗ ${prefix} ${id}: ${result.error}${RESET}`)
      }
    } catch (e) {
      fail++
      console.log(`${RED}✗ ${prefix} ${id}: ${String(e)}${RESET}`)
    }

    if ((i + 1) % 10 === 0 && i + 1 < cards.length) {
      await new Promise(r => setTimeout(r, 500))
    }
  }

  console.log(`\n${'─'.repeat(40)}`)
  console.log(`${GREEN}✓ 成功：${ok}  ${GRAY}– 跳过：${skip}  ${fail ? RED : ''}✗ 失败：${fail}${RESET}`)
  if (fail > 0) process.exit(1)
}

main().catch(e => { console.error(RED + String(e) + RESET); process.exit(1) })
