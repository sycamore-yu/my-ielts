import { parseWritingBackup, writingChartTypes, writingQuestionTypes, writingTopics } from './writingPhrases'
import type { WritingChartType, WritingPhrase, WritingPhraseState, WritingQuestionType, WritingTask, WritingTopic } from './writingPhrases'

export const WRITING_NOTES_KEY = 'my-ielts-writing-notes-v1'
export const WRITING_REVIEW_KEY = 'my-ielts-writing-review-v1'

export const errorCategories = [
  { id: 'collocation', label: '搭配与词汇' },
  { id: 'grammar', label: '语法与词形' },
  { id: 'data', label: '数据与表达准确性' },
  { id: 'structure', label: '结构与论证' },
] as const

export type ErrorCategory = typeof errorCategories[number]['id']

interface CommonNote {
  id: string
  task: WritingTask
  topic?: WritingTopic
  questionType?: WritingQuestionType
  chartType?: WritingChartType
  favorite: boolean
}

export interface IdeaNote extends CommonNote {
  kind: 'idea'
  task: 'task2'
  title: string
  question: string
  point: string
  reasoning: string
  example: string
  expressions: string
}

export interface ErrorNote extends CommonNote {
  kind: 'error'
  category: ErrorCategory
  original: string
  corrected: string
  rule: string
}

export type WritingNote = IdeaNote | ErrorNote
export interface ReviewRecord { count: number; lastReviewed: string }
export type ReviewRecords = Record<string, ReviewRecord>

export const starterNotes: WritingNote[] = [
  {
    id: 'idea-sample-1',
    kind: 'idea',
    task: 'task2',
    topic: 'education',
    questionType: 'opinion',
    favorite: false,
    title: 'Practical skills in education',
    question: 'Should schools focus more on practical skills?',
    point: 'Schools should place greater emphasis on practical skills.',
    reasoning: 'Practical training prepares students for the demands of the workplace.',
    example: 'Work placements allow students to apply what they have learnt in real situations.',
    expressions: 'practical skills; work placements; apply theoretical knowledge; improve employability',
  },
  {
    id: 'idea-sample-2',
    kind: 'idea',
    task: 'task2',
    topic: 'environment',
    questionType: 'report',
    favorite: false,
    title: 'Reducing urban air pollution',
    question: 'What can cities do to reduce air pollution?',
    point: 'Investing in public transport can help cities cut emissions.',
    reasoning: 'Reliable buses and trains can reduce the number of private car journeys.',
    example: 'Dedicated bus lanes can make public transport a more practical choice for commuters.',
    expressions: 'reduce emissions; traffic congestion; reliable public transport',
  },
  {
    id: 'error-sample-1',
    kind: 'error',
    task: 'task1',
    chartType: 'line',
    category: 'grammar',
    favorite: false,
    original: 'a slowly upward trend',
    corrected: 'a slight upward trend',
    rule: '形容词 slight 修饰名词 trend。描述动词则用 rose slightly。',
  },
  {
    id: 'error-sample-2',
    kind: 'error',
    task: 'task1',
    chartType: 'line',
    category: 'data',
    favorite: false,
    original: 'half percent of the workforce',
    corrected: 'half of the workforce (approximately 50%)',
    rule: 'half percent 表示 0.5%，half of 表示 50%。',
  },
  {
    id: 'error-sample-3',
    kind: 'error',
    task: 'task1',
    category: 'collocation',
    favorite: false,
    original: 'By comparation',
    corrected: 'By comparison / By contrast',
    rule: 'comparation 不是此处的标准搭配。比较用 by comparison；对比用 by contrast。',
  },
  {
    id: 'error-sample-4',
    kind: 'error',
    task: 'task1',
    category: 'grammar',
    favorite: false,
    original: 'throughout the periods',
    corrected: 'throughout the period',
    rule: '当整个图表覆盖一个连续时间段时，使用单数 period。',
  },
]

const validTask = (value: unknown): value is WritingTask => value === 'task1' || value === 'task2'
const hasId = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0

function validCommon(entry: Record<string, unknown>) {
  return hasId(entry.id) && validTask(entry.task) && typeof entry.favorite === 'boolean'
    && (entry.topic === undefined || writingTopics.some(item => item.id === entry.topic))
    && (entry.chartType === undefined || writingChartTypes.some(item => item.id === entry.chartType))
    && (entry.questionType === undefined || writingQuestionTypes.some(item => item.id === entry.questionType))
}

export function isWritingNote(value: unknown): value is WritingNote {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return false
  const note = value as Record<string, unknown>
  if (!validCommon(note))
    return false
  if (note.kind === 'idea') {
    return note.task === 'task2' && ['title', 'question', 'point', 'reasoning', 'example', 'expressions']
      .every(key => typeof note[key] === 'string') && hasId(note.title)
  }
  if (note.kind === 'error') {
    return errorCategories.some(category => category.id === note.category)
      && ['original', 'corrected', 'rule'].every(key => typeof note[key] === 'string')
      && hasId(note.original) && hasId(note.corrected)
  }
  return false
}

export function parseWritingNotes(json: string): WritingNote[] {
  const parsed: unknown = JSON.parse(json)
  if (!Array.isArray(parsed) || !parsed.every(isWritingNote))
    throw new Error('笔记格式错误')
  return parsed
}

export function loadWritingNotes(storage: Pick<Storage, 'getItem'> = localStorage): WritingNote[] {
  try {
    const saved = storage.getItem(WRITING_NOTES_KEY)
    return saved === null ? starterNotes.map(note => ({ ...note })) : parseWritingNotes(saved)
  }
  catch {
    return starterNotes.map(note => ({ ...note }))
  }
}

export function parseReviewRecords(json: string): ReviewRecords {
  const parsed: unknown = JSON.parse(json)
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
    throw new Error('复习数据格式错误')
  for (const value of Object.values(parsed)) {
    if (!value || typeof value !== 'object' || Array.isArray(value))
      throw new Error('复习数据格式错误')
    const record = value as Record<string, unknown>
    if (!Number.isSafeInteger(record.count) || Number(record.count) < 0 || typeof record.lastReviewed !== 'string')
      throw new Error('复习数据格式错误')
  }
  return parsed as ReviewRecords
}

export function loadReviewRecords(storage: Pick<Storage, 'getItem'> = localStorage): ReviewRecords {
  try {
    return parseReviewRecords(storage.getItem(WRITING_REVIEW_KEY) || '{}')
  }
  catch {
    return {}
  }
}

export function markReview(records: ReviewRecords, key: string, reviewedAt: string): ReviewRecords {
  return { ...records, [key]: { count: (records[key]?.count || 0) + 1, lastReviewed: reviewedAt } }
}

export function mergeWritingNotes(existing: WritingNote[], incoming: WritingNote[]): WritingNote[] {
  const merged = new Map(existing.map(note => [note.id, note]))
  for (const note of incoming)
    merged.set(note.id, note)
  return [...merged.values()]
}

export function noteTags(note: WritingNote): string[] {
  return [
    `task:${note.task}`,
    ...(note.topic ? [`topic:${note.topic}`] : []),
    ...(note.questionType ? [`question:${note.questionType}`] : []),
    ...(note.chartType ? [`chart:${note.chartType}`] : []),
    ...(note.kind === 'error' ? [`error:${note.category}`] : []),
  ]
}

export function noteSearchText(note: WritingNote): string {
  return note.kind === 'idea'
    ? [note.title, note.question, note.point, note.reasoning, note.example, note.expressions].join(' ')
    : [note.original, note.corrected, note.rule].join(' ')
}

export function phraseTags(phrase: WritingPhrase): string[] {
  return [
    `task:${phrase.task}`,
    `category:${phrase.category}`,
    ...(phrase.chartTypes || []).map(tag => `chart:${tag}`),
    ...(phrase.topics || []).map(tag => `topic:${tag}`),
    ...(phrase.questionTypes || []).map(tag => `question:${tag}`),
  ]
}

export interface WritingArchive {
  phrases: WritingPhraseState
  notes?: WritingNote[]
  reviews?: ReviewRecords
}

export function parseWritingArchive(json: string): WritingArchive {
  const data: unknown = JSON.parse(json)
  if (!data || typeof data !== 'object' || Array.isArray(data))
    throw new Error('备份格式错误')
  const content = data as Record<string, unknown>
  return {
    phrases: parseWritingBackup(json),
    notes: content.notes === undefined ? undefined : parseWritingNotes(JSON.stringify(content.notes)),
    reviews: content.reviews === undefined ? undefined : parseReviewRecords(JSON.stringify(content.reviews)),
  }
}
