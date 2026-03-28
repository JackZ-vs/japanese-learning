# 静态音频系统使用说明

本项目使用预生成的静态 MP3 音频文件，通过阿里云 DashScope CosyVoice TTS 批量合成，部署时直接随静态资源一起发布。

---

## 目录结构

```
public/audio/
├── kana/          # 假名发音（a.mp3, i.mp3, ka.mp3, shi.mp3 等）
├── vocab/         # 单词发音（v-desu.mp3, v-desu_ex0.mp3 等）
├── grammar/       # 语法例句（g-desu_ex0.mp3, g-wa_ex1.mp3 等）
└── readings/      # 课文朗读（预留，暂未生成）

scripts/
├── audio-seed.json       # 音频生成清单（109 条）
└── generate-audio.ts     # 批量生成脚本

lib/tts/
├── types.ts              # TTS 接口类型定义
└── alibabaTts.ts         # 阿里云 DashScope 实现
```

---

## 配置 API Key

在项目根目录创建 `.env.local` 文件（已加入 `.gitignore`，不会提交到仓库）：

```
DASHSCOPE_API_KEY=your_api_key_here

# 可选：自定义音色（默认 longxiaochun_v2，支持中日双语）
# DASHSCOPE_VOICE=longxiaochun_v2
```

获取 API Key：登录 [DashScope 控制台](https://dashscope.console.aliyun.com/) → API Key 管理

---

## 生成音频

### 安装依赖（首次）

```bash
npm install
```

### 生成全部音频（增量模式，跳过已有文件）

```bash
npm run gen:audio
```

### 强制重新生成所有音频

```bash
npm run gen:audio -- --force
```

### 只生成前 N 条（用于测试）

```bash
npm run gen:audio -- --limit 5
```

### 只生成某类型

```bash
npm run gen:audio -- --type kana        # 只生成假名
npm run gen:audio -- --type vocab       # 只生成单词
npm run gen:audio -- --type grammar-example  # 只生成语法例句
```

### 组合参数

```bash
npm run gen:audio -- --force --limit 10 --type vocab
```

---

## Seed 文件说明

`scripts/audio-seed.json` 是音频生成的"清单"，每条包含：

| 字段 | 说明 |
|------|------|
| `id` | 唯一标识符 |
| `type` | 类型：`kana` / `vocab` / `grammar-example` / `reading` |
| `level` | 学习等级：`beginner` / `n5` / `n4` 等 |
| `text` | 要合成的日语文本 |
| `outputPath` | 输出文件路径（相对于项目根目录） |
| `audioUrl` | 浏览器访问路径（写入 JSON 数据的值） |
| `page` | 对应的页面路径 |
| `sourceId` | 来源数据的 ID |
| `note` | 备注（可选） |

---

## 增量更新（新增词汇/例句）

1. 在 `scripts/audio-seed.json` 末尾追加新条目
2. 在对应的 `data/*.json` 中添加 `"audioUrl"` 字段，值与 seed 的 `audioUrl` 一致
3. 运行 `npm run gen:audio`（已有文件自动跳过）

---

## 音色说明

默认音色 `longxiaochun_v2`：
- CosyVoice 自然女声，支持**中日双语**
- 适合语言学习内容，发音清晰自然
- 如需更换，在 `.env.local` 中设置 `DASHSCOPE_VOICE=其他音色ID`

可用音色列表：[DashScope 控制台](https://dashscope.console.aliyun.com/) → 模型广场 → CosyVoice

---

## 假名音频共享规则

以下假名在现代日语中发音相同，共用同一个音频文件：

| 假名 | 音频文件 | 说明 |
|------|---------|------|
| ぢ / ヂ | `ji.mp3` | 与じ/ジ发音相同 |
| づ / ヅ | `zu.mp3` | 与ず/ズ发音相同 |

---

## 切换 TTS Provider

如需接入其他 TTS 服务（如 Google TTS、Azure TTS），只需：

1. 在 `lib/tts/` 下新建实现文件（如 `googleTts.ts`），实现 `synthesize(req, config)` 函数
2. 在 `scripts/generate-audio.ts` 中修改 import 路径
3. 核心的 `TtsRequest` / `TtsResult` 类型定义保持不变

---

## 部署说明

音频文件位于 `public/audio/`，会随 `next build` / `next export` 一起打包，无需额外配置。

Vercel 部署：`git push` 时自动触发构建，音频文件作为静态资源自动发布。

> 注意：若音频文件较多（100+ 个），建议在本地生成完毕后再提交到 git，避免 Vercel 构建超时。
