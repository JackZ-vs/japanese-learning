/** TTS 任务请求（对应 seed 文件中的每一条记录） */
export interface TtsRequest {
  id: string
  type: 'kana' | 'vocab' | 'grammar-example' | 'reading'
  level: string
  text: string
  /** 静态文件输出路径，相对于项目根目录，例如 public/audio/kana/a.mp3 */
  outputPath: string
  /** 页面中 <AudioButton url=...> 使用的静态路径，例如 /audio/kana/a.mp3 */
  audioUrl: string
  /** 该音频对应哪个页面，便于排查 */
  page: string
  /** 来源数据 ID，例如 v-ohayou、g-desu */
  sourceId: string
  note?: string
}

/** 阿里云 TTS 调用配置（所有参数集中管理，不散落各处） */
export interface TtsConfig {
  /** DashScope 模型名，默认 cosyvoice-v1 */
  model: string
  /**
   * 发音人 ID，默认 longxiaochun_v2（支持日语的女声）
   * 可通过环境变量 DASHSCOPE_VOICE 覆盖
   * 如需查看最新可用音色，请登录阿里云 Model Studio 控制台 → 语音合成 → 音色列表
   */
  voice: string
  /** 输出格式，优先 mp3（浏览器原生支持，文件小）*/
  format: 'mp3' | 'wav' | 'pcm'
  sampleRate: number
  /** 音量，0-100 */
  volume: number
  /** 语速，-500 ~ 500，0 为默认速度 */
  speechRate: number
  /** 语调，-500 ~ 500，0 为默认语调 */
  pitchRate: number
}

/** 单次 TTS 调用结果 */
export interface TtsResult {
  id: string
  outputPath: string
  /** true = 文件已存在被跳过，未调用 API */
  skipped: boolean
  success: boolean
  error?: string
}
