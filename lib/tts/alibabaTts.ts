/**
 * 阿里云 DashScope CosyVoice TTS 实现
 *
 * API 文档：https://help.aliyun.com/zh/model-studio/developer-reference/cosyvoice-tts
 *
 * 接口地址：POST https://dashscope.aliyuncs.com/api/v1/services/aigc/text2audio/synthesis
 *
 * 认证方式：请求头 Authorization: Bearer {DASHSCOPE_API_KEY}
 *
 * 响应格式（同步模式，不加 X-DashScope-SSE 头）：
 *   HTTP 200 + JSON { request_id, output: { audio: "<base64 mp3>" }, usage: {...} }
 * 出错时：
 *   HTTP 4xx/5xx + JSON { request_id, code, message }
 *
 * 本模块只在 Node.js（生成脚本）中运行，不在浏览器端执行。
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, resolve } from 'path'
import type { TtsRequest, TtsConfig, TtsResult } from './types'

// ─── 集中配置 ────────────────────────────────────────────────────────────────

const DASHSCOPE_TTS_URL =
  'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2audio/synthesis'

/**
 * 默认 TTS 配置（所有参数集中在此处，修改一处即可全局生效）
 *
 * voice 说明：
 *   - longxiaochun_v2：CosyVoice 自然女声，支持中日双语，适合语言学习类内容
 *   - 如需切换音色，可在 .env.local 中设置 DASHSCOPE_VOICE=xxx
 *   - 可用音色列表：登录 https://dashscope.console.aliyun.com/ → 模型广场 → CosyVoice
 *
 * format 说明：
 *   - 优先使用 mp3：主流浏览器原生支持，文件体积约为 wav 的 1/10
 *   - 阿里云 CosyVoice 同样支持 wav/pcm，如遇 mp3 不可用可改为 wav
 */
export const DEFAULT_TTS_CONFIG: TtsConfig = {
  model: 'cosyvoice-v1',
  voice: 'longxiaochun_v2',
  format: 'mp3',
  sampleRate: 22050,
  volume: 50,
  speechRate: 0,
  pitchRate: 0,
}

// ─── 核心调用函数 ─────────────────────────────────────────────────────────────

/**
 * 合成一条语音并写入本地文件
 *
 * @param req - 包含文本、输出路径等信息的请求对象
 * @param config - TTS 参数配置（默认使用 DEFAULT_TTS_CONFIG）
 * @returns TtsResult
 */
export async function synthesize(
  req: TtsRequest,
  config: TtsConfig = DEFAULT_TTS_CONFIG
): Promise<TtsResult> {
  const apiKey = process.env.DASHSCOPE_API_KEY
  if (!apiKey) {
    throw new Error(
      'DASHSCOPE_API_KEY 未设置。请在项目根目录创建 .env.local 并添加：\n' +
        'DASHSCOPE_API_KEY=your_key_here'
    )
  }

  const absPath = resolve(req.outputPath)

  // 已存在则跳过，支持增量生成
  if (existsSync(absPath)) {
    return { id: req.id, outputPath: absPath, skipped: true, success: true }
  }

  // 确保输出目录存在
  mkdirSync(dirname(absPath), { recursive: true })

  // 允许通过环境变量覆盖音色
  const voice = process.env.DASHSCOPE_VOICE || config.voice

  // ─── 发起请求 ────────────────────────────────────────────────────────────
  let res: Response
  try {
    res = await fetch(DASHSCOPE_TTS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        // 不加 X-DashScope-SSE 头 → 同步模式，响应体为完整 JSON（含 base64 音频）
        // 如需流式模式，加 'X-DashScope-SSE': 'enable'
      },
      body: JSON.stringify({
        model: config.model,
        input: {
          text: req.text,
          voice,
        },
        parameters: {
          format: config.format,
          sample_rate: config.sampleRate,
          volume: config.volume,
          speech_rate: config.speechRate,
          pitch_rate: config.pitchRate,
        },
      }),
    })
  } catch (e) {
    return {
      id: req.id,
      outputPath: absPath,
      skipped: false,
      success: false,
      error: `网络请求失败: ${String(e)}`,
    }
  }

  // ─── 解析响应 ────────────────────────────────────────────────────────────
  const contentType = res.headers.get('content-type') || ''

  try {
    if (contentType.includes('audio/')) {
      // 部分版本接口直接返回二进制音频流
      const buf = Buffer.from(await res.arrayBuffer())
      writeFileSync(absPath, buf)
      return { id: req.id, outputPath: absPath, skipped: false, success: true }
    }

    // 标准响应：JSON 包含 base64 编码的音频
    const json = (await res.json()) as {
      request_id?: string
      output?: { audio?: string }
      code?: string
      message?: string
    }

    if (!res.ok || json.code) {
      return {
        id: req.id,
        outputPath: absPath,
        skipped: false,
        success: false,
        error: `API 错误 [${json.code ?? res.status}]: ${json.message ?? '未知错误'}`,
      }
    }

    if (!json.output?.audio) {
      return {
        id: req.id,
        outputPath: absPath,
        skipped: false,
        success: false,
        error: `响应中无 audio 字段: ${JSON.stringify(json).slice(0, 200)}`,
      }
    }

    writeFileSync(absPath, Buffer.from(json.output.audio, 'base64'))
    return { id: req.id, outputPath: absPath, skipped: false, success: true }
  } catch (e) {
    return {
      id: req.id,
      outputPath: absPath,
      skipped: false,
      success: false,
      error: `响应解析失败: ${String(e)}`,
    }
  }
}
