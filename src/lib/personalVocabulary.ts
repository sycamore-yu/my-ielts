import { ref } from 'vue'

export interface PersonalEntry {
  word: string
  meaning: string
  example: string
  note: string
}

export const PERSONAL_CHAPTER = '我的单词'
export const PERSONAL_STORAGE_KEY = 'my-ielts-personal-vocabulary-v1'
const IMPORTED_STARTERS_KEY = 'my-ielts-personal-starter-words-v1'

// These phrases were transcribed from the screenshot provided for this fork.
// The covered/illegible last line has deliberately been omitted.
const starterEntries: PersonalEntry[] = [
  ['amount of electricity produced', '发电量'],
  ['source of electricity', '电力来源'],
  ['means of electricity generation', '发电方式'],
  ['over a period of', '在一段时间内'],
  ['over the period shown', '在图示期间'],
  ['by far the most important', '远比其他项重要'],
  ['a negligible amount', '微不足道的数量'],
  ['nuclear power overtook thermal power', '核电超过火电'],
  ['as the primary source of electricity', '作为主要电力来源'],
  ['rose dramatically to a peak of', '大幅上升至峰值'],
  ['by contrast', '相比之下'],
  ['the figure for', '……的数据'],
  ['remained at this level', '维持在这一水平'],
  ['remained stable', '保持稳定'],
].map(([word, meaning]) => ({ word, meaning, example: '', note: '写作短语截图' }))

function compact(value: unknown): string {
  if (Array.isArray(value))
    value = value[0]
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : ''
}

function record(value: unknown): PersonalEntry | null {
  if (typeof value === 'string')
    value = { word: value }
  if (!value || typeof value !== 'object' || Array.isArray(value))
    return null
  const v = value as Record<string, unknown>
  const word = compact(v.word ?? v.text ?? v.term ?? v.phrase ?? v.expression)
  if (!word)
    return null
  return {
    word,
    meaning: compact(v.meaning ?? v.translation ?? v.trans ?? v.definition),
    example: compact(v.example ?? v.context ?? v.sentence),
    note: compact(v.note ?? v.notes),
  }
}

export function mergeEntries(existing: PersonalEntry[], incoming: unknown[]): PersonalEntry[] {
  const result = [...existing]
  const indices = new Map(result.map((entry, index) => [entry.word.toLocaleLowerCase(), index]))
  for (const raw of incoming) {
    const entry = record(raw)
    if (!entry)
      continue
    const key = entry.word.toLocaleLowerCase()
    const index = indices.get(key)
    if (index === undefined) {
      indices.set(key, result.length)
      result.push(entry)
    }
    else {
      const old = result[index]
      result[index] = {
        ...old,
        ...Object.fromEntries(Object.entries(entry).filter(([field, value]) => field === 'word' || value)),
      }
    }
  }
  return result
}

// CSV/TSV with quoted fields, including commas and newlines inside quotes.
function parseDelimited(text: string, delimiter: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        cell += '"'
        i++
      }
      else if (char === '"') {
        quoted = false
      }
      else {
        cell += char
      }
    }
    else if (char === '"' && !cell) {
      quoted = true
    }
    else if (char === delimiter) {
      row.push(cell)
      cell = ''
    }
    else if (char === '\n') {
      row.push(cell)
      if (row.some(v => v.trim()))
        rows.push(row)
      row = []
      cell = ''
    }
    else if (char !== '\r') {
      cell += char
    }
  }
  if (quoted)
    throw new Error('导入文件存在未闭合的引号')
  row.push(cell)
  if (row.some(v => v.trim()))
    rows.push(row)
  return rows
}

export function parsePersonalImport(input: string, filename = ''): PersonalEntry[] {
  const text = input.replace(/^\uFEFF/, '').trim()
  if (!text)
    return []
  if (filename.toLowerCase().endsWith('.json') || /^[\[{]/.test(text)) {
    const data = JSON.parse(text)
    const records = Array.isArray(data) ? data : (data.entries ?? data.words)
    if (!Array.isArray(records))
      throw new Error('JSON 应包含词条数组，或 entries / words 数组')
    return mergeEntries([], records)
  }

  // Saladict exports with a customizable template. Supports both recommended
  // tab separation and the backtick separator from Saladict's Anki guide.
  const firstLine = text.split(/\r?\n/, 1)[0]
  const delimiter = firstLine.includes('\t') ? '\t' : firstLine.includes('`') ? '`' : firstLine.includes(',') && filename.endsWith('.csv') ? ',' : null
  if (!delimiter)
    return mergeEntries([], text.split(/\r?\n/))

  const rows = parseDelimited(text, delimiter)
  const headers = rows[0].map(s => s.trim().toLowerCase())
  const nameFields = ['word', 'text', 'term', 'phrase', 'expression']
  const hasHeader = headers.some(h => nameFields.includes(h))
  const column = (names: string[], fallback: number) => hasHeader ? headers.findIndex(h => names.includes(h)) : fallback
  const wordIndex = column(nameFields, 0)
  const meaningIndex = column(['meaning', 'translation', 'trans', 'definition'], 1)
  const exampleIndex = column(['example', 'context', 'sentence'], 2)
  const noteIndex = column(['note', 'notes'], 3)
  const cell = (cells: string[], index: number) => index >= 0 ? cells[index] || '' : ''
  return mergeEntries([], rows.slice(hasHeader ? 1 : 0).map(row => ({
    word: cell(row, wordIndex),
    // Saladict's documented Anki export orders Word, Context, Translation, Note.
    meaning: cell(row, delimiter === '`' && !hasHeader ? 2 : meaningIndex),
    example: cell(row, delimiter === '`' && !hasHeader ? 1 : exampleIndex),
    note: cell(row, noteIndex),
  })))
}

function load(): PersonalEntry[] {
  if (typeof localStorage === 'undefined')
    return [...starterEntries]
  try {
    const saved = localStorage.getItem(PERSONAL_STORAGE_KEY)
    const seen = JSON.parse(localStorage.getItem(IMPORTED_STARTERS_KEY) || '[]') as string[]
    localStorage.setItem(IMPORTED_STARTERS_KEY, JSON.stringify(starterEntries.map(item => item.word)))
    if (saved === null)
      return [...starterEntries]
    const existing = mergeEntries([], JSON.parse(saved))
    // New screenshot batches added to the fork will appear on existing browsers.
    // Previously removed words stay removed.
    return mergeEntries(existing, starterEntries.filter(entry => !seen.includes(entry.word)))
  }
  catch {
    return [...starterEntries]
  }
}

export const personalEntries = ref<PersonalEntry[]>(load())

export function savePersonalEntries(entries: PersonalEntry[]) {
  personalEntries.value = entries
  localStorage.setItem(PERSONAL_STORAGE_KEY, JSON.stringify(entries))
}

export function addPersonalEntries(entries: unknown[]) {
  const updated = mergeEntries(personalEntries.value, entries)
  savePersonalEntries(updated)
  return updated.length
}
