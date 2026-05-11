/**
 * 为零基础准备阶段（beginner）的所有例词和例句添加 audioUrl
 * 并向 greetings-intro 补充问候语例句 section
 */
const fs = require('fs')
const path = require('path')

const contentPath = path.join(__dirname, '../data/lessonContent.json')
const seedPath = path.join(__dirname, 'audio-seed.json')

const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'))
const seeds = JSON.parse(fs.readFileSync(seedPath, 'utf-8'))
const seedIdSet = new Set(seeds.map(s => s.id))

const BEGINNER_SLUGS = [
  'kana-hiragana-1',
  'kana-hiragana-2',
  'kana-hiragana-3',
  'kana-katakana-1',
  'kana-katakana-2',
  'special-sounds',
  'greetings-intro',
]

const newSeeds = []

// ─── greetings-intro 补充问候/礼貌用语 examples section ──────────────────────
const greetingPhrases = [
  { ja: 'おはようございます。', reading: 'o-ha-yo-u go-za-i-ma-su', zh: '早上好。（正式）', note: '早晨问候，朋友间可简短说おはよう' },
  { ja: 'こんにちは。', reading: 'ko-n-ni-chi-wa', zh: '你好。（白天）', note: 'は此处读wa，约10:00~17:00使用' },
  { ja: 'こんばんは。', reading: 'ko-n-ba-n-wa', zh: '晚上好。', note: 'は此处读wa，傍晚以后使用' },
  { ja: 'おやすみなさい。', reading: 'o-ya-su-mi-na-sa-i', zh: '晚安。', note: '睡前道别，朋友间可说おやすみ' },
]

const politenessPhrases = [
  { ja: 'ありがとうございます。', reading: 'a-ri-ga-to-u go-za-i-ma-su', zh: '非常感谢。（正式）', note: '对陌生人/长辈/正式场合使用' },
  { ja: 'ありがとう。', reading: 'a-ri-ga-to-u', zh: '谢谢。（日常）', note: '对朋友或熟人使用' },
  { ja: 'すみません。', reading: 'su-mi-ma-se-n', zh: '对不起；请问；打扰一下。', note: '多义词，引起注意/道歉/致谢均可用' },
  { ja: 'ごめんなさい。', reading: 'go-me-n-na-sa-i', zh: '对不起。（真诚道歉）', note: '犯了错时用，比すみません更正式的道歉' },
]

for (const lesson of content) {
  if (!BEGINNER_SLUGS.includes(lesson.slug)) continue

  // 给所有 examples section 里的 example 加 audioUrl
  for (const section of lesson.sections) {
    if (section.type !== 'examples') continue
    if (!section.examples) continue

    section.examples.forEach((ex, i) => {
      if (ex.audioUrl) return // 已有则跳过

      const fileId = `${lesson.slug}_ex${i}`
      const audioUrl = `/audio/lesson/${fileId}.mp3`
      const outputPath = `public/audio/lesson/${fileId}.mp3`
      const seedId = `lesson-${fileId}`

      ex.audioUrl = audioUrl

      if (!seedIdSet.has(seedId)) {
        newSeeds.push({
          id: seedId,
          type: 'lesson-example',
          level: 'beginner',
          text: ex.ja,
          outputPath,
          audioUrl,
          page: `/lesson/${lesson.slug}`,
          sourceId: lesson.slug,
        })
        seedIdSet.add(seedId)
      }
    })
  }

  // greetings-intro：在问候语表格后插入例句 section
  if (lesson.slug === 'greetings-intro') {
    const hasGreetingExamples = lesson.sections.some(
      s => s.type === 'examples' && s.title && s.title.includes('问候')
    )
    const hasPolitenessExamples = lesson.sections.some(
      s => s.type === 'examples' && s.title && s.title.includes('礼貌')
    )

    if (!hasGreetingExamples) {
      // 找到时间段问候语表格（第一个 table section）的位置
      const tableIdx = lesson.sections.findIndex(s => s.type === 'table' && s.title && s.title.includes('时间段'))
      if (tableIdx !== -1) {
        const exSection = {
          type: 'examples',
          title: '时间段问候语：听读练习',
          examples: greetingPhrases.map((p, i) => {
            const fileId = `greetings-intro_gr${i}`
            const audioUrl = `/audio/lesson/${fileId}.mp3`
            const seedId = `lesson-${fileId}`
            if (!seedIdSet.has(seedId)) {
              newSeeds.push({
                id: seedId,
                type: 'lesson-example',
                level: 'beginner',
                text: p.ja,
                outputPath: `public/audio/lesson/${fileId}.mp3`,
                audioUrl,
                page: `/lesson/greetings-intro`,
                sourceId: 'greetings-intro',
              })
              seedIdSet.add(seedId)
            }
            return { ...p, audioUrl }
          }),
        }
        lesson.sections.splice(tableIdx + 1, 0, exSection)
      }
    }

    if (!hasPolitenessExamples) {
      // 找到日常礼貌用语表格（含"礼貌"的 table）
      const politeTableIdx = lesson.sections.findIndex(s => s.type === 'table' && s.title && s.title.includes('礼貌'))
      if (politeTableIdx !== -1) {
        const exSection = {
          type: 'examples',
          title: '日常礼貌用语：听读练习',
          examples: politenessPhrases.map((p, i) => {
            const fileId = `greetings-intro_pl${i}`
            const audioUrl = `/audio/lesson/${fileId}.mp3`
            const seedId = `lesson-${fileId}`
            if (!seedIdSet.has(seedId)) {
              newSeeds.push({
                id: seedId,
                type: 'lesson-example',
                level: 'beginner',
                text: p.ja,
                outputPath: `public/audio/lesson/${fileId}.mp3`,
                audioUrl,
                page: `/lesson/greetings-intro`,
                sourceId: 'greetings-intro',
              })
              seedIdSet.add(seedId)
            }
            return { ...p, audioUrl }
          }),
        }
        // 插在礼貌表格后面（重新找，因为前面可能插入了新 section）
        const updatedIdx = lesson.sections.findIndex(s => s.type === 'table' && s.title && s.title.includes('礼貌'))
        lesson.sections.splice(updatedIdx + 1, 0, exSection)
      }
    }
  }
}

fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf-8')
console.log('✓ lessonContent.json 已更新')

const updatedSeeds = [...seeds, ...newSeeds]
fs.writeFileSync(seedPath, JSON.stringify(updatedSeeds, null, 2), 'utf-8')
console.log(`✓ audio-seed.json 新增 ${newSeeds.length} 条 (总计 ${updatedSeeds.length} 条)`)
console.log('\n新增条目：')
newSeeds.forEach(s => console.log(`  ${s.id}  →  ${s.audioUrl}`))
