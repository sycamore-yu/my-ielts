import listeningWords from '../pages/listening/listening179.json'
import readingWords from '../pages/reading/reading538words'

interface ReadingGroup {
  title: string
  words: Array<[number, string, string[], string[], string[], string]>
}

const readingGroups = readingWords as unknown as ReadingGroup[]

export const READING_CHAPTER_PREFIX = '阅读 · '
export const LISTENING_CHAPTER = '听力 · 179 考点词'
export const READING_CHAPTERS = readingGroups.map(group => `${READING_CHAPTER_PREFIX}${group.title}`)
export const STUDY_CHAPTERS = [...READING_CHAPTERS, LISTENING_CHAPTER]

export interface TypingWord {
  word: string[]
  meaning: string
  example: string
  pos: string
}

export function getStudyWords(chapter: string): TypingWord[] | null {
  if (chapter === LISTENING_CHAPTER) {
    return listeningWords.map(entry => ({
      word: [entry.word],
      meaning: entry.meaning,
      pos: entry.type,
      example: entry.replace.length ? `同义替换：${entry.replace.join(', ')}` : '',
    }))
  }

  const group = readingGroups.find(item => `${READING_CHAPTER_PREFIX}${item.title}` === chapter)
  if (!group)
    return null
  return group.words.map(entry => ({
    word: [entry[1]],
    meaning: entry[3].join('；'),
    pos: entry[2].join(' / '),
    example: entry[4].length ? `同义替换：${entry[4].join(', ')}` : '',
  }))
}

export function checkSpelling(input: string, target: string): boolean {
  const normalize = (value: string) => value.normalize('NFKC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('en')
  return normalize(input) === normalize(target)
}
