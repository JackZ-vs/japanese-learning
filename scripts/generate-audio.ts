/**
 * 批量生成音频文件
 *
 * 用法：
 *   npx tsx scripts/generate-audio.ts
 *   npx tsx scripts/generate-audio.ts --force          # 覆盖已有文件
 *   npx tsx scripts/generate-audio.ts --limit 10       # 只生成前 10 条
 *   npx tsx scripts/generate-audio.ts --type kana      # 只生成 kana 类型
 *   npx tsx scripts/generate-audio.ts --force --limit 5 --type vocab
 *
 * 环境变量（在 .env.local 中配置）：
 *   DASHSCOPE_API_KEY=your_key_here
 *   DASHSCOPE_VOICE=longxiaochun_v2   (可选，覆盖默认音色)
 *
 * 说明：
 *   - 默认跳过已存在的文件（增量模式）
 *   - --force 参数会覆盖已有文件，重新生成
 *   - outputPath 以 public/ 开头时相对于项目根目录
 */

import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { TtsRequest, TtsResult } from '../lib/tts/types'
import { synthesize, DEFAULT_TTS_CONFIG } from '../lib/tts/alibabaTts'

// ─── 加载 .env.local ──────────────────────────────────────────────────────────

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
    if (key && !(key in process.env)) {
      process.env[key] = val
    }
  }
}

// ─── CLI 参数解析 ─────────────────────────────────────────────────────────────

interface CliOptions {
  force: boolean
  limit: number | null
  type: string | null
}

function parseArgs(args: string[]): CliOptions {
  const opts: CliOptions = { force: false, limit: null, type: null }
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--force') {
      opts.force = true
    } else if (args[i] === '--limit' && args[i + 1]) {
      opts.limit = parseInt(args[++i], 10)
    } else if (args[i] === '--type' && args[i + 1]) {
      opts.type = args[++i]
    }
  }
  return opts
}

// ─── 日志工具 ─────────────────────────────────────────────────────────────────

const GREEN = '\x1b[32m'
const RED = '\x1b[31m'
const YELLOW = '\x1b[33m'
const GRAY = '\x1b[90m'
const RESET = '\x1b[0m'

function log(icon: string, color: string, msg: string) {
  console.log(`${color}${icon}${RESET} ${msg}`)
}

// ─── 主流程 ───────────────────────────────────────────────────────────────────

async function main() {
  loadEnv()

  const args = process.argv.slice(2)
  const opts = parseArgs(args)

  // 读取 seed 文件
  const seedPath = resolve(process.cwd(), 'scripts/audio-seed.json')
  if (!existsSync(seedPath)) {
    console.error(`${RED}✗ 找不到 seed 文件：${seedPath}${RESET}`)
    process.exit(1)
  }

  let seeds: TtsRequest[] = JSON.parse(readFileSync(seedPath, 'utf-8'))

  // 按类型过滤
  if (opts.type) {
    seeds = seeds.filter(s => s.type === opts.type)
    console.log(`${GRAY}过滤类型 [${opts.type}]：剩余 ${seeds.length} 条${RESET}`)
  }

  // 应用 limit
  if (opts.limit !== null) {
    seeds = seeds.slice(0, opts.limit)
    console.log(`${GRAY}限制数量 --limit ${opts.limit}：共 ${seeds.length} 条${RESET}`)
  }

  if (seeds.length === 0) {
    console.log(`${YELLOW}⚠ 没有需要处理的条目${RESET}`)
    return
  }

  console.log(`\n开始生成音频，共 ${seeds.length} 条${opts.force ? '（--force 覆盖模式）' : '（增量模式）'}\n`)

  // 如果是 force 模式，临时修改 existsSync 跳过逻辑
  // 实现方式：修改 outputPath 为一个不存在的临时值后再还原
  // 实际上我们通过在调用前删除文件来实现，但更简洁的方式是在 seed 层面处理：
  // 直接在调用前用 fs.rmSync 删除已有文件（如果 force）
  let { rmSync } = await import('fs')

  const results: TtsResult[] = []
  let successCount = 0
  let skipCount = 0
  let failCount = 0

  for (let i = 0; i < seeds.length; i++) {
    const seed = seeds[i]
    const absPath = resolve(process.cwd(), seed.outputPath)
    const prefix = `[${String(i + 1).padStart(3, ' ')}/${seeds.length}]`

    // force 模式：删除已有文件，使 synthesize 重新生成
    if (opts.force && existsSync(absPath)) {
      rmSync(absPath)
    }

    let result: TtsResult
    try {
      result = await synthesize(seed, DEFAULT_TTS_CONFIG)
    } catch (e) {
      result = {
        id: seed.id,
        outputPath: absPath,
        skipped: false,
        success: false,
        error: String(e),
      }
    }

    results.push(result)

    if (result.skipped) {
      skipCount++
      log('–', GRAY, `${prefix} 跳过 [已存在] ${seed.id}`)
    } else if (result.success) {
      successCount++
      log('✓', GREEN, `${prefix} 生成成功 ${seed.id}  →  ${seed.audioUrl}`)
    } else {
      failCount++
      log('✗', RED, `${prefix} 生成失败 ${seed.id}`)
      console.error(`${RED}  错误：${result.error}${RESET}`)
    }

    // 每 10 条之间稍作延迟，避免超过 API 速率限制
    if ((i + 1) % 10 === 0 && i + 1 < seeds.length) {
      await new Promise(r => setTimeout(r, 500))
    }
  }

  // ─── 汇总报告 ─────────────────────────────────────────────────────────────
  console.log('\n' + '─'.repeat(50))
  console.log(`${GREEN}✓ 生成成功：${successCount}${RESET}`)
  if (skipCount > 0) console.log(`${GRAY}– 已跳过：  ${skipCount}${RESET}`)
  if (failCount > 0) {
    console.log(`${RED}✗ 生成失败：${failCount}${RESET}`)
    console.log(`\n失败列表：`)
    results.filter(r => !r.success && !r.skipped).forEach(r => {
      console.log(`  ${RED}✗${RESET} ${r.id}: ${r.error}`)
    })
  }
  console.log('─'.repeat(50))

  if (failCount > 0) {
    process.exit(1)
  }
}

main().catch(e => {
  console.error(`${RED}脚本运行错误：${String(e)}${RESET}`)
  process.exit(1)
})
