export type Level = 'beginner' | 'elementary' | 'n5' | 'n4' | 'n3' | 'n2'

export interface Stage {
  id: string
  title: string
  titleJa: string
  level: Level
  color: string
  description: string
  goals: string[]
  prerequisites: string[]
  lessonIds: string[]
  coreTopics: string[]
}

export interface Lesson {
  id: string
  stageId: string
  slug: string
  title: string
  titleJa?: string
  summary: string
  goals: string[]
  vocabIds: string[]
  grammarIds: string[]
  exerciseIds: string[]
  nextLessonSlug?: string
  prevLessonSlug?: string
  order: number
}

export interface GrammarPoint {
  id: string
  level: Level
  title: string
  meaning: string
  structure: string
  usageNotes: string
  commonMistakes: string
  whenToUse?: string
  chineseTrap?: string
  memoryTip?: string
  examples: Array<{ ja: string; reading: string; zh: string }>
  compareWith?: string[]
  tags: string[]
}

export interface LessonSection {
  type: 'explainer' | 'examples' | 'mistake-box' | 'tip-box' | 'table' | 'summary' | 'compare'
  title?: string
  text?: string
  items?: string[]
  examples?: Array<{ ja: string; reading: string; zh: string; note?: string }>
  rows?: string[][]
}

export interface LessonRichContent {
  slug: string
  prereqs?: string[]
  sections: LessonSection[]
}

export interface VocabWord {
  id: string
  level: Level
  word: string
  reading: string
  meaningZh: string
  partOfSpeech: string
  exampleSentences: Array<{ ja: string; reading: string; zh: string }>
  tags: string[]
}

export interface Exercise {
  id: string
  level: Level
  lessonId?: string
  type: 'multiple-choice' | 'fill-blank' | 'particle' | 'reorder'
  prompt: string
  options?: string[]
  answer: string | number
  explanation: string
  relatedGrammarIds: string[]
  difficulty: 1 | 2 | 3
}

export interface Resource {
  id: string
  category: 'official' | 'platform' | 'reading' | 'tool' | 'community'
  title: string
  description: string
  url: string
  recommendedFor: string
  why: string
  caution?: string
  level: Level[]
}
