/**
 * 阿里云 DashScope CosyVoice TTS 实现（WebSocket 协议）
 *
 * API 文档：https://help.aliyun.com/zh/model-studio/cosyvoice-websocket-api
 *
 * 接口地址：wss://dashscope.aliyuncs.com/api-ws/v1/inference
 *
 * 认证方式：WebSocket 握手时请求头 Authorization: Bearer {DASHSCOPE_API_KEY}
 *
 * 协议流程：
 *   1. 建立 WebSocket 连接
 *   2. 发送 run-task（指定模型、音色、格式）
 *   3. 收到 task-started 后发送 continue-task（文本内容）
 *   4. 发送 finish-task
 *   5. 接收 result-generated 事件（二进制音频分块或 base64）
 *   6. 收到 task-finished 后关闭连接，拼接所有分块写入文件
 *
 * 本模块只在 Node.js（生成脚本）中运行，不在浏览器端执行。
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { randomUUID } from 'crypto'
import WebSocket from 'ws'
import type { TtsRequest, TtsConfig, TtsResult } from './types'

const WS_URL = 'wss://dashscope.aliyuncs.com/api-ws/v1/inference'

/**
 * 默认 TTS 配置
 *
 * model: cosyvoice-v3-flash — 有免费额度，支持中日双语
 * voice: longxiaochun_v2   — 自然女声
 *
 * 如需切换音色，可在 .env.local 中设置 DASHSCOPE_VOICE=xxx
 */
export const DEFAULT_TTS_CONFIG: TtsConfig = {
  model: 'cosyvoice-v3-flash',
  voice: 'loongtomoka_v3',
  format: 'mp3',
  sampleRate: 22050,
  volume: 50,
  speechRate: 0,
  pitchRate: 0,
}

/**
 * 合成一条语音并写入本地文件（WebSocket 协议）
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

  if (existsSync(absPath)) {
    return { id: req.id, outputPath: absPath, skipped: true, success: true }
  }

  mkdirSync(dirname(absPath), { recursive: true })

  const voice = process.env.DASHSCOPE_VOICE || config.voice
  const taskId = randomUUID()

  return new Promise((done) => {
    const ws = new WebSocket(WS_URL, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })

    const audioChunks: Buffer[] = []
    let failed: string | null = null

    ws.on('open', () => {
      // Step 1: run-task
      ws.send(JSON.stringify({
        header: { action: 'run-task', task_id: taskId, streaming: 'duplex' },
        payload: {
          task_group: 'audio',
          task: 'tts',
          function: 'SpeechSynthesizer',
          model: config.model,
          parameters: {
            voice,
            format: config.format,
            sample_rate: config.sampleRate,
            volume: config.volume,
            speech_rate: config.speechRate,
            pitch_rate: config.pitchRate,
          },
          input: {},
        },
      }))
    })

    ws.on('message', (data, isBinary) => {
      if (isBinary) {
        // 二进制音频分块
        audioChunks.push(Buffer.from(data as Buffer))
        return
      }

      let msg: {
        header?: { event?: string; error_code?: string; error_message?: string }
        payload?: { output?: { audio?: string } }
      }
      try {
        msg = JSON.parse(data.toString())
      } catch {
        return
      }

      const event = msg.header?.event

      if (event === 'task-started') {
        // Step 2: 发送文本
        ws.send(JSON.stringify({
          header: { action: 'continue-task', task_id: taskId },
          payload: { input: { text: req.text } },
        }))
        // Step 3: 通知文本发送完毕
        ws.send(JSON.stringify({
          header: { action: 'finish-task', task_id: taskId },
          payload: { input: { text: '' } },
        }))
      } else if (event === 'result-generated') {
        // JSON 中的 base64 音频（部分版本）
        const b64 = msg.payload?.output?.audio
        if (b64) audioChunks.push(Buffer.from(b64, 'base64'))
      } else if (event === 'task-finished') {
        ws.close()
      } else if (event === 'task-failed') {
        failed = `${msg.header?.error_code ?? 'error'}: ${msg.header?.error_message ?? '未知错误'}`
        ws.close()
      }
    })

    ws.on('close', () => {
      if (failed) {
        done({ id: req.id, outputPath: absPath, skipped: false, success: false, error: failed })
        return
      }
      if (audioChunks.length === 0) {
        done({ id: req.id, outputPath: absPath, skipped: false, success: false, error: '未收到音频数据' })
        return
      }
      writeFileSync(absPath, Buffer.concat(audioChunks))
      done({ id: req.id, outputPath: absPath, skipped: false, success: true })
    })

    ws.on('error', (e) => {
      done({ id: req.id, outputPath: absPath, skipped: false, success: false, error: `WebSocket 错误: ${e.message}` })
    })
  })
}
