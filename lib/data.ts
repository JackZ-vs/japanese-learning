import stagesData from '@/data/stages.json'
import lessonsData from '@/data/lessons.json'
import grammarData from '@/data/grammar.json'
import vocabData from '@/data/vocabulary.json'
import exercisesData from '@/data/exercises.json'
import resourcesData from '@/data/resources.json'
import type { Stage, Lesson, GrammarPoint, VocabWord, Exercise, Resource, Level } from './types'

export function getStages(): Stage[] {
  return stagesData as Stage[]
}

export function getStage(id: string): Stage | undefined {
  return (stagesData as Stage[]).find(s => s.id === id)
}

export function getLessons(): Lesson[] {
  return lessonsData as Lesson[]
}

export function getLessonsByStage(stageId: string): Lesson[] {
  return (lessonsData as Lesson[])
    .filter(l => l.stageId === stageId)
    .sort((a, b) => a.order - b.order)
}

export function getLessonBySlug(slug: string): Lesson | undefined {
  return (lessonsData as Lesson[]).find(l => l.slug === slug)
}

export function getGrammar(): GrammarPoint[] {
  return grammarData as GrammarPoint[]
}

export function getGrammarById(id: string): GrammarPoint | undefined {
  return (grammarData as GrammarPoint[]).find(g => g.id === id)
}

export function getGrammarByLevel(level: Level): GrammarPoint[] {
  return (grammarData as GrammarPoint[]).filter(g => g.level === level)
}

export function getVocab(): VocabWord[] {
  return vocabData as VocabWord[]
}

export function getVocabByIds(ids: string[]): VocabWord[] {
  return (vocabData as VocabWord[]).filter(v => ids.includes(v.id))
}

export function getVocabByLevel(level: Level): VocabWord[] {
  return (vocabData as VocabWord[]).filter(v => v.level === level)
}

export function getExercises(): Exercise[] {
  return exercisesData as Exercise[]
}

export function getExercisesByIds(ids: string[]): Exercise[] {
  return (exercisesData as Exercise[]).filter(e => ids.includes(e.id))
}

export function getExercisesByLevel(level: Level): Exercise[] {
  return (exercisesData as Exercise[]).filter(e => e.level === level)
}

export function getResources(): Resource[] {
  return resourcesData as Resource[]
}
