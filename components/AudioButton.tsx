'use client'
import { useRef, useState } from 'react'

// ─── 全局音频管理 ─────────────────────────────────────────────────────────────
// 保证同时只有一个音频在播放，避免多音频叠加混乱
let currentAudio: HTMLAudioElement | null = null
let currentSetter: ((v: boolean) => void) | null = null

function stopCurrent() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio = null
  }
  if (currentSetter) {
    currentSetter(false)
    currentSetter = null
  }
}

// ─── 组件 ─────────────────────────────────────────────────────────────────────

interface AudioButtonProps {
  /** 音频文件的静态路径，例如 /audio/kana/a.mp3 */
  url: string
  /** 按钮尺寸：sm（词汇卡片/例句行内）| md（假名格子内）*/
  size?: 'sm' | 'md'
  /** 额外 className，用于外部微调定位 */
  className?: string
}

export default function AudioButton({ url, size = 'sm', className = '' }: AudioButtonProps) {
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation() // 防止冒泡触发父元素的 onClick（如假名高亮）

    if (playing) {
      // 点击正在播放的按钮 → 停止
      stopCurrent()
      return
    }

    // 停掉其他正在播放的音频
    stopCurrent()

    // 懒创建 Audio 对象
    if (!audioRef.current) {
      audioRef.current = new Audio(url)
    } else {
      audioRef.current.src = url
      audioRef.current.load()
    }

    audioRef.current.onended = () => {
      setPlaying(false)
      currentAudio = null
      currentSetter = null
    }
    audioRef.current.onerror = () => {
      setPlaying(false)
      currentAudio = null
      currentSetter = null
    }

    currentAudio = audioRef.current
    currentSetter = setPlaying
    audioRef.current.play().catch(() => {
      setPlaying(false)
      currentAudio = null
      currentSetter = null
    })
    setPlaying(true)
  }

  const sizeClass = size === 'md'
    ? 'w-7 h-7'
    : 'w-5 h-5'
  const iconSize = size === 'md' ? 14 : 11

  return (
    <button
      onClick={handleClick}
      aria-label={playing ? '停止播放' : '播放发音'}
      title={playing ? '停止播放' : '播放发音'}
      className={`
        ${sizeClass} rounded-full flex items-center justify-center shrink-0
        transition-colors duration-150 select-none
        ${playing
          ? 'bg-[#1e3a5f] text-white'
          : 'bg-gray-100 text-gray-400 hover:bg-[#1e3a5f]/10 hover:text-[#1e3a5f]'
        }
        ${className}
      `}
    >
      {playing ? (
        // 停止图标（两条竖线）
        <svg width={iconSize} height={iconSize} viewBox="0 0 14 14" fill="currentColor">
          <rect x="2" y="2" width="4" height="10" rx="1" />
          <rect x="8" y="2" width="4" height="10" rx="1" />
        </svg>
      ) : (
        // 扬声器图标
        <svg width={iconSize} height={iconSize} viewBox="0 0 14 14" fill="currentColor">
          <path d="M7 1.5 L3.5 5 H1 v4 h2.5 L7 12.5 V1.5z" />
          <path
            d="M9.5 4.5 a3.5 3.5 0 0 1 0 5"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M11.5 2.5 a6 6 0 0 1 0 9"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      )}
    </button>
  )
}
