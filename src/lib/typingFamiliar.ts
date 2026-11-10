export const TYPING_FAMILIAR_KEY = 'my-ielts-typing-familiar-v1'

export type FamiliarWords = Record<string, string[]>

function normalizeWord(word: string) {
  return word.trim().replace(/\s+/g, ' ').toLowerCase()
}

export function loadFamiliarWords(storage: Pick<Storage, 'getItem'> = localStorage): FamiliarWords {
  try {
    const saved: unknown = JSON.parse(storage.getItem(TYPING_FAMILIAR_KEY) || '{}')
    if (!saved || typeof saved !== 'object' || Array.isArray(saved))
      return {}
    return Object.fromEntries(Object.entries(saved)
      .filter((entry): entry is [string, string[]] => Array.isArray(entry[1]))
      .map(([chapter, words]) => [chapter, [...new Set(words.filter((word): word is string => typeof word === 'string').map(normalizeWord))]]))
  }
  catch {
    return {}
  }
}

export function isFamiliarWord(familiar: FamiliarWords, chapter: string, word: string) {
  return familiar[chapter]?.includes(normalizeWord(word)) ?? false
}

export function addFamiliarWord(familiar: FamiliarWords, chapter: string, word: string): FamiliarWords {
  if (isFamiliarWord(familiar, chapter, word))
    return familiar
  return { ...familiar, [chapter]: [...(familiar[chapter] || []), normalizeWord(word)] }
}

export function clearFamiliarChapter(familiar: FamiliarWords, chapter: string): FamiliarWords {
  const updated = { ...familiar }
  delete updated[chapter]
  return updated
}
