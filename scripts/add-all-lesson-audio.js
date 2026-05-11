/**
 * 为 lessonContent.json 中所有课程的所有例句添加 audioUrl
 * 使用全局计数器（每课独立），避免多 examples section 时文件名冲突
 */
const fs = require('fs')
const path = require('path')

const contentPath = path.join(__dirname, '../data/lessonContent.json')
const seedPath = path.join(__dirname, 'audio-seed.json')
const lessonsPath = path.join(__dirname, '../data/lessons.json')

const content = JSON.parse(fs.readFileSync(contentPath, 'utf-8'))
const seeds = JSON.parse(fs.readFileSync(seedPath, 'utf-8'))
const lessons = JSON.parse(fs.readFileSync(lessonsPath, 'utf-8'))

// slug → stageId mapping
const slugToStage = {}
lessons.forEach(l => { slugToStage[l.slug] = l.stageId })

const seedIdSet = new Set(seeds.map(s => s.id))
const newSeeds = []

let totalAdded = 0

for (const lesson of content) {
  const stage = slugToStage[lesson.slug] || 'unknown'
  let globalIdx = 0

  for (const section of lesson.sections) {
    if (section.type !== 'examples' || !section.examples) continue

    for (const ex of section.examples) {
      // 跳过已有 audioUrl 或 audioUrl 已匹配当前命名规范的
      const expectedId = `lesson-${lesson.slug}_ex${globalIdx}`

      if (!ex.audioUrl) {
        const fileId = `${lesson.slug}_ex${globalIdx}`
        const audioUrl = `/audio/lesson/${fileId}.mp3`
        const outputPath = `public/audio/lesson/${fileId}.mp3`

        ex.audioUrl = audioUrl

        if (!seedIdSet.has(expectedId)) {
          newSeeds.push({
            id: expectedId,
            type: 'lesson-example',
            level: stage,
            text: ex.ja,
            outputPath,
            audioUrl,
            page: `/lesson/${lesson.slug}`,
            sourceId: lesson.slug,
          })
          seedIdSet.add(expectedId)
          totalAdded++
        }
      }
      globalIdx++
    }
  }
}

fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), 'utf-8')
console.log('✓ lessonContent.json 已更新')

const updatedSeeds = [...seeds, ...newSeeds]
fs.writeFileSync(seedPath, JSON.stringify(updatedSeeds, null, 2), 'utf-8')
console.log(`✓ audio-seed.json 新增 ${newSeeds.length} 条 (总计 ${updatedSeeds.length} 条)`)

if (newSeeds.length > 0) {
  console.log('\n新增条目（前20条）：')
  newSeeds.slice(0, 20).forEach(s => console.log(`  ${s.id}  →  ${s.audioUrl}`))
  if (newSeeds.length > 20) console.log(`  ... 以及另外 ${newSeeds.length - 20} 条`)
}
